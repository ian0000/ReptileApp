import { useState } from "react";
import { Link } from "react-router-dom";
import { ActionLink, BrandMark } from "../../design-system/components";
import "./WelcomeView.css";

type RecordKind = "comidas" | "pesajes" | "notas";
const recordOptions: { id: RecordKind; label: string }[] = [
  { id: "comidas", label: "Comidas" },
  { id: "pesajes", label: "Pesajes" },
  { id: "notas", label: "Notas" },
];

const records = {
  comidas: {
    title: "Una comida, con sus detalles.",
    description: "Registra qué comió, la cantidad, el método y tus observaciones. Consulta después el historial de ese ejemplar.",
    name: "Alimentación registrada",
    value: "3 grillos",
    detail: "Cantidad y alimento",
    fields: [
      ["Método", "Pinzas"],
      ["Suplemento", "Calcio"],
      ["Observaciones", "Registro de alimentación de ejemplo."],
    ],
  },
  pesajes: {
    title: "El peso, a lo largo del tiempo.",
    description: "Guarda cada pesaje con su unidad y contexto. Vuelve al historial para consultar los registros y su evolución.",
    name: "Pesaje registrado",
    value: "42,6 g",
    detail: "Peso y unidad",
    fields: [
      ["Contexto", "Control rutinario"],
      ["Unidad", "Gramos"],
      ["Observaciones", "Registro de peso de ejemplo."],
    ],
  },
  notas: {
    title: "Lo que no quieres olvidar.",
    description: "Añade observaciones, clasifícalas y reúne las notas de cada reptil en su propio historial.",
    name: "Muda observada",
    value: "Una nota",
    detail: "Observación registrada",
    fields: [
      ["Tipo", "Comportamiento"],
      ["Etiqueta", "Muda"],
      ["Descripción", "Se registró una muda. Observación de ejemplo."],
    ],
  },
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14m-6-6 6 6-6 6" />
    </svg>
  );
}

export default function WelcomeView() {
  const [activeRecord, setActiveRecord] = useState<RecordKind>("comidas");
  const active = records[activeRecord];

  return (
    <div className="reptile-design welcome-page">
      <title>ReptileApp — Cada reptil, su historia</title>
      <meta name="description" content="Reúne la información de tus reptiles y registra comidas, pesajes y notas. Un historial de cuidado para cada ejemplar, desde la web." />
      <a className="welcome-skip" href="#welcome-main">Saltar al contenido</a>
      <div className="welcome-opening">
        <header className="welcome-header welcome-shell">
          <Link className="welcome-brand" to="/bienvenida" aria-label="ReptileApp — Bienvenida"><BrandMark /></Link>
          <nav aria-label="Navegación de bienvenida" className="welcome-nav">
            <a href="#ejemplo">Ver ejemplo</a>
            <Link to="/auth/login">Iniciar sesión <ArrowIcon /></Link>
          </nav>
        </header>

        <main id="welcome-main" tabIndex={-1}>
          <section className="welcome-hero welcome-shell" aria-labelledby="welcome-title">
            <div className="welcome-hero-copy">
              <h1 id="welcome-title">Cada reptil,<br /><span>su historia.</span></h1>
              <p>Comidas, pesajes y notas: reúne el cuidado de cada ejemplar en un historial que puedes volver a consultar.</p>
              <div className="welcome-actions">
                <ActionLink to="/auth/register">Crear mi cuenta <ArrowIcon /></ActionLink>
                <a className="welcome-hero-secondary" href="#como-funciona">Cómo funciona</a>
              </div>
            </div>
            <div className="welcome-gecko" aria-hidden="true">
              <img src="/images/reptileapp-gecko.webp" width="1000" height="914" alt="" fetchPriority="high" decoding="async" />
            </div>
          </section>

          <section id="ejemplo" className="welcome-example" aria-labelledby="welcome-example-title">
            <div className="welcome-shell welcome-example-layout">
              <div className="welcome-example-copy">
                <h2 id="welcome-example-title">Lo cotidiano,<br />bien registrado.</h2>
                <div className="welcome-record-switch" role="group" aria-label="Elegir el registro de demostración">
                  {recordOptions.map(({ id, label }) => (
                    <button key={id} type="button" aria-pressed={activeRecord === id} aria-controls="welcome-record-preview" onClick={() => setActiveRecord(id)}>{label}</button>
                  ))}
                </div>
                <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                  Demostración de {recordOptions.find(({ id }) => id === activeRecord)?.label.toLowerCase()} seleccionada. {active.name}: {active.value}.
                </p>
                <h3>{active.title}</h3>
                <p>{active.description}</p>
                <p className="welcome-demo-note">Explora esta demostración con datos ficticios. Tus registros se gestionan dentro de tu cuenta.</p>
              </div>

              <div className="welcome-record-preview" id="welcome-record-preview" role="region" aria-label={`Ejemplo de ${recordOptions.find(({ id }) => id === activeRecord)?.label.toLowerCase()}`}>
                <div className="welcome-record-header">
                  <span>Ejemplar de ejemplo</span>
                  <span className="welcome-demo-label">Datos ficticios</span>
                </div>
                <div className={`welcome-record-body welcome-record-body--${activeRecord}`}>
                  <p className="welcome-record-name">{active.name}</p>
                  <p className="welcome-record-value">{active.value}</p>
                  <p className="welcome-record-caption">{active.detail}</p>
                  <dl className="welcome-record-fields">
                    {active.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                  <p className="welcome-record-date">26 oct 2026 · 09:30 · Ejemplo</p>
                </div>
              </div>
            </div>
          </section>

          <section id="como-funciona" className="welcome-routine welcome-shell" aria-labelledby="welcome-routine-title">
            <div className="welcome-routine-intro">
              <h2 id="welcome-routine-title">Un historial<br />por ejemplar.</h2>
              <p>La información del reptil y los registros de su cuidado, conectados desde el principio.</p>
            </div>
            <ol className="welcome-routine-steps">
              <li><h3>Crea tu cuenta.</h3><p>Regístrate y confirma tu correo para acceder a la aplicación.</p></li>
              <li><h3>Añade tu reptil.</h3><p>Guarda su nombre, fecha de nacimiento, género y descripción.</p></li>
              <li><h3>Registra su cuidado.</h3><p>Añade comidas, pesajes y notas. Consulta o edita los registros cuando lo necesites.</p></li>
            </ol>
          </section>

          <div className="welcome-closing">
            <div className="welcome-shell welcome-closing-layout">
              <div><h2>Empieza su historia.</h2><p>Tu próximo registro tiene un lugar.</p></div>
              <ActionLink variant="secondary" to="/auth/register">Crear mi cuenta <ArrowIcon /></ActionLink>
            </div>
          </div>
        </main>
      </div>
      <footer className="welcome-footer welcome-shell">
        <Link to="/bienvenida" className="welcome-brand" aria-label="ReptileApp — Bienvenida"><BrandMark /></Link>
        <p>El cuidado de tus reptiles, en un solo historial.</p>
        <Link to="/auth/login">Iniciar sesión <ArrowIcon /></Link>
      </footer>
    </div>
  );
}
