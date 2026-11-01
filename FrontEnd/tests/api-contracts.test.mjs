import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { AxiosError, AxiosHeaders } from "axios";
import { z } from "zod";

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};

const { default: api } = await import("../src/lib/axios.ts");
const auth = await import("../src/api/AuthApi.ts");
const { ApiError, normalizeApiError } = await import("../src/api/errors.ts");
const { successMessage } = await import("../src/utils/presentation.ts");
const user = {
  _id: "test-user",
  name: "Cuenta de prueba",
  email: "demo@example.invalid",
};
const login = { email: user.email, password: "synthetic-password" };
const password = {
  password: "new-synthetic-password",
  password_confirmation: "new-synthetic-password",
};

const endpoints = [
  {
    name: "createAccount",
    path: "/auth/create-account",
    payload: {
      name: user.name,
      ...login,
      password_confirmation: login.password,
    },
  },
  {
    name: "confirmAccount",
    path: "/auth/confirm-account",
    payload: { token: "123456" },
  },
  {
    name: "RequestConfirmationCode",
    path: "/auth/request-code",
    payload: { email: user.email },
  },
  { name: "authenticateUser", path: "/auth/login", payload: login },
  {
    name: "forgotPassword",
    path: "/auth/forgot-password",
    payload: { email: user.email },
  },
  {
    name: "validateToken",
    path: "/auth/validate-token",
    payload: { token: "123456" },
  },
  {
    name: "updatePasswordWithToken",
    path: "/auth/update-password/123456",
    payload: password,
    args: { formData: password, token: "123456" },
  },
  { name: "getUser", path: "/auth/user", method: "get", response: user },
  {
    name: "checkPassword",
    path: "/auth/check-password",
    payload: { password: login.password },
  },
];

function response(config, data, status = 200) {
  return {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
  };
}

function backendError(data, status = 422, config = {}) {
  return new AxiosError(
    "Backend error",
    "ERR_BAD_REQUEST",
    config,
    undefined,
    response(config, data, status),
  );
}

beforeEach(() => {
  storage.clear();
  // Fail closed: a test that forgets to install a mock cannot make a request.
  api.defaults.adapter = async () => {
    throw new Error("No adapter configured for this test");
  };
});

for (const endpoint of endpoints) {
  const invoke = () => auth[endpoint.name](endpoint.args ?? endpoint.payload);

  test(`${endpoint.name}: network failure rejects instead of reporting success`, async () => {
    api.defaults.adapter = async (config) => {
      throw new AxiosError("Offline", "ERR_NETWORK", config);
    };
    await assert.rejects(
      invoke,
      (error) =>
        error instanceof ApiError &&
        /conectar/.test(error.message) &&
        error.status === undefined,
    );
    assert.equal(storage.get("AUTH_TOKEN"), undefined);
  });

  test(`${endpoint.name}: backend error and HTTP status survive normalization`, async () => {
    api.defaults.adapter = async (config) => {
      throw backendError({ error: "Sesión no autorizada" }, 401, config);
    };
    await assert.rejects(
      invoke,
      (error) =>
        error instanceof ApiError &&
        error.status === 401 &&
        error.message === "Sesión no autorizada",
    );
  });

  test(`${endpoint.name}: method, route and payload keep their existing contract`, async () => {
    let observed;
    const result =
      endpoint.response ??
      (endpoint.name === "authenticateUser"
        ? "synthetic-token"
        : "Operación completada");
    api.defaults.adapter = async (config) => {
      observed = config;
      return response(config, result);
    };
    const actual = await invoke();
    assert.equal(observed.method, endpoint.method ?? "post");
    assert.equal(observed.url, endpoint.path);
    assert.equal(observed.baseURL, "http://contracts.invalid/api");
    assert.deepEqual(
      typeof observed.data === "string"
        ? JSON.parse(observed.data)
        : observed.data,
      endpoint.payload,
    );
    assert.deepEqual(actual, result);
  });
}

