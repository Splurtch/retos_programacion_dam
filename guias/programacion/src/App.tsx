import { useEffect, useState, useSyncExternalStore, type ComponentType, type MouseEvent, type PointerEvent } from 'react';
import { flushSync } from 'react-dom';
import { Icon } from '@astryxdesign/core/Icon';
import { CARGAR, FAMILIAS, LAMINAS, enlace, type Familia, type Modulo } from './laminas/index.ts';
import { guardar, leer } from './ui/guia.tsx';
import { IcoBandera, IcoFlecha, IcoGithub, IcoGlobo, IcoLibro, IcoLinkedin, IcoLuna, IcoPantalla, IcoSol, IcoSubstack } from './ui/iconos.tsx';
import { Particulas } from './ui/Particulas.tsx';
import { Glosario } from './paginas/Glosario.tsx';
import { Clases } from './paginas/Clases.tsx';

// ---------- Rutas por hash ----------
const suscribir = (f: () => void) => { addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); };
const useRuta = () => useSyncExternalStore(suscribir, () => location.hash.replace(/^#\/?/, ''));

export type Tema = 'system' | 'light' | 'dark';

export function Isotipo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="ds-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3B82F6" /><stop offset=".5" stopColor="#8B5CF6" /><stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <path d="M6 10L16 4L26 10L6 22L16 28L26 22" stroke="url(#ds-g)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="10" r="3.5" fill="#3B82F6" /><circle cx="16" cy="16" r="3.5" fill="#8B5CF6" /><circle cx="26" cy="22" r="3.5" fill="#06B6D4" />
    </svg>
  );
}

const REDES: [string, string, ComponentType][] = [
  ['Portfolio', 'https://github.com/Splurtch', IcoGithub],
  ['LinkedIn', 'https://www.linkedin.com/in/synji-d-mulatiere', IcoLinkedin],
  ['Substack', 'https://synji.substack.com', IcoSubstack],
  ['DigitalSynapse', 'https://digitalsynapse.es', IcoGlobo],
];

const TEMAS: [Tema, string, ComponentType][] = [['system', 'Según el dispositivo', IcoPantalla], ['light', 'Clara', IcoSol], ['dark', 'Oscura', IcoLuna]];

