import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T, guardar, leer } from '../ui/guia.tsx';
import { DiagramaER } from '../ui/Er.tsx';
import { admite, comprobarReto, texto, tipo, type Card, type Max } from '../er.ts';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Una tienda de informática tiene categorías y productos mezclados en una hoja de cálculo. Te piden <strong>el plano de sus datos</strong>: qué se guarda y cómo se relaciona, para que otra persona lo entienda. Sin SQL, sin tablas y sin claves ajenas: solo el modelo entidad-relación, unas fichas de ejemplo y tres comprobaciones, todo en un único PDF. Aquí lo construyes paso a paso. Cada decisión la tomas tú, y la lámina te dice si se sostiene.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Entrega', <>Hasta el <strong>viernes 20 de noviembre de 2026 a las 23:59</strong>, en la plataforma. <strong>Un único PDF</strong>; cualquier otro formato no se corrige.</>],
  ['Peso', 'Es el primero de los 4 retos del módulo. Los retos suman el 70 % de la nota final (tests 20 %, examen 10 %). El reparto entre los cuatro retos no aparece en el material.'],
  ['Tiempo', '60-90 minutos, según el propio enunciado. «Es cortito», en palabras de clase.'],
  ['Puntúa', '4 entidades, atributos y claves · 3 relación y cardinalidades · 3 ejemplos y explicación clara.'],
];

export const secciones = [
  { id: 'enunciado', titulo: 'Qué piden exactamente' },
  { id: 'paso1', titulo: 'Paso 1 · Identifica la información' },
  { id: 'paso2', titulo: 'Paso 2 · Dibuja el modelo' },
  { id: 'drawio', titulo: 'El diagrama en draw.io' },
  { id: 'paso3', titulo: 'Paso 3 · Fichas y comprobaciones' },
  { id: 'ventaja', titulo: 'La ventaja del SGBD' },
  { id: 'memoria', titulo: 'Montar el PDF' },
  { id: 'entrega', titulo: 'Lista de entrega' },
];

// ---------- Destacado: autoevaluación con la guía de puntos ----------
const CRITERIOS = [
  { n: 'Entidades, atributos y claves', max: 4, ev: ['Dos entidades, con nombre en singular', 'Todos los atributos del caso, sin inventar ni olvidar', 'P· en el atributo principal de cada entidad', 'La frase de por qué el nombre identifica peor que el código'] },
  { n: 'Relación y cardinalidades', max: 3, ev: ['Rombo entre las dos cajas, con nombre y tipo', 'Los dos paréntesis (mín,máx) correctos, cada uno en su lado', 'Diagrama limpio y legible dentro del PDF'] },
  { n: 'Ejemplos y explicación clara', max: 3, ev: ['Fichas con los tres productos y su categoría', 'Categoría vacía explicada y las tres comprobaciones', 'Una ventaja concreta del SGBD frente a la hoja'] },
];

export function Destacado() {
  const [h, setH] = useState<string[]>(() => leer('rubrica', []));
  const t = (k: string, v: boolean) => { const x = v ? [...h, k] : h.filter((y) => y !== k); setH(x); guardar('rubrica', x); };
  const nota = h.length;
  return (
    <Panel titulo="¿Cuánto sacarías hoy?">
      <div style={{ display: 'grid', gap: 18 }}>
        {CRITERIOS.map((c, i) => (
          <fieldset key={c.n} style={{ border: 0, margin: 0, padding: 0 }}>
            <legend style={{ font: '700 15px var(--f-titulo)', marginBottom: 8 }}>{c.n} · {c.ev.filter((_, j) => h.includes(`${i}-${j}`)).length} de {c.max}</legend>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
              {c.ev.map((e, j) => <li key={e}><CheckboxInput label={e} value={h.includes(`${i}-${j}`)} onChange={(v: boolean) => t(`${i}-${j}`, v)} /></li>)}
            </ul>
          </fieldset>
        ))}
      </div>
      <p className="resultado" style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }} aria-live="polite">
        <span className="grande" style={{ fontSize: 30, color: nota >= 5 ? 'var(--verde)' : 'var(--rojo)' }}>{nota}/10</span>
        <span>orientativo: un punto por evidencia. La guía oficial puntúa cada bloque de 0 a su máximo según lo que se vea en el PDF.</span>
      </p>
    </Panel>
  );
}