test("validation errors[].msg becomes a useful combined message", () => {
  const error = normalizeApiError(
    backendError({
      errors: [
        { msg: "Nombre obligatorio" },
        { msg: "Email inválido" },
        { msg: 4 },
      ],
    }),
  );
  assert.equal(error.message, "Nombre obligatorio. Email inválido");
  assert.equal(error.status, 422);
});

test("empty backend error falls back to validation messages", () => {
  const error = normalizeApiError(
    backendError({ error: "  ", errors: [{ msg: "Campo incorrecto" }] }),
  );
  assert.equal(error.message, "Campo incorrecto");
});

test("unknown response shape has a recoverable message and preserves status", () => {
  const error = normalizeApiError(backendError({ unexpected: true }, 503));
  assert.match(error.message, /Vuelve a intentarlo/);
  assert.equal(error.status, 503);
});

test("existing ApiError is not rewritten or stripped of status", () => {
  const error = new ApiError("Respuesta inválida", 403);
  assert.equal(normalizeApiError(error), error);
});

test("Zod feedback preserves the field path and required range", () => {
  const validation = z
    .object({ cantidad: z.number().min(1, "La cantidad debe ser al menos 1") })
    .safeParse({ cantidad: 0 });
  assert.equal(validation.success, false);
  const error = normalizeApiError(validation.error);
  assert.ok(error instanceof ApiError);
  assert.equal(error.message, "cantidad: La cantidad debe ser al menos 1");
  assert.equal(error.status, undefined);
});

for (const invalidUser of [
  null,
  {},
  { ...user, email: "invalid" },
  { name: user.name, email: user.email },
]) {
  test(`getUser rejects invalid account shape: ${JSON.stringify(invalidUser)}`, async () => {
    api.defaults.adapter = async (config) => response(config, invalidUser);
    await assert.rejects(
      () => auth.getUser(),
      (error) =>
        error instanceof ApiError && /cuenta no es válida/.test(error.message),
    );
  });
}

for (const invalidToken of [undefined, null, {}, [], 42, "", "   "]) {
  test(`login rejects invalid token without replacing existing storage: ${JSON.stringify(invalidToken)}`, async () => {
    storage.set("AUTH_TOKEN", "previous-test-token");
    api.defaults.adapter = async (config) => response(config, invalidToken);
    await assert.rejects(
      () => auth.authenticateUser(login),
      (error) =>
        error instanceof ApiError &&
        /inicio de sesión no es válida/.test(error.message),
    );
    assert.equal(storage.get("AUTH_TOKEN"), "previous-test-token");
  });
}

test("valid login stores the non-empty string token unchanged", async () => {
  api.defaults.adapter = async (config) => response(config, "valid-test-token");
  assert.equal(await auth.authenticateUser(login), "valid-test-token");
  assert.deepEqual([...storage], [["AUTH_TOKEN", "valid-test-token"]]);
});

test("authenticated request retains existing Bearer header behavior", async () => {
  storage.set("AUTH_TOKEN", "existing-test-token");
  let header;
  api.defaults.adapter = async (config) => {
    header = config.headers.get("Authorization");
    return response(config, user);
  };
  await auth.getUser();
  assert.equal(header, "Bearer existing-test-token");
});

test("success feedback accepts a non-empty backend string", () => {
  assert.equal(
    successMessage("  Guardado correctamente  ", "Operación completada"),
    "Guardado correctamente",
  );
});

test("success feedback extracts message from a backend response object", () => {
  assert.equal(
    successMessage(
      { message: "Reptil guardado", reptil: { name: "Demo" } },
      "Guardado",
    ),
    "Reptil guardado",
  );
});

test("success feedback extracts msg from a backend response object", () => {
  assert.equal(
    successMessage({ msg: "Nota actualizada" }, "Guardado"),
    "Nota actualizada",
  );
});

test("success feedback can use msg when message is empty or not display text", () => {
  assert.equal(
    successMessage({ message: "   ", msg: "Comida registrada" }, "Guardado"),
    "Comida registrada",
  );
  assert.equal(
    successMessage({ message: {}, msg: "Pesaje registrado" }, "Guardado"),
    "Pesaje registrado",
  );
});

