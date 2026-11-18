import { useState, type ReactNode } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { IcoAviso, IcoDiana, IcoVideo } from './iconos.tsx';

// ---------- Persistencia local (solo comodidad: si falla, la guía funciona igual) ----------
export function leer<T>(clave: string, defecto: T): T {
  try {
    const v = localStorage.getItem(`guia0484:${clave}`);
    return v === null ? defecto : (JSON.parse(v) as T);
  } catch {
    return defecto;
  }
}
export function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(`guia0484:${clave}`, JSON.stringify(valor));
  } catch {
    /* modo privado o almacenamiento bloqueado */
  }
}

// ---------- Estructura de la lámina ----------
/** Ficha de especie: rótulo a la izquierda, descripción a la derecha. */
export function Ficha({ filas }: { filas: [string, ReactNode][] }) {
  return (
    <dl className="ficha">
      {filas.map(([k, v]) => (
        <div key={k} className="ficha-fila">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Panel de lámina: donde vive lo que se toca. */
export function Panel({ titulo, children, ancho }: { titulo: string; children: ReactNode; ancho?: boolean }) {
  return (
    <figure className="panel" data-ancho={ancho || undefined}>
      <figcaption>{titulo}</figcaption>
      {children}
    </figure>
  );
}

/** Seccion con título; el id permite enlazar desde el índice de la lámina. */
export function Bloque({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section className="bloque" id={id} aria-labelledby={`${id}-h`}>
      <h2 id={`${id}-h`}>{titulo}</h2>
      {children}
    </section>
  );
}

// ---------- Avisos ----------
/** El temario oficial dice algo incorrecto o anticuado: se cita y se corrige. */
export function Ojo({ dice, realidad }: { dice: ReactNode; realidad: ReactNode }) {
  return (
    <aside className="aviso aviso-ojo">
      <p className="aviso-rot"><Icon icon={IcoAviso} size="sm" /> Ojo, el temario</p>
      <p><span className="aviso-dice">Dice:</span> {dice}</p>
      <p><span className="aviso-dice">En realidad:</span> {realidad}</p>
    </aside>
  );
}

/** Lo que se explicó o practicó en una clase grabada concreta. */
export function EnClase({ fecha, children }: { fecha: string; children: ReactNode }) {
  return (
    <aside className="aviso aviso-clase">
      <p className="aviso-rot"><Icon icon={IcoVideo} size="sm" /> En la clase del {fecha}</p>
      <div>{children}</div>
    </aside>
  );
}

/** Conexión directa con el Reto 1. */
export function ParaElReto({ children }: { children: ReactNode }) {
  return (
    <aside className="aviso aviso-reto">
      <p className="aviso-rot"><Icon icon={IcoDiana} size="sm" /> Para el Reto 1</p>
      <div>{children}</div>
    </aside>
  );
}

/** Término con definición al pasar el ratón o al tocarlo. */
export function T({ def, children }: { def: string; children: ReactNode }) {
  return (
    <dfn tabIndex={0} className="term" data-def={def} aria-description={def}
      onClick={(e) => e.currentTarget.toggleAttribute('data-abierto')} onBlur={(e) => e.currentTarget.removeAttribute('data-abierto')}>
      {children}
    </dfn>
  );
}

// ---------- Autoevaluación ----------
export interface Pregunta {
  p: ReactNode;
  opciones: ReactNode[];
  ok: number;
  porque: ReactNode;
}

export function Autoevaluacion({ id, preguntas }: { id: string; preguntas: Pregunta[] }) {
  const [resp, setResp] = useState<(number | null)[]>(() => leer(`quiz:${id}`, preguntas.map(() => null)));
  const elegir = (i: number, o: number) => {
    const n = resp.map((r, j) => (j === i ? o : r));
    setResp(n);
    guardar(`quiz:${id}`, n);
  };
  const aciertos = resp.filter((r, i) => r === preguntas[i].ok).length;
  const hechas = resp.filter((r) => r !== null).length;
  return (
    <section className="quiz" aria-labelledby={`q-${id}`}>
      <div className="quiz-cab">
        <h2 id={`q-${id}`}>Comprueba lo que sabes</h2>
        <span className="quiz-marcador">{aciertos} de {preguntas.length} bien{hechas < preguntas.length ? ` · ${preguntas.length - hechas} sin responder` : ''}</span>
      </div>
      <ol>
        {preguntas.map((q, i) => (
          <li key={i} className="quiz-p">
            <div className="quiz-enun">{q.p}</div>
            <div className="quiz-ops" role="group" aria-label={`Respuestas de la pregunta ${i + 1}`}>
              {q.opciones.map((o, k) => {
                const marcada = resp[i] === k;
                const estado = resp[i] === null ? undefined : k === q.ok ? 'ok' : marcada ? 'mal' : undefined;
                return (
                  <button key={k} type="button" className="quiz-op" data-estado={estado} aria-pressed={marcada} onClick={() => elegir(i, k)}>
                    <span className="quiz-letra">{'abcd'[k]}</span>
                    <span>{o}</span>
                  </button>
                );
              })}
            </div>
            {resp[i] !== null && (
              <p className="quiz-porque" data-ok={resp[i] === q.ok}>
                <strong>{resp[i] === q.ok ? 'Correcto.' : 'No exactamente.'}</strong> {q.porque}
              </p>
            )}
          </li>
        ))}
      </ol>
      {hechas > 0 && (
        <Button label="Borrar respuestas" variant="ghost" size="sm" onClick={() => { const v = preguntas.map(() => null); setResp(v); guardar(`quiz:${id}`, v); }} />
      )}
    </section>
  );
}
