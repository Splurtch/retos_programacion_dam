import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { Codigo } from './Codigo.tsx';
import { reproducir, type Programa } from '../sim/traza.ts';
import { IcoAtras, IcoPaso, IcoPlay, IcoPausa, IcoReinicio } from './iconos.tsx';

interface Props {
  titulo: string;
  codigo: string;
  programa: Programa;
  /** Entradas de ejemplo que se pueden pulsar para no tener que teclearlas (incluye alguna incorrecta a propósito). */
  pruebas?: string[];
}

const MAX = 400; // ponytail: tope de pasos por si un bucle simulado no termina; subir si un ejemplo lo necesita

/**
 * Ejecución paso a paso. Tres regiones fijas que nunca se mueven: código, memoria y consola.
 * El estado se deriva de (pasos, entradas), así que «Atrás» es reproducir un paso menos.
 */
export function Simulador({ titulo, codigo, programa, pruebas }: Props) {
  const [pasos, setPasos] = useState(0);
  const [entradas, setEntradas] = useState<string[]>([]);
  const [texto, setTexto] = useState('');
  const [auto, setAuto] = useState(false);
  const campo = useRef<HTMLInputElement>(null);
  const idCampo = useId();

  const e = useMemo(() => reproducir(programa, pasos, entradas), [programa, pasos, entradas]);
  const terminado = e.fin !== 'no' || pasos >= MAX;
  const bloqueado = e.esperando || terminado;

  useEffect(() => {
    if (!auto) return;
    if (bloqueado) { setAuto(false); return; }
    const id = setTimeout(() => setPasos((p) => p + 1), matchMedia('(prefers-reduced-motion: reduce)').matches ? 60 : 420);
    return () => clearTimeout(id);
  }, [auto, bloqueado, pasos]);

  useEffect(() => {
    if (e.esperando) campo.current?.focus({ preventScroll: true });
  }, [e.esperando]);

  const enviar = (v: string) => {
    setEntradas((a) => [...a.slice(0, contarEntradas()), v]);
    setTexto('');
    setPasos((p) => p + 1);
  };
  // Si se retrocede y se vuelve a escribir, se descartan las entradas que quedaron «por delante».
  const contarEntradas = () => e.traza.consola.flat().filter((t) => t.tipo === 'entrada').length;

  const reiniciar = () => { setAuto(false); setPasos(0); setEntradas([]); setTexto(''); };

  const vars = [...e.traza.vars.values()];
  return (
    <section className="sim" aria-label={`Simulador: ${titulo}`}>
      <header className="sim-cab">
        <h4>{titulo}</h4>
        <span className="sim-sello" aria-live="polite">
          {pasos === 0 ? 'Listo para empezar' : e.fin === 'ok' ? 'Programa terminado' : e.fin === 'excepcion' ? 'El programa se ha roto' : `Paso ${pasos} · línea ${e.paso?.linea ?? '–'}`}
        </span>
      </header>

      <div className="sim-cuerpo">
        <div className="sim-codigo">
          <Codigo codigo={codigo} activa={e.fin === 'ok' ? undefined : e.paso?.linea} marcas={e.fin === 'excepcion' && e.paso ? { [e.paso.linea]: 'error' } : undefined} />
        </div>

        <div className="sim-lado">
          <div className="sim-mem" aria-label="Memoria">
            <h5>Memoria</h5>
            {vars.length === 0 ? (
              <p className="sim-vacio">Aún no hay variables. Aparecerán aquí en cuanto el programa las declare.</p>
            ) : (
              <ul>
                {vars.map((v) => (
                  <li key={v.nombre} data-recien={v.recien || undefined}>
                    <span className="v-tipo">{v.tipo}</span>
                    <span className="v-nombre">{v.nombre}</span>
                    <span className="v-valor">{v.valor}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="sim-consola" aria-label="Consola" aria-live="polite">
            <h5>Consola</h5>
            <div className="consola">
              {e.traza.consola.map((l, i) => (
                <div key={i} className="c-linea">
                  {l.map((t, j) => <span key={j} className={`c-${t.tipo}`}>{t.texto}</span>)}
                </div>
              ))}
              {e.esperando && (
                <form className="c-entrada" onSubmit={(ev) => { ev.preventDefault(); enviar(texto); }}>
                  <label className="vh" htmlFor={idCampo}>Escribe tu respuesta y pulsa Enter</label>
                  <input id={idCampo} ref={campo} value={texto} onChange={(ev) => setTexto(ev.target.value)} autoComplete="off" spellCheck={false} />
                  <span className="c-cursor" aria-hidden="true" />
                </form>
              )}
              {pasos === 0 && <span className="c-placeholder">La salida del programa aparecerá aquí.</span>}
            </div>
            {e.esperando && pruebas && (
              <div className="sim-pruebas">
                <span>Prueba con:</span>
                {pruebas.map((p) => (
                  <button key={p} type="button" className="chip" onClick={() => enviar(p)}>{p === '' ? '(vacío)' : p}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="sim-pie">
        <div className="sim-nota" aria-live="polite">
          {e.fin === 'excepcion'
            ? 'Excepción no controlada: el programa se detiene en seco en la línea marcada. Lo arreglaremos con TryParse o try-catch.'
            : e.esperando
              ? (e.paso?.nota ?? 'Escribe en la consola y pulsa Enter.')
              : e.fin === 'ok' ? 'Fin. Reinicia y prueba con otros datos para ver otro camino.' : (e.paso?.nota ?? 'Pulsa «Paso». La franja marca la próxima línea que se va a ejecutar, igual que en el depurador de VS Code.')}
        </div>
        <div className="sim-mandos">
          <Button label="Atrás" variant="ghost" size="sm" icon={<Icon icon={IcoAtras} />} isDisabled={pasos === 0} onClick={() => { setAuto(false); setPasos((p) => Math.max(0, p - 1)); }} />
          <Button label="Paso" variant="primary" size="sm" icon={<Icon icon={IcoPaso} />} isDisabled={bloqueado} onClick={() => setPasos((p) => p + 1)} />
          <Button label={auto ? 'Pausa' : 'Ejecutar'} variant="secondary" size="sm" icon={<Icon icon={auto ? IcoPausa : IcoPlay} />} isDisabled={bloqueado && !auto} onClick={() => setAuto((a) => !a)} />
          <Button label="Reiniciar" variant="ghost" size="sm" icon={<Icon icon={IcoReinicio} />} isDisabled={pasos === 0} onClick={reiniciar} />
        </div>
      </footer>
    </section>
  );
}