test("success feedback uses Spanish fallback instead of rendering unknown objects", () => {
  for (const value of [
    undefined,
    null,
    false,
    42,
    " ",
    {},
    [],
    ["Guardado"],
    { message: {} },
    { msg: 8 },
    { reptil: { name: "Demo" } },
  ]) {
    assert.equal(
      successMessage(value, "Operación completada"),
      "Operación completada",
    );
  }
});

test("success feedback prefers message when both supported fields exist", () => {
  assert.equal(
    successMessage({ message: "Guardado", msg: "Otro mensaje" }, "Fallback"),
    "Guardado",
  );
});

test("success feedback never mutates the returned record", () => {
  const result = Object.freeze({
    message: "  Actualizado  ",
    name: "Ejemplar demo",
  });
  assert.equal(successMessage(result, "Guardado"), "Actualizado");
  assert.equal(result.message, "  Actualizado  ");
  assert.equal(result.name, "Ejemplar demo");
});

const reptiles = await import("../src/api/ReptilApi.ts");
const notes = await import("../src/api/NotesApi.ts");
const weights = await import("../src/api/LogPesajeApi.ts");
const meals = await import("../src/api/LogComidasApi.ts");
const reptileId = "reptile-demo";
const recordId = "record-demo";
const reptileForm = {
  name: "Reptil demo",
  genre: 2,
  birthDate: "2020-03-01",
  description: "Solo datos de prueba",
};
const reptile = { _id: reptileId, ...reptileForm };
const noteForm = {
  name: "Observación demo",
  type: "otro",
  description: "Dato sintético",
};
const weightForm = { peso: 45.5, unidad: "g", observaciones: "Dato sintético" };
const mealForm = {
  cantidad: 2,
  tipoAlimento: "grillo",
  unidad: "unidad",
  suplemento: "calcio",
  apetito: 4,
  nextFeeding: 2,
};

const reptileEndpoints = [
  {
    name: "createReptil",
    invoke: () => reptiles.createReptil(reptileForm),
    method: "post",
    path: "/reptiles/create-reptil",
    payload: reptileForm,
    result: { message: "Creado" },
  },
  {
    name: "getReptiles",
    invoke: () => reptiles.getReptiles(),
    method: "get",
    path: "/reptiles",
    result: [
      {
        _id: reptileId,
        name: reptileForm.name,
        birthDate: reptileForm.birthDate,
      },
    ],
  },
  {
    name: "getReptilById",
    invoke: () => reptiles.getReptilById(reptileId),
    method: "get",
    path: `/reptiles/${reptileId}`,
    result: reptile,
  },
  {
    name: "updateReptileData",
    invoke: () =>
      reptiles.updateReptileData({
        reptilId: reptileId,
        formData: reptileForm,
      }),
    method: "patch",
    path: `/reptiles/update-reptil/${reptileId}`,
    payload: reptileForm,
    result: { message: "Actualizado" },
  },
  {
    name: "deleteReptilById",
    invoke: () => reptiles.deleteReptilById(reptileId),
    method: "delete",
    path: `/reptiles/delete-reptil/${reptileId}`,
    result: { message: "Eliminado" },
  },
];