// ---------- Paso 1: taller de atributos ----------
type Destino = 'PRODUCTO' | 'CATEGORIA' | 'nada';
const PIEZAS: { t: string; d: Destino; p?: boolean; porque: string }[] = [
  { t: 'código de producto', d: 'PRODUCTO', p: true, porque: 'Describe al producto y es único: candidato a principal.' },
  { t: 'nombre del producto', d: 'PRODUCTO', porque: 'Describe al producto. Puede repetirse o cambiar.' },
  { t: 'precio', d: 'PRODUCTO', porque: 'Propiedad del producto.' },
  { t: 'existencias', d: 'PRODUCTO', porque: 'Las unidades en el almacén: propiedad del producto.' },
  { t: 'código de categoría', d: 'CATEGORIA', p: true, porque: 'Describe a la categoría y es único: candidato a principal.' },
  { t: 'nombre de la categoría', d: 'CATEGORIA', porque: 'Describe a la categoría.' },
  { t: 'categoría a la que pertenece', d: 'nada', porque: 'Trampa clásica. Eso no es un atributo del producto: es la interrelación entre las dos cajas, el rombo. Ponerlo como columna sería «propagar la clave», y el reto lo excluye (es del Reto 2).' },
  { t: 'Ratón', d: 'nada', porque: 'Es un valor, un dato concreto. Irá en las fichas de ejemplo, no en el modelo.' },
  { t: 'PER', d: 'nada', porque: 'Otro valor: el código de una categoría concreta.' },
  { t: 'hoja de cálculo', d: 'nada', porque: 'Es el sistema que se quiere sustituir, no información de la tienda.' },
];
const DESTINOS: [Destino, string][] = [['PRODUCTO', 'PRODUCTO'], ['CATEGORIA', 'CATEGORIA'], ['nada', 'No es atributo']];

