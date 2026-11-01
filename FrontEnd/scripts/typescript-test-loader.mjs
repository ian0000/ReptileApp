import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const sourceRoot = new URL("../src/", import.meta.url).href;

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && context.parentURL?.startsWith(sourceRoot)) {
    for (const suffix of [".ts", "/index.ts"]) {
      const candidate = new URL(specifier + suffix, context.parentURL);
      try {
        if ((await stat(candidate)).isFile()) {
          return { url: candidate.href, shortCircuit: true };
        }
      } catch {
        // Let Node resolve packages and existing file extensions normally.
      }
    }
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith(sourceRoot) || !url.endsWith(".ts")) {
    return nextLoad(url, context);
  }
  let source = await readFile(new URL(url), "utf8");
  if (url === new URL("../src/lib/axios.ts", import.meta.url).href) {
    // Vite supplies this expression in the browser. Tests use an isolated
    // dummy origin, and every request is intercepted by an Axios adapter.
    source = source.replaceAll(
      "import.meta.env.VITE_API_URL",
      JSON.stringify("http://contracts.invalid/api"),
    );
  }
  return {
    format: "module",
    shortCircuit: true,
    source: ts.transpileModule(source, {
      fileName: fileURLToPath(url),
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.ESNext,
        verbatimModuleSyntax: true,
      },
    }).outputText,
  };
}