const historyMutations = [
  { name: "createNote", invoke: () => notes.createNote(reptileId, noteForm) },
  {
    name: "updateNoteData",
    invoke: () =>
      notes.updateNoteData({
        reptilId: reptileId,
        noteId: recordId,
        formData: noteForm,
      }),
  },
  {
    name: "deleteNoteById",
    invoke: () => notes.deleteNoteById(reptileId, recordId),
  },
  {
    name: "createLogPesaje",
    invoke: () => weights.createLogPesaje(reptileId, weightForm),
  },
  {
    name: "updateLogPesajeData",
    invoke: () =>
      weights.updateLogPesajeData({
        reptilId: reptileId,
        logPesajeId: recordId,
        formData: weightForm,
      }),
  },
  {
    name: "deleteLogPesajeById",
    invoke: () => weights.deleteLogPesajeById(reptileId, recordId),
  },
  {
    name: "createLogComidas",
    invoke: () => meals.createLogComidas(reptileId, mealForm),
  },
  {
    name: "updateLogComidasData",
    invoke: () =>
      meals.updateLogComidasData({
        reptilId: reptileId,
        logComidaId: recordId,
        formData: mealForm,
      }),
  },
  {
    name: "deleteLogComidaById",
    invoke: () => meals.deleteLogComidaById(reptileId, recordId),
  },
];

for (const endpoint of [...reptileEndpoints, ...historyMutations]) {
  test(`${endpoint.name}: network failure is a rejected recoverable error`, async () => {
    api.defaults.adapter = async (config) => {
      throw new AxiosError("Offline", "ERR_NETWORK", config);
    };
    await assert.rejects(
      endpoint.invoke,
      (error) =>
        error instanceof ApiError &&
        /conectar/.test(error.message) &&
        error.status === undefined,
    );
  });

  test(`${endpoint.name}: backend error message and HTTP status survive`, async () => {
    api.defaults.adapter = async (config) => {
      throw backendError({ error: "Conflicto de prueba" }, 409, config);
    };
    await assert.rejects(
      endpoint.invoke,
      (error) =>
        error instanceof ApiError &&
        error.message === "Conflicto de prueba" &&
        error.status === 409,
    );
  });

  test(`${endpoint.name}: backend validation messages remain readable`, async () => {
    api.defaults.adapter = async (config) => {
      throw backendError(
        { errors: [{ msg: "Campo requerido" }, { msg: "Valor inválido" }] },
        422,
        config,
      );
    };
    await assert.rejects(
      endpoint.invoke,
      (error) =>
        error instanceof ApiError &&
        error.message === "Campo requerido. Valor inválido" &&
        error.status === 422,
    );
  });
}

for (const endpoint of reptileEndpoints) {
  test(`${endpoint.name}: existing request and response contract is preserved`, async () => {
    let observed;
    api.defaults.adapter = async (config) => {
      observed = config;
      return response(config, endpoint.result);
    };
    assert.deepEqual(await endpoint.invoke(), endpoint.result);
    assert.equal(observed.method, endpoint.method);
    assert.equal(observed.url, endpoint.path);
    assert.deepEqual(
      typeof observed.data === "string"
        ? JSON.parse(observed.data)
        : observed.data,
      endpoint.payload,
    );
  });
}

for (const action of ["create", "update"]) {
  for (const genre of [1, 2, 3]) {
    test(`reptile ${action}: blank birthDate is omitted from JSON and genre ${genre} is preserved`, async () => {
      const formData = Object.freeze({ ...reptileForm, birthDate: "", genre });
      let payload;
      api.defaults.adapter = async (config) => {
        payload = JSON.parse(config.data);
        return response(config, { message: "Guardado" });
      };
      if (action === "create") await reptiles.createReptil(formData);
      else await reptiles.updateReptileData({ reptilId: reptileId, formData });
      assert.equal(Object.hasOwn(payload, "birthDate"), false);
      assert.equal(payload.genre, genre);
      assert.equal(payload.name, formData.name);
      assert.equal(payload.description, formData.description);
      assert.equal(formData.birthDate, "");
    });
  }

  test(`reptile ${action}: supplied birthDate is retained without conversion`, async () => {
    let payload;
    api.defaults.adapter = async (config) => {
      payload = JSON.parse(config.data);
      return response(config, { message: "Guardado" });
    };
    if (action === "create") await reptiles.createReptil(reptileForm);
    else
      await reptiles.updateReptileData({
        reptilId: reptileId,
        formData: reptileForm,
      });
    assert.equal(payload.birthDate, reptileForm.birthDate);
    assert.equal(payload.genre, reptileForm.genre);
  });
}