// Control segmentado de apariencia: el pulgar se desliza y el nuevo tema se revela en círculo desde el botón.
export function SelectorTema({ tema, setTema }: { tema: Tema; setTema: (t: Tema) => void }) {
  const cambiar = (t: Tema, e: MouseEvent<HTMLButtonElement>) => {
    if (t === tema) return;
    const html = document.documentElement;
    const aplicar = () => {
      if (t === 'system') delete html.dataset.tema; else html.dataset.tema = t;
      flushSync(() => setTema(t));
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return aplicar();
    const r = e.currentTarget.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    html.style.setProperty('--vt-x', `${x}px`);
    html.style.setProperty('--vt-y', `${y}px`);
    html.style.setProperty('--vt-r', `${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px`);
    document.startViewTransition(aplicar);
  };
  return (
    <div className="tema" role="group" aria-label="Apariencia" data-actual={tema}>
      <span className="tema-pulgar" aria-hidden="true" />
      {TEMAS.map(([t, nombre, Ico]) => (
        <button key={t} type="button" aria-pressed={tema === t} aria-label={`Apariencia ${nombre.toLowerCase()}`} title={nombre} onClick={(e) => cambiar(t, e)}>
          <Icon icon={Ico} size="sm" />
        </button>
      ))}
    </div>
  );
}

export function App({ tema, setTema }: { tema: Tema; setTema: (t: Tema) => void }) {
  const ruta = useRuta();
  const [, id, seccion] = ruta.match(/^l\/([\w-]+)(?:\/([\w-]+))?/) ?? [];
  const meta = LAMINAS.find((l) => l.id === id);
  const [marca, setMarca] = useState<string | null>(() => leer('marca', null));

  useEffect(() => {
    if (!meta) { scrollTo({ top: 0 }); return; }
    guardar('marca', meta.id);
    setMarca(meta.id);
    const vistas = leer<string[]>('vistas', []);
    if (!vistas.includes(meta.id)) guardar('vistas', [...vistas, meta.id]);
  }, [meta]);

  useEffect(() => {
    const titulo = meta ? `${meta.num} ${meta.titulo}` : ruta === 'glosario' ? 'Glosario' : ruta === 'clases' ? 'Diario de clases' : 'Índice';
    document.title = `${titulo} · Guía de campo de C#`;
  }, [meta, ruta]);

  const marcaMeta = LAMINAS.find((l) => l.id === marca);
  return (
    <div data-familia={meta?.familia}>
      <Particulas />
      <a className="vh" href="#contenido" onClick={(e) => { e.preventDefault(); document.getElementById('contenido')?.focus(); }}>Saltar al contenido</a>
      <header className="cab">
        <a className="marca" href="#/"><Isotipo /><span>Guía de campo · C#</span></a>
        <nav className="ruta" aria-label="Estás en">
          <span>0485 Programación</span><span className="ruta-sep">›</span>
          {meta ? (<><span>Unidad 1</span><span className="ruta-sep">›</span><b>Lámina {meta.num} · {meta.corto}</b></>) : <b>{ruta === 'glosario' ? 'Glosario' : ruta === 'clases' ? 'Diario de clases' : 'Índice de láminas'}</b>}
        </nav>
        <span className="cab-hueco" />
        {marcaMeta && marcaMeta.id !== meta?.id && (
          <a className="banderola" href={enlace(marcaMeta.id)}><Icon icon={IcoBandera} size="sm" /><span>Lo dejaste en la lámina {marcaMeta.num}</span></a>
        )}
        <a className="boton-indice" href="#/"><Icon icon={IcoLibro} size="sm" />Índice</a>
        <SelectorTema tema={tema} setTema={setTema} />
      </header>

      <nav className="canto" aria-label="Familias">
        {(Object.keys(FAMILIAS) as Familia[]).map((f) => {
          const primera = LAMINAS.find((l) => l.familia === f)!;
          return <a key={f} data-familia={f} href={enlace(primera.id)} aria-current={meta?.familia === f}>{FAMILIAS[f].nombre}</a>;
        })}
      </nav>

      <main id="contenido" tabIndex={-1}>
        {meta ? <LaminaVista key={meta.id} id={meta.id} seccion={seccion} /> : ruta === 'glosario' ? <Glosario /> : ruta === 'clases' ? <Clases /> : <Indice marca={marcaMeta?.id} />}
      </main>

      <footer className="pie">
        <div className="pie-in">
          <div className="pie-marca">
            <a className="marca" href="https://digitalsynapse.es" target="_blank" rel="noopener noreferrer"><Isotipo size={28} /><span>DigitalSynapse</span></a>
            <p>Guía de campo de C#: material de estudio personal del módulo 0485 Programación, 1.º DAM, Ucademy 2026-27. Hecha por Synji para aprobar sin copiar.</p>
          </div>
          <nav className="pie-col" aria-labelledby="pie-guia">
            <h2 id="pie-guia">La guía</h2>
            <ul>
              <li><a href="#/">Índice de láminas</a></li>
              <li><a href="#/glosario">Glosario</a></li>
              <li><a href="#/clases">Diario de clases</a></li>
              <li><a href={enlace('reto1')}>Reto 1</a></li>
            </ul>
          </nav>
          <nav className="pie-col" aria-labelledby="pie-redes">
            <h2 id="pie-redes">Synji en la red</h2>
            <ul className="pie-redes">
              {REDES.map(([nombre, url, Ico]) => (
                <li key={nombre}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <span className="red-ico"><Icon icon={Ico} size="sm" /></span>
                    <span className="red-txt"><b>{nombre}</b><small>{url.replace(/^https:\/\/(www\.)?/, '')}</small></span>
                    <Icon icon={IcoFlecha} size="sm" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="pie-base"><span>© 2026 Synji · DigitalSynapse</span><span>Sin cuentas ni servidores: tu progreso se guarda solo en este navegador.</span></div>
      </footer>
    </div>
  );
}

// ---------- Lámina ----------
function LaminaVista({ id, seccion }: { id: string; seccion?: string }) {
  const [mod, setMod] = useState<Modulo | null>(null);
  const i = LAMINAS.findIndex((l) => l.id === id);
  const meta = LAMINAS[i];
  const ant = LAMINAS[i - 1];
  const sig = LAMINAS[i + 1];

  useEffect(() => { CARGAR[id]().then(setMod); }, [id]);
  useEffect(() => {
    if (!mod) return;
    if (seccion) document.getElementById(seccion)?.scrollIntoView({ block: 'start' });
    else scrollTo({ top: 0 });
  }, [mod, seccion]);

  if (!mod) return <div className="lamina" aria-busy="true"><p className="sim-vacio">Cargando lámina…</p></div>;
  const { Destacado, default: Cuerpo } = mod;
  return (
    <article className="lamina" data-familia={meta.familia}>
      <div className="lam-cab">
        <div>
          <div className="lam-titulo">
            <span className="lam-num" aria-hidden="true">{meta.num}</span>
            <h1><span className="vh">Lámina {meta.num}. </span>{meta.titulo}</h1>
            <p className="lam-formula" data-codigo={/[;(){}]/.test(meta.formula) || undefined}>{meta.formula}</p>
          </div>
          <div className="lam-entradilla">{mod.entradilla}</div>
          <dl className="ficha">
            {mod.ficha.map(([k, v]) => (
              <div key={k} className="ficha-fila" data-ojo={k.startsWith('Ojo') || undefined}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          <nav className="lam-indice" aria-label="En esta lámina">
            <h2>En esta lámina</h2>
            <ol>
              {mod.secciones.map((s) => <li key={s.id}><a href={enlace(id, s.id)}>{s.titulo}</a></li>)}
              <li><a href={enlace(id, 'autoevaluacion')}>Comprueba lo que sabes</a></li>
            </ol>
          </nav>
        </div>
        <div className="lam-destacado"><Destacado /></div>
      </div>

      <div className="lam-cuerpo"><Cuerpo /></div>

      <nav className="lam-sig" aria-label="Láminas contiguas">
        {ant && <a href={enlace(ant.id)}><small>Anterior · {ant.num}</small><b>{ant.titulo}</b></a>}
        {sig && <a className="sig" href={enlace(sig.id)}><small>Siguiente · {sig.num}</small><b>{sig.titulo}</b></a>}
      </nav>
    </article>
  );
}

// ---------- Índice ----------
function diasHasta(fecha: string) {
  const fin = new Date(`${fecha}T23:59:59`);
  return Math.ceil((fin.getTime() - Date.now()) / 86_400_000);
}

export const foco = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};

function Indice({ marca }: { marca?: string }) {
  const vistas = leer<string[]>('vistas', []);
  const hecha = (id: string) => leer<(number | null)[]>(`quiz:${id}`, []).some((x) => x !== null);
  const evaluadas = LAMINAS.filter((l) => hecha(l.id)).length;
  const abiertas = LAMINAS.filter((l) => vistas.includes(l.id)).length;
  const dias = diasHasta('2026-11-20');
  const empezar = marca ?? LAMINAS[0].id;
  return (
    <div className="indice">
      <section className="ind-hero" onPointerMove={foco}>
        <div className="ind-hero-texto">
          <h1>Guía de campo de C#</h1>
          <p className="ind-lead">Unidad 1 del módulo 0485 Programación, explicada desde cero. Cada concepto es una lámina: lo reconoces, lo tocas, lo ejecutas paso a paso y compruebas que lo has entendido.</p>
          <p className="ind-sub">Reúne la teoría del aula, lo que se explicó en cada clase grabada y los ejercicios de clase. Cuando el temario oficial se equivoca, la lámina lo avisa.</p>
          <div className="ind-acciones">
            <a className="capsula" href={enlace(empezar)}>{marca ? `Seguir por la lámina ${LAMINAS.find((l) => l.id === marca)?.num}` : 'Empezar por la lámina 01'}<Icon icon={IcoFlecha} size="sm" /></a>
            <a className="capsula capsula-sec" href="#/glosario">Glosario</a>
            <a className="capsula capsula-sec" href="#/clases">Diario de clases</a>
          </div>
          <p className="reto-aviso" data-familia="reto">
            {dias >= 0 ? <><b>{dias === 0 ? 'Hoy' : `Quedan ${dias} ${dias === 1 ? 'día' : 'días'}`}</b> para entregar el Reto 1 (20 de noviembre, inclusive).</> : <>El plazo ordinario del Reto 1 terminó el 20 de noviembre.</>}
            <a href={enlace('reto1')}>Qué pide y cómo prepararlo</a>
          </p>
        </div>
        <div className="ind-logo" data-particulas-ancla aria-hidden="true"><Isotipo size={320} /></div>
      </section>

      <section className="recorrido" aria-labelledby="rec-t">
        <div className="rec-cab">
          <h2 id="rec-t">Tu recorrido</h2>
          <p><b>{abiertas}</b> de {LAMINAS.length} láminas abiertas · <b>{evaluadas}</b> autoevaluadas</p>
        </div>
        <ol className="rec-barra">
          {LAMINAS.map((l) => {
            const estado = hecha(l.id) ? 'hecha' : vistas.includes(l.id) ? 'abierta' : undefined;
            return (
              <li key={l.id} data-familia={l.familia} data-estado={estado} data-aqui={l.id === marca || undefined}>
                <a href={enlace(l.id)} title={`${l.num} · ${l.titulo}`}>
                  <span className="vh">Lámina {l.num}, {l.titulo}: {estado === 'hecha' ? 'autoevaluada' : estado === 'abierta' ? 'abierta' : 'sin abrir'}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

      {(Object.keys(FAMILIAS) as Familia[]).map((f) => (
        <section key={f} className="familia" data-familia={f} aria-labelledby={`fam-${f}`}>
          <div className="familia-cab">
            <h2 id={`fam-${f}`}>{FAMILIAS[f].nombre}</h2>
            <p>{FAMILIAS[f].texto}</p>
          </div>
          <ul className="tarjetas">
            {LAMINAS.filter((l) => l.familia === f).map((l) => {
              const h = hecha(l.id);
              const v = vistas.includes(l.id);
              return (
                <li key={l.id}>
                  <Tarjeta href={enlace(l.id)} numero={l.num} titulo={l.titulo} resumen={l.resumen}
                    accion={l.id === marca ? 'Seguir aquí' : 'Abrir lámina'}
                    estado={h ? 'Autoevaluada' : v ? 'Abierta' : undefined} />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function Tarjeta({ href, numero, titulo, resumen, accion, estado }: {
  href: string;
  numero: string;
  titulo: string;
  resumen: string;
  accion: string;
  estado?: 'Autoevaluada' | 'Abierta';
}) {
  return (
    <a className="tarjeta" href={href} onPointerMove={foco}>
      <span className="t-cab">
        <span className="t-num">{numero}</span>
        {estado && <span className="t-estado" data-hecho={estado === 'Autoevaluada' || undefined}>{estado}</span>}
      </span>
      <span className="t-titulo">{titulo}</span>
      <span className="t-res">{resumen}</span>
      <span className="t-ir" aria-hidden="true">{accion}<Icon icon={IcoFlecha} size="sm" /></span>
    </a>
  );
}