function Taller() {
  const [r, setR] = useState<Record<string, Destino>>(() => leer('reto-taller', {}));
  const [p, setP] = useState<string[]>(() => leer('reto-p', []));
  const [ver, setVer] = useState(false);
  const fijar = (t: string, d: Destino) => { const x = { ...r, [t]: d }; setR(x); guardar('reto-taller', x); };
  const togP = (t: string) => { const x = p.includes(t) ? p.filter((y) => y !== t) : [...p, t]; setP(x); guardar('reto-p', x); };
  const hechas = PIEZAS.filter((x) => r[x.t]).length;
  const bienDestino = PIEZAS.every((x) => r[x.t] === x.d);
  const bienP = PIEZAS.every((x) => (x.p ?? false) === p.includes(x.t));
  const caja = (e: Destino) => PIEZAS.filter((x) => r[x.t] === e);
  return (
    <Panel titulo="Reparte la información del caso" ancho>
      <p style={{ margin: '0 0 14px', color: 'var(--t9)' }}>Cada pieza sale del enunciado. Llévala a su entidad o descártala. Después toca <strong>P·</strong> en el atributo que identifica a cada entidad.</p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead><tr><th>Pieza del enunciado</th><th>¿Dónde va?</th></tr></thead>
          <tbody>
            {PIEZAS.map((x) => {
              const mal = ver && r[x.t] !== x.d;
              return (
                <tr key={x.t}>
                  <td style={{ color: mal ? 'var(--rojo)' : undefined }}><strong>{x.t}</strong>{ver && r[x.t] && <><br /><small style={{ color: 'var(--t8)' }}>{x.porque}</small></>}</td>
                  <td>
                    <div className="opciones" role="group" aria-label={`Destino de ${x.t}`} style={{ margin: 0 }}>
                      {DESTINOS.map(([d, n]) => <button key={d} type="button" className="opcion" aria-pressed={r[x.t] === d} onClick={() => fijar(x.t, d)}>{n}</button>)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '8px 0 16px' }}>
        {(['CATEGORIA', 'PRODUCTO'] as const).map((e) => (
          <div key={e} style={{ flex: '1 1 220px', border: '1.5px solid var(--t6)', borderRadius: 10, overflow: 'hidden', background: 'var(--t2)' }}>
            <div style={{ padding: '8px 12px', font: '800 14px var(--f-titulo)', letterSpacing: '.04em', textAlign: 'center', background: 'color-mix(in srgb, var(--familia-solido) 18%, var(--t2))', borderBottom: '1.5px solid var(--t6)' }}>{e}</div>
            <ul style={{ listStyle: 'none', margin: 0, padding: '8px 12px', display: 'grid', gap: 4, minHeight: 60 }}>
              {caja(e).map((x) => (
                <li key={x.t}>
                  <button type="button" className="pieza" aria-pressed={p.includes(x.t)} onClick={() => togP(x.t)} title="Marcar o desmarcar como principal">
                    {p.includes(x.t) ? 'P · ' : ''}{x.t}
                  </button>
                </li>
              ))}
              {caja(e).length === 0 && <li style={{ color: 'var(--t7)', fontSize: 14 }}>Vacía</li>}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <Button label="Comprobar" variant="primary" size="sm" isDisabled={hechas < PIEZAS.length} onClick={() => setVer(true)} />
        <Button label="Vaciar" variant="ghost" size="sm" onClick={() => { setR({}); setP([]); setVer(false); guardar('reto-taller', {}); guardar('reto-p', []); }} />
      </div>
      <p className="resultado" data-ok={ver ? bienDestino && bienP : undefined} aria-live="polite">
        {!ver ? `Llevas ${hechas} de ${PIEZAS.length} piezas. Cuando estén todas, comprueba.`
          : !bienDestino ? <><strong>Hay piezas fuera de sitio</strong> (en rojo). Lee el porqué de cada una.</>
          : !bienP ? <><strong>Las cajas están bien, falta afinar P·.</strong> Cada entidad tiene exactamente un atributo principal: el que es único, nunca vacío y no cambia.</>
          : <><strong>Eso es el paso 1.</strong> Dos entidades, seis atributos y un principal en cada una. En el PDF escríbelos sin tildes ni espacios: <code>cod_producto</code>, <code>nombre</code>, <code>precio</code>, <code>existencias</code>…</>}
      </p>
    </Panel>
  );
}

// ---------- Paso 1b: la frase del nombre ----------
const IDEAS: [RegExp, string][] = [
  [/repet|igual|duplic|mismo nombre|coincid/i, 'Que dos productos pueden llamarse igual'],
  [/cambi|modific|renombr/i, 'Que el nombre puede cambiar y el código no'],
  [/escrib|tilde|mayúsc|mayusc|errat|espacio/i, 'Que un mismo nombre se puede escribir de varias formas'],
  [/únic|unic|identific/i, 'Que el código es único por definición'],
];

function Frase() {
  const [f, setF] = useState<string>(() => leer('reto-frase', ''));
  const cambiar = (v: string) => { setF(v); guardar('reto-frase', v); };
  return (
    <Panel titulo="Tu frase, comprobada por ideas">
      <TextInput label="Por qué el nombre no es un identificador tan fiable como el código" value={f} onChange={cambiar} placeholder="Escríbela con tus palabras…" />
      <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: 6 }}>
        {IDEAS.map(([re, idea]) => {
          const si = re.test(f);
          return <li key={idea} style={{ color: si ? 'var(--verde)' : 'var(--t8)' }}>{si ? '✓' : '○'} {idea}</li>;
        })}
      </ul>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--t8)' }}>Esto no corrige tu redacción: solo mira qué ideas tocas. Con una bien explicada basta; el enunciado pide una frase. Se guarda en este navegador para que la copies al PDF.</p>
    </Panel>
  );
}

// ---------- Paso 2: cardinalidades ----------
type Lado = 'CATEGORIA' | 'PRODUCTO';
interface Resp { min?: 0 | 1; max?: Max; lado?: Lado }
const PREGUNTAS = [
  { id: 'q1', p: 'Un producto, ¿a cuántas categorías pertenece?', pista: '«Un producto pertenece exactamente a una categoría.»' },
  { id: 'q2', p: 'Una categoría, ¿cuántos productos tiene?', pista: '«Una categoría puede no tener productos o tener varios.»' },
] as const;

function useModelo() {
  const [m, setM] = useState<Record<string, Resp>>(() => leer('reto-card', {}));
  const fijar = (q: string, r: Resp) => { const x = { ...m, [q]: { ...m[q], ...r } }; setM(x); guardar('reto-card', x); };
  const completa = (r?: Resp): r is Required<Resp> => r?.min !== undefined && r.max !== undefined && r.lado !== undefined;
  const junto = (lado: Lado) => Object.values(m).find((r) => completa(r) && r.lado === lado) as Required<Resp> | undefined;
  const cat = junto('CATEGORIA'), prod = junto('PRODUCTO');
  const listo = completa(m.q1) && completa(m.q2) && !!cat && !!prod;
  return { m, fijar, listo, cat: cat && { min: cat.min, max: cat.max } as Card, prod: prod && { min: prod.min, max: prod.max } as Card, reiniciar: () => { setM({}); guardar('reto-card', {}); } };
}
type Modelo = ReturnType<typeof useModelo>;

function Cardinalidades({ mod }: { mod: Modelo }) {
  const [nombre, setNombre] = useState<string>(() => leer('reto-rel', ''));
  const { m, fijar, listo, cat, prod } = mod;
  const res = listo ? comprobarReto(cat!, prod!) : undefined;
  const ladoBien = m.q1?.lado === 'CATEGORIA' && m.q2?.lado === 'PRODUCTO';
  const okCat = res && ladoBien && res.unaPorProducto && res.sinHuerfanos;
  const okProd = res && ladoBien && res.vacia && res.inicial;
  return (
    <Panel titulo="Decide los mínimos, los máximos y su sitio" ancho>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginBottom: 18 }}>
        {PREGUNTAS.map((q) => (
          <div key={q.id} style={{ padding: '14px 16px', borderRadius: 12, border: '1px solid var(--t4)', background: 'var(--t1)' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>{q.p}</p>
            <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--t8)' }}>{q.pista}</p>
            {([['min', 'Como mínimo', [[0, '0'], [1, '1']]], ['max', 'Como máximo', [[1, '1'], ['N', 'n (varios)']]], ['lado', 'El paréntesis va junto a', [['CATEGORIA', 'CATEGORIA'], ['PRODUCTO', 'PRODUCTO']]]] as const).map(([k, et, ops]) => (
              <div key={k} style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 13, color: 'var(--t8)', marginBottom: 4 }}>{et}</div>
                <div className="opciones" role="group" aria-label={`${et}: ${q.p}`} style={{ margin: 0 }}>
                  {ops.map(([v, n]) => <button key={String(v)} type="button" className="opcion" aria-pressed={m[q.id]?.[k] === v} onClick={() => fijar(q.id, { [k]: v })}>{n}</button>)}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 320, marginBottom: 16 }}>
        <TextInput label="Nombre de la interrelación (un verbo)" value={nombre} onChange={(v: string) => { setNombre(v); guardar('reto-rel', v); }} placeholder="pertenece, agrupa…" />
      </div>
      <div className="tabla-scroll">
        <DiagramaER etiqueta="Tu modelo de categorías y productos"
          a={{ nombre: 'CATEGORIA', atributos: ['P · cod_categoria', 'nombre'] }}
          b={{ nombre: 'PRODUCTO', atributos: ['P · cod_producto', 'nombre', 'precio', 'existencias'] }}
          rel={nombre || '¿verbo?'} tipo={cat && prod ? tipo(cat.max, prod.max) : '?'}
          cardA={cat ? texto(cat) : undefined} cardB={prod ? texto(prod) : undefined}
          estadoA={res ? (okCat ? 'ok' : 'mal') : undefined} estadoB={res ? (okProd ? 'ok' : 'mal') : undefined}
          flechaB={!!(cat && prod && tipo(cat.max, prod.max) === '1:N')} />
      </div>
      <p className="resultado" data-ok={res ? !!(okCat && okProd) : undefined} aria-live="polite" style={{ marginTop: 14 }}>
        {!listo ? 'Contesta las dos preguntas, con su lado, y el diagrama se dibuja con tus decisiones.'
          : !ladoBien ? <><strong>Los paréntesis están en el lado equivocado.</strong> El paréntesis va junto a la entidad que estás contando: si preguntas «¿cuántas categorías?», la respuesta se escribe al lado de CATEGORIA. «Siempre hacia donde vamos, no al revés.»</>
          : okCat && okProd ? <><strong>Modelo correcto.</strong> El tipo, {tipo(cat!.max, prod!.max)}, sale de los dos máximos. Esto es lo que vas a dibujar. Comprueba abajo, en el paso 3, que aguanta los datos del caso.</>
          : <><strong>Algo no encaja con las reglas del caso.</strong> Vuelve a leer las dos frases del enunciado, palabra por palabra: «exactamente una» y «puede no tener o tener varios». En rojo, el paréntesis que falla.</>}
      </p>
    </Panel>
  );
}

// ---------- Paso 3: fichas y comprobaciones ----------
interface Cat { cod: string; nombre: string }
interface Prod { cod: string; nombre: string; precio: number; existencias: number; cats: string[] }
const CATS0: Cat[] = [{ cod: 'PER', nombre: 'Periféricos' }, { cod: 'PAN', nombre: 'Pantallas' }];
const PRODS0: Prod[] = [
  { cod: 'P1', nombre: 'Ratón', precio: 15, existencias: 4, cats: ['PER'] },
  { cod: 'P2', nombre: 'Teclado', precio: 30, existencias: 2, cats: ['PER'] },
  { cod: 'P3', nombre: 'Monitor', precio: 120, existencias: 1, cats: ['PAN'] },
];

function Fichas({ mod }: { mod: Modelo }) {
  const [cats, setCats] = useState<Cat[]>(CATS0);
  const [prods, setProds] = useState<Prod[]>(PRODS0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const { listo, cat, prod } = mod;
  const res = listo ? comprobarReto(cat!, prod!) : undefined;
  const intento = (ok: boolean, si: string, no: string, hacer: () => void) => { if (ok) hacer(); setMsg({ ok, t: ok ? si : no }); };
  const acciones: [string, () => void][] = [
    ['Añadir la categoría ACC, Accesorios', () => cats.some((c) => c.cod === 'ACC')
      ? setMsg({ ok: false, t: 'ACC ya existe: el código de categoría es P·, no puede repetirse.' })
      : intento(!!cat && !!prod && admite(prod, 0), 'Hecho. ACC existe con 0 productos: tu modelo lo permite porque el mínimo de productos por categoría es 0. No ha hecho falta inventar ningún producto.', 'Tu modelo no lo permite: con mínimo 1 producto por categoría, no puedes crear ACC sin inventar un producto.', () => setCats([...cats, { cod: 'ACC', nombre: 'Accesorios' }]))],
    ['Meter también P1 en Pantallas', () => intento(!!cat && admite(cat, 2), 'Tu modelo lo ha aceptado: P1 está ahora en dos categorías. Eso contradice «un producto pertenece exactamente a una categoría».', 'Rechazado: tu máximo de categorías por producto es 1. P1 sigue solo en Periféricos.', () => setProds(prods.map((p) => (p.cod === 'P1' ? { ...p, cats: ['PER', 'PAN'] } : p))))],
    ['Dar de alta P4 sin categoría', () => intento(!!cat && admite(cat, 0), 'Tu modelo lo ha aceptado: P4 no pertenece a ninguna categoría. Contradice «exactamente una».', 'Rechazado: tu mínimo de categorías por producto es 1. Un producto no puede quedarse sin categoría.', () => setProds([...prods, { cod: 'P4', nombre: 'Alfombrilla', precio: 8, existencias: 10, cats: [] }]))],
    ['Usar el código P2 para otro producto', () => setMsg({ ok: false, t: 'Rechazado siempre: P2 ya existe y el atributo principal no se repite. Por eso es P· el código y no el nombre.' })],
  ];
  const deCat = (c: string) => prods.filter((p) => p.cats.includes(c));
  const PRUEBAS: [string, string, boolean | undefined][] = [
    ['Catálogo inicial', 'Los tres productos conservan sus datos y su categoría.', res?.inicial],
    ['Categoría vacía', 'El modelo admite una categoría sin productos.', res?.vacia],
    ['Una categoría por producto', 'P1 no puede pertenecer a dos categorías a la vez.', res?.unaPorProducto],
  ];
  return (
    <>
      <Panel titulo="Las fichas, con tu modelo como regla" ancho>
        <p style={{ margin: '0 0 14px', color: 'var(--t9)' }}>Cada categoría es una ficha y debajo cuelgan sus productos. Fíjate: el producto <strong>no lleva</strong> una columna «categoría». La pertenencia es la línea que los une, el rombo del diagrama.</p>
        {!listo && <p className="resultado" data-ok="false">Primero completa el paso 2: las fichas obedecen a las cardinalidades que elijas allí.</p>}
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', margin: '14px 0' }}>
          {cats.map((c) => (
            <div key={c.cod} style={{ border: '1.5px solid var(--t6)', borderRadius: 12, background: 'var(--t2)', overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', background: 'color-mix(in srgb, var(--familia-solido) 14%, var(--t2))', borderBottom: '1px solid var(--t5)' }}>
                <small style={{ color: 'var(--t8)', font: '700 11.5px var(--f-titulo)', letterSpacing: '.08em' }}>CATEGORIA</small><br />
                <strong>{c.cod}</strong> · {c.nombre}
              </div>
              <ul style={{ listStyle: 'none', margin: 0, padding: '10px 14px', display: 'grid', gap: 6, fontSize: 15 }}>
                {deCat(c.cod).map((p) => <li key={p.cod} style={{ color: p.cats.length > 1 ? 'var(--rojo)' : undefined }}><small style={{ color: 'var(--t8)' }}>PRODUCTO</small> <strong>{p.cod}</strong> · {p.nombre} · {p.precio} € · {p.existencias} ud.</li>)}
                {deCat(c.cod).length === 0 && <li style={{ color: 'var(--t8)' }}>Sin productos (0). Válido si el mínimo es 0.</li>}
              </ul>
            </div>
          ))}
          {prods.filter((p) => p.cats.length === 0).map((p) => (
            <div key={p.cod} style={{ border: '1.5px dashed var(--rojo)', borderRadius: 12, padding: '10px 14px', color: 'var(--rojo)' }}><strong>{p.cod}</strong> · {p.nombre}: huérfano, sin categoría</div>
          ))}
        </div>
        <div className="opciones" role="group" aria-label="Pon a prueba tu modelo">
          {acciones.map(([n, f]) => <button key={n} type="button" className="opcion" disabled={!listo} onClick={f}>{n}</button>)}
          <button type="button" className="opcion" onClick={() => { setCats(CATS0); setProds(PRODS0); setMsg(null); }}>Volver al catálogo inicial</button>
        </div>
        {msg && <p className="resultado" data-ok={msg.ok ? 'true' : 'false'} aria-live="polite">{msg.t}</p>}
      </Panel>

      <Panel titulo="Comprueba que funciona (la tabla del enunciado, con tu modelo)" ancho>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Prueba</th><th>Resultado esperado</th><th>Tu modelo</th></tr></thead>
            <tbody>
              {PRUEBAS.map(([p, e, ok]) => (
                <tr key={p}><td><strong>{p}</strong></td><td>{e}</td><td style={{ color: ok === undefined ? 'var(--t8)' : ok ? 'var(--verde)' : 'var(--rojo)', fontWeight: 700 }}>{ok === undefined ? 'Falta el paso 2' : ok ? 'Se cumple' : 'No se cumple'}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: 'var(--t8)' }}>En el PDF copia esta tabla y añade una tercera columna con <em>cómo lo comprobaste</em>: qué ficha o qué paréntesis del diagrama lo garantiza.</p>
      </Panel>
    </>
  );
}

// ---------- La hoja de cálculo de hoy ----------
function Hoja() {
  const [filas, setFilas] = useState([
    { cod: 'P1', nombre: 'Ratón', precio: 15, ex: 4, cc: 'PER', cat: 'Periféricos' },
    { cod: 'P2', nombre: 'Teclado', precio: 30, ex: 2, cc: 'PER', cat: 'Periféricos' },
    { cod: 'P3', nombre: 'Monitor', precio: 120, ex: 1, cc: 'PAN', cat: 'Pantallas' },
  ]);
  const incoherente = new Set(filas.filter((f) => f.cc === 'PER').map((f) => f.cat)).size > 1;
  return (
    <Panel titulo="La hoja de cálculo de hoy: todo mezclado">
      <div className="tabla-scroll">
        <table className="tabla">
          <thead><tr><th>código</th><th>nombre</th><th>precio</th><th>exist.</th><th>cód. cat.</th><th>categoría</th></tr></thead>
          <tbody>{filas.map((f) => <tr key={f.cod}><td>{f.cod}</td><td>{f.nombre}</td><td>{f.precio}</td><td>{f.ex}</td><td>{f.cc}</td><td style={{ color: incoherente && f.cc === 'PER' ? 'var(--rojo)' : undefined }}>{f.cat}</td></tr>)}</tbody>
        </table>
      </div>
      <div className="opciones">
        <button type="button" className="opcion" onClick={() => setFilas(filas.map((f, i) => (i === 0 ? { ...f, cat: 'Periféricos y accesorios' } : f)))}>Renombrar Periféricos (en la fila de P1)</button>
        <button type="button" className="opcion" onClick={() => setFilas(filas.map((f) => ({ ...f, cat: f.cc === 'PER' ? 'Periféricos' : f.cat })))}>Deshacer</button>
      </div>
      <p className="resultado" data-ok={incoherente ? 'false' : undefined} aria-live="polite">
        {incoherente ? <><strong>Ahora PER se llama de dos formas.</strong> En la hoja, «Periféricos» está repetido en cada fila y hay que cambiarlo en todas. En tu modelo, el nombre de la categoría vive en un solo sitio. Y fíjate en otra cosa: en esta hoja no hay forma de tener una categoría sin una fila de producto.</> : 'Prueba a renombrar la categoría en una sola fila, como haría alguien con prisa.'}
      </p>
    </Panel>
  );
}

// ---------- Lista de entrega ----------
const LISTA = [
  'Portada con tu nombre y «Reto 1 · Bases de datos»',
  'Entidades PRODUCTO y CATEGORIA con todos sus atributos, un atributo por línea',
  'P· en cod_producto y en cod_categoria',
  'La frase de por qué el nombre identifica peor que el código',
  'Diagrama: dos cajas, rombo con verbo y tipo, (mín,máx) junto a cada entidad',
  'Sin columna «categoría» dentro de PRODUCTO (no se propagan claves)',
  'Fichas de ejemplo con P1, P2 y P3 y su categoría',
  'Explicación de cómo añadir una categoría vacía sin inventar productos',
  'Tabla de las tres comprobaciones con su resultado',
  'Una ventaja concreta del SGBD frente a la hoja',
  'Capturas legibles al 100 % de zoom, integradas en el documento',
  'Un único archivo .pdf (ni .drawio, ni .png suelto, ni .docx, ni .zip)',
];

function ListaEntrega() {
  const [h, setH] = useState<number[]>(() => leer('lista-reto', []));
  const t = (i: number, v: boolean) => { const x = v ? [...h, i] : h.filter((y) => y !== i); setH(x); guardar('lista-reto', x); };
  return (
    <Panel titulo={`Lista de entrega: ${h.length} de ${LISTA.length}`}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {LISTA.map((l, i) => <li key={l}><CheckboxInput label={l} value={h.includes(i)} onChange={(v: boolean) => t(i, v)} /></li>)}
      </ul>
    </Panel>
  );
}

export default function Cuerpo() {
  const mod = useModelo();
  return (
    <>
      <Bloque id="enunciado" titulo="Qué piden exactamente">
        <p><strong>El caso.</strong> Cada producto tiene código único, nombre, precio y existencias. Cada categoría tiene código único y nombre. Un producto pertenece <strong>exactamente a una</strong> categoría. Una categoría <strong>puede no tener productos o tener varios</strong>. Datos: categorías PER, Periféricos y PAN, Pantallas; productos P1, Ratón, 15 €, 4 unidades; P2, Teclado, 30 €, 2 unidades; P3, Monitor, 120 €, 1 unidad. P1 y P2 son PER; P3 es PAN.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Paso</th><th>Qué hacer</th><th>Puntos</th><th>Láminas</th></tr></thead>
            <tbody>
              <tr><td><strong>01 · Identifica</strong></td><td>Las dos entidades y sus atributos. Marca el principal con <strong>P</strong> y explica en una frase por qué el nombre no identifica tan bien como el código.</td><td>4</td><td><a href={enlace('entidades')}>06</a></td></tr>
              <tr><td><strong>02 · Dibuja</strong></td><td>La relación entre categoría y producto con sus mínimos y máximos, en la notación de los apuntes. A mano o con una herramienta.</td><td>3</td><td><a href={enlace('cardinalidad')}>07</a></td></tr>
              <tr><td><strong>03 · Comprueba</strong></td><td>Los tres productos en fichas de ejemplo, cómo añadir una categoría vacía sin inventar un producto y una ventaja concreta del SGBD frente a la hoja.</td><td>3</td><td><a href={enlace('datos')}>01</a> · <a href={enlace('sgbd')}>03</a></td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>Hasta aquí llega el reto:</strong> no hay que escribir SQL, propagar claves, normalizar ni diseñar pedidos, usuarios o servidores. Si te ves dibujando una tabla con una columna <code>cod_categoria</code> dentro de PRODUCTO, te has pasado de frenada: eso es el Reto 2.</p>
        <Ojo dice="«Antes de empezar: Tema 2, apartados 1, 2 y 3.1-3.3; hasta la página 16.»" realidad="El PDF de Modelización de esta unidad solo tiene el apartado 3.1 (Cardinalidad), que acaba en la página 11. Las páginas 12-16 ya tratan atributos codificables, relaciones ternarias, reflexivas y la propagación de claves, que el propio reto excluye. Para el reto basta con las páginas 1-11, que son las láminas 06 y 07." />
        <EnClase fecha="10/11">
          <p>La clase entera se dedicó a esto. Se leyó el reto en voz alta: «es cortito», «no se pide nada de SQL, no hay que propagar claves». Herramienta recomendada: <strong>draw.io</strong>, aunque vale cualquiera «mientras el diagrama esté hecho de manera correcta». La memoria se puede escribir en Word o en Google Docs y exportar a PDF. La comprobación de la categoría vacía quedó para la clase siguiente.</p>
        </EnClase>
        <EnClase fecha="27/10 y 29/09">
          <p>Fechas de los cuatro retos: <strong>20 de noviembre</strong>, 22 de enero, 5 de marzo y 23 de abril. En la presentación se explicó que hay un margen de recuperación de un mes y que cuenta la mejor nota. Aun así, el plazo ordinario es el 20.</p>
        </EnClase>
      </Bloque>

      <Bloque id="paso1" titulo="Paso 1 · Identifica la información">
        <p>Una <T def="Cualquier cosa o concepto del que se quiere guardar información. Se nombra en singular y en mayúsculas.">entidad</T> es aquello de lo que quieres guardar datos; sus <T def="Las propiedades que describen a una entidad. Cada una será una columna cuando el modelo pase a tablas.">atributos</T> son esos datos. La regla práctica de clase: subraya en el enunciado los sustantivos que «tienen cosas» (entidades) y lo que tienen (atributos).</p>
        <Taller />
        <p>¿Por qué el código y no el nombre? Porque el atributo principal tiene que ser <strong>único</strong>, <strong>no nulo</strong> y <strong>estable</strong> (no cambia con el tiempo). Hazte tres preguntas: ¿pueden dos productos llamarse «Ratón»? ¿Puede la tienda renombrar «Pantallas» como «Monitores»? ¿Escribirá todo el mundo «Ratón» con tilde y mayúscula?</p>
        <Frase />
      </Bloque>

      <Bloque id="paso2" titulo="Paso 2 · Dibuja el modelo">
        <p>La interrelación se dibuja con un <strong>rombo</strong> entre las dos cajas. Arriba, su nombre (un verbo); dentro, el tipo (1:1, 1:N o N:M); y junto a cada entidad, un paréntesis <strong>(mínimo, máximo)</strong>. El método de clase: haz la pregunta en voz alta desde una entidad y escribe la respuesta <em>junto a la otra</em>, la que estás contando.</p>
        <Cardinalidades mod={mod} />
        <ParaElReto>
          <p>El tipo no se elige: sale de los dos máximos. Y el mínimo responde a la obligatoriedad: «puede no tener» es un 0; «exactamente una» es (1,1). Si dudas, la <a href={enlace('cardinalidad')}>lámina 07</a> tiene ocho casos para entrenar la colocación.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="drawio" titulo="El diagrama en draw.io">
        <ol>
          <li>Entra en <strong>app.diagrams.net</strong> (es draw.io; gratis y sin registro). Elige guardar en <em>Dispositivo</em> y crea un diagrama en blanco.</li>
          <li><strong>Cada entidad</strong>: arrastra un rectángulo para la cabecera con el nombre (CATEGORIA, PRODUCTO) y otro debajo con los atributos, uno por línea. Para el punto medio de <code>P·</code>: <kbd>Alt</kbd>+<kbd>0183</kbd> en Windows, <kbd>Opción</kbd>+<kbd>Mayús</kbd>+<kbd>9</kbd> en Mac; o cópialo de aquí: ·</li>
          <li><strong>La interrelación</strong>: un rombo (está junto al rectángulo en las formas generales). Dentro escribe el tipo; encima, en un cuadro de texto, el verbo.</li>
          <li><strong>Las líneas</strong>: pasa el ratón por una caja, aparecen flechas azules; arrastra desde una hasta el rombo y se unen solas. Haz lo mismo con la otra caja.</li>
          <li><strong>Los paréntesis</strong>: doble clic sobre cada línea, cerca de su entidad, y escribe el (mín,máx).</li>
          <li><strong>Exportar</strong>: Archivo › Exportar como › PNG (activa «zoom 200 %» o «borde» si sale pequeño). Ese PNG va pegado en la memoria, no se entrega suelto.</li>
        </ol>
        <EnClase fecha="10/11">
          <p>Se practicó con la entidad CLIENTE: «le pongo la P, le pongo el punto medio». Nombres sin tildes ni espacios (<code>nombre_modulo</code> o <code>nombreModulo</code>) y un atributo por línea con su marcador delante. Ejercicio de clase: exportar a PNG y compartir la imagen.</p>
        </EnClase>
      </Bloque>

      <Bloque id="paso3" titulo="Paso 3 · Fichas y comprobaciones">
        <p>Las <strong>fichas de ejemplo</strong> son el modelo con datos dentro: cada ocurrencia de una entidad (una categoría, un producto) con sus valores. Sirven para comprobar que el diseño admite el caso real. Los apuntes las dibujan en la página 9 de Modelización: las ocurrencias de un lado, las del otro y una línea por cada asociación. Abajo tienes las fichas del caso gobernadas por <em>tus</em> cardinalidades del paso 2: intenta romperlas.</p>
        <Fichas mod={mod} />
        <p><strong>La categoría vacía, explicada:</strong> como CATEGORIA es una entidad propia, una categoría nueva es una ficha nueva de CATEGORIA, con su código y su nombre. No necesita ninguna ficha de PRODUCTO porque el mínimo de productos por categoría es 0. En el PDF dilo con tus palabras y señala el paréntesis del diagrama que lo permite.</p>
      </Bloque>

      <Bloque id="ventaja" titulo="La ventaja del SGBD">
        <p>El enunciado pide <strong>una ventaja concreta</strong> del SGBD frente a la hoja actual. «Concreta» quiere decir aplicada a esta tienda, no una definición copiada. Pruébalo:</p>
        <Hoja />
        <p>Otras ventajas concretas que salen del <a href={enlace('sgbd')}>Tema 1</a>, todas válidas si las aterrizas en el caso:</p>
        <ul>
          <li><strong>Sin redundancia:</strong> el nombre de cada categoría se guarda una vez, no en cada fila de producto.</li>
          <li><strong>Integridad:</strong> el gestor impide dos productos con el mismo código, o un producto que apunte a una categoría que no existe.</li>
          <li><strong>Categorías sin productos:</strong> en la hoja, una categoría solo existe si alguna fila la menciona.</li>
          <li><strong>Acceso concurrente:</strong> dos empleados actualizando existencias a la vez sin pisarse.</li>
          <li><strong>Seguridad:</strong> el dependiente consulta precios pero no los cambia (roles y privilegios).</li>
        </ul>
      </Bloque>

      <Bloque id="memoria" titulo="Montar el PDF">
        <p>Estructura que cubre todo lo que se corrige, en el orden del enunciado. Escribe tú cada apartado; aquí solo tienes el esqueleto:</p>
        <ol>
          <li><strong>Portada</strong>: tu nombre, «Reto 1 · Bases de datos · 0484», fecha.</li>
          <li><strong>Entidades y atributos</strong>: las dos cajas (o una lista por entidad), con <code>P·</code> marcado, y tu frase sobre el nombre.</li>
          <li><strong>Diagrama E-R</strong>: el PNG de draw.io, grande y legible. Debajo, dos frases leyendo la relación en los dos sentidos.</li>
          <li><strong>Fichas de ejemplo</strong>: PER y PAN con sus productos colgando, como en el paso 3.</li>
          <li><strong>Comprobaciones</strong>: la tabla de tres pruebas con resultado y cómo lo compruebas, y la explicación de la categoría vacía.</li>
          <li><strong>Ventaja del SGBD</strong>: una, concreta, con un ejemplo de la tienda.</li>
        </ol>
        <p>Para pasarlo a PDF: en Google Docs, <em>Archivo › Descargar › Documento PDF</em>; en Word, <em>Archivo › Guardar como › PDF</em>. Abre el PDF resultante antes de subirlo y comprueba que el diagrama se lee sin hacer zoom.</p>
      </Bloque>

      <Bloque id="entrega" titulo="Lista de entrega">
        <p>Repásala justo antes de subir el archivo. Se guarda en este navegador.</p>
        <ListaEntrega />
        <p>Errores típicos que restan: el nombre como principal, los paréntesis cambiados de lado, un rombo sin tipo, la columna «categoría» dentro de PRODUCTO, inventar un producto para la categoría vacía y entregar el .drawio o varias imágenes sueltas.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="reto1" preguntas={[
          { p: '¿Qué atributo de PRODUCTO lleva P·?', opciones: ['nombre', 'cod_producto', 'precio', 'categoria'], ok: 1, porque: 'Es el único que el enunciado declara único, y además no cambia con el tiempo.' },
          { p: '«Una categoría puede no tener productos o tener varios.» ¿Qué paréntesis sale y junto a qué entidad va?', opciones: ['(0,n) junto a CATEGORIA', '(0,n) junto a PRODUCTO', '(1,n) junto a PRODUCTO', '(0,1) junto a CATEGORIA'], ok: 1, porque: 'Estás contando productos (de 0 a varios), así que el paréntesis va junto a PRODUCTO.' },
          { p: 'Si la relación tiene (1,1) en un lado y (0,n) en el otro, ¿de qué tipo es?', opciones: ['1:1', '1:N', 'N:M', 'Depende de los mínimos'], ok: 1, porque: 'Se miran solo los máximos: 1 y n.' },
          { p: '¿Cómo añades la categoría ACC, Accesorios, sin productos?', opciones: ['Inventando un producto de ejemplo', 'Con una nueva ficha de CATEGORIA; el mínimo 0 lo permite', 'No se puede', 'Añadiendo una columna a PRODUCTO'], ok: 1, porque: 'Es una ocurrencia más de CATEGORIA. El 0 de (0,n) es justo lo que lo hace válido.' },
          { p: '¿En qué formato se entrega?', opciones: ['Un .zip con todo', 'El .drawio y un .docx', 'Un único PDF', 'Imágenes sueltas'], ok: 2, porque: 'Un único PDF. Cualquier otro formato o varios archivos no se corrigen.' },
        ]} />
      </div>
    </>
  );
}
