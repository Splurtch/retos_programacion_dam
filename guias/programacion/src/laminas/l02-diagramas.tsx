import { useEffect, useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, Ojo, Panel, ParaElReto } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Antes de escribir C# conviene dibujar o escribir el algoritmo de forma ordenada. Para eso hay dos herramientas: el <strong>diagrama de flujo</strong>, que lo dibuja con símbolos y flechas, y el <strong>pseudocódigo</strong>, que lo escribe en un lenguaje casi natural.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Óvalos de Inicio y Fin, rectángulos de proceso, rombos de decisión con dos salidas y flechas que marcan el camino.'],
  ['Se confunde con', 'Un programa. Ni el diagrama ni el pseudocódigo se ejecutan: sirven para pensar y para explicar.'],
  ['Hábitat', 'En papel, antes de codificar, y en la fase de diseño del ciclo de vida del software.'],
  ['Regla de oro', 'De arriba abajo o de izquierda a derecha, sin cruzar líneas. Toda decisión tiene al menos dos salidas.'],
];

export const secciones = [
  { id: 'simbolos', titulo: 'Los símbolos' },
  { id: 'reglas', titulo: 'Reglas del diagrama' },
  { id: 'pseudocodigo', titulo: 'Pseudocódigo' },
  { id: 'de-pseudo-a-cs', titulo: 'Del pseudocódigo a C#' },
];

// ---------- Destacado: diagrama ejecutable ----------
type Nodo = 'inicio' | 'asig' | 'cond' | 'escr' | 'inc' | 'fin';
interface Estado { nodo: Nodo; num: number; salida: number[] }

function recorrido(limite: number): Estado[] {
  const pasos: Estado[] = [{ nodo: 'inicio', num: NaN, salida: [] }];
  let num = 0;
  const salida: number[] = [];
  pasos.push({ nodo: 'asig', num, salida: [] });
  // ponytail: tope de 400 estados, de sobra para límites hasta 98
  while (pasos.length < 400) {
    pasos.push({ nodo: 'cond', num, salida: [...salida] });
    if (!(num <= limite)) break;
    salida.push(num);
    pasos.push({ nodo: 'escr', num, salida: [...salida] });
    num += 2;
    pasos.push({ nodo: 'inc', num, salida: [...salida] });
  }
  pasos.push({ nodo: 'fin', num, salida: [...salida] });
  return pasos;
}

const POS: Record<Nodo, [number, number]> = { inicio: [150, 30], asig: [150, 100], cond: [150, 185], escr: [150, 280], inc: [150, 360], fin: [330, 185] };

export function Destacado() {
  const [limite, setLimite] = useState(10);
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(false);
  const pasos = useMemo(() => recorrido(limite), [limite]);
  const e = pasos[Math.min(i, pasos.length - 1)];
  const fin = i >= pasos.length - 1;

  useEffect(() => { setI(0); setAuto(false); }, [limite]);
  useEffect(() => {
    if (!auto || fin) { if (fin) setAuto(false); return; }
    const id = setTimeout(() => setI((x) => x + 1), matchMedia('(prefers-reduced-motion: reduce)').matches ? 40 : 320);
    return () => clearTimeout(id);
  }, [auto, fin, i]);

  const activo = (n: Nodo) => (e.nodo === n ? 'var(--cian)' : 'var(--t6)');
  const relleno = (n: Nodo) => (e.nodo === n ? 'color-mix(in srgb, var(--cian-solido) 20%, var(--t2))' : 'var(--t2)');
  const texto = { fill: 'var(--t10)', fontFamily: 'var(--f-codigo)', fontSize: 13, textAnchor: 'middle' as const, dominantBaseline: 'middle' as const };
  const cond = e.nodo === 'cond' && !Number.isNaN(e.num) ? (e.num <= limite ? 'sí' : 'no') : null;

  return (
    <Panel titulo="Diagrama de flujo que se ejecuta">
      <Slider label={`Mostrar los números pares del 0 al ${limite}`} value={limite} onChange={(v: number) => setLimite(v)} min={2} max={98} step={2} valueDisplay="none" />
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 150px', gap: 16, marginTop: 12 }}>
        <svg viewBox="0 0 420 410" role="img" aria-label={`Diagrama de flujo. Paso actual: ${e.nodo}. num vale ${Number.isNaN(e.num) ? 'sin definir' : e.num}.`} style={{ width: '100%', height: 'auto' }}>
          <defs><marker id="fl" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--t7)" /></marker></defs>
          <g stroke="var(--t7)" strokeWidth="1.5" fill="none" markerEnd="url(#fl)">
            <path d="M150 48V80" /><path d="M150 120V158" /><path d="M150 212V258" /><path d="M150 302V340" />
            <path d="M90 360H40V185H100" /><path d="M210 185H290" />
          </g>
          <text x="162" y="235" style={{ ...texto, textAnchor: 'start', fill: cond === 'sí' ? 'var(--cian)' : 'var(--t8)' }}>sí</text>
          <text x="248" y="175" style={{ ...texto, fill: cond === 'no' ? 'var(--cian)' : 'var(--t8)' }}>no</text>
          <rect x="105" y="12" width="90" height="36" rx="18" fill={relleno('inicio')} stroke={activo('inicio')} strokeWidth="2" /><text x="150" y="31" style={texto}>Inicio</text>
          <rect x="85" y="80" width="130" height="40" rx="4" fill={relleno('asig')} stroke={activo('asig')} strokeWidth="2" /><text x="150" y="101" style={texto}>num = 0</text>
          <path d="M150 158L210 185L150 212L90 185Z" fill={relleno('cond')} stroke={activo('cond')} strokeWidth="2" /><text x="150" y="186" style={{ ...texto, fontSize: 12 }}>{`num<=${limite}`}</text>
          <path d="M100 258H220L200 302H80Z" fill={relleno('escr')} stroke={activo('escr')} strokeWidth="2" /><text x="150" y="281" style={texto}>Escribir num</text>
          <rect x="90" y="340" width="120" height="40" rx="4" fill={relleno('inc')} stroke={activo('inc')} strokeWidth="2" /><text x="150" y="361" style={texto}>num = num + 2</text>
          <rect x="290" y="167" width="80" height="36" rx="18" fill={relleno('fin')} stroke={activo('fin')} strokeWidth="2" /><text x="330" y="186" style={texto}>Fin</text>
          <circle cx={POS[e.nodo][0] + (e.nodo === 'fin' ? -48 : -78)} cy={POS[e.nodo][1]} r="6" fill="var(--cian-solido)" style={{ transition: 'cx 260ms var(--ease), cy 260ms var(--ease)' }} />
        </svg>
        <div>
          <div style={{ padding: '10px 12px', borderRadius: 10, border: '1px dashed var(--cian-solido)', fontFamily: 'var(--f-codigo)', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--t8)' }}>num</div>
            <div className="grande">{Number.isNaN(e.num) ? '—' : e.num}</div>
          </div>
          <div className="consola" style={{ maxHeight: 250, minHeight: 120 }} aria-label="Pantalla">
            {e.salida.map((n) => <div key={n} className="c-linea">{n}</div>)}
          </div>
        </div>
      </div>
      <div className="sim-mandos" style={{ marginTop: 14 }}>
        <Button label="Paso" variant="primary" size="sm" isDisabled={fin} onClick={() => setI(i + 1)} />
        <Button label={auto ? 'Pausa' : 'Recorrer'} variant="secondary" size="sm" isDisabled={fin} onClick={() => setAuto(!auto)} />
        <Button label="Reiniciar" variant="ghost" size="sm" isDisabled={i === 0} onClick={() => { setI(0); setAuto(false); }} />
      </div>
    </Panel>
  );
}

// ---------- Símbolos ----------
const SIMBOLOS = [
  { n: 'Terminal', d: 'Inicio o fin del programa.', s: <rect x="8" y="14" width="64" height="28" rx="14" /> },
  { n: 'Proceso', d: 'Una instrucción o cálculo. Ej.: cont = cont + 1.', s: <rect x="8" y="12" width="64" height="32" rx="2" /> },
  { n: 'Entrada / salida', d: 'Leer un dato o mostrarlo. Ej.: visualiza en pantalla suma.', s: <path d="M18 12H72L62 44H8Z" /> },
  { n: 'Decisión', d: 'Una pregunta con respuesta sí o no. Tiene al menos dos salidas.', s: <path d="M40 6L74 28L40 50L6 28Z" /> },
  { n: 'Conector', d: 'Une partes del diagrama para no cruzar líneas. Úsalo solo si no hay otra opción.', s: <circle cx="40" cy="28" r="16" /> },
  { n: 'Subprograma', d: 'Llama a un método o subprograma definido aparte.', s: <><rect x="8" y="12" width="64" height="32" rx="2" /><path d="M16 12V44M64 12V44" /></> },
  { n: 'Flecha', d: 'Indica la dirección del flujo.', s: <path d="M8 28H68M60 20L70 28L60 36" /> },
];

function Simbolos() {
  const [s, setS] = useState(0);
  return (
    <Panel titulo="Toca un símbolo">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 8 }} role="group" aria-label="Símbolos de diagrama de flujo">
        {SIMBOLOS.map((x, i) => (
          <button key={x.n} type="button" className="opcion" aria-pressed={s === i} onClick={() => setS(i)} style={{ display: 'grid', justifyItems: 'center', gap: 4, padding: '10px 6px' }}>
            <svg viewBox="0 0 80 56" width="64" height="45" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{x.s}</svg>
            <span style={{ fontSize: 12.5 }}>{x.n}</span>
          </button>
        ))}
      </div>
      <p className="resultado" style={{ marginTop: 14 }} aria-live="polite"><strong>{SIMBOLOS[s].n}.</strong> {SIMBOLOS[s].d}</p>
    </Panel>
  );
}

// ---------- Del pseudocódigo a C# ----------
const PSEUDO = `Algoritmo triangulo
    Definir area, altura, base Como Real
    Escribir "Introduce la altura del triángulo:"
    Leer altura
    Escribir "Introduce la base del triángulo:"
    Leer base
    area <- (altura * base) / 2
    Escribir "El área del triángulo es: ", area
FinAlgoritmo`;

const CS_TRIANGULO = `double area, altura, baseT;
Console.WriteLine("Introduce la altura del triángulo:");
altura = double.Parse(Console.ReadLine());
Console.WriteLine("Introduce la base del triángulo:");
baseT = double.Parse(Console.ReadLine());
area = (altura * baseT) / 2;
Console.WriteLine("El área del triángulo es: " + area);`;

const progTriangulo: Programa = function* (t) {
  yield t.en(1, '«Definir … Como Real» se traduce declarando variables double. base es palabra reservada en C#, por eso se llama baseT.');
  t.def('area', 'double', '(sin asignar)'); t.def('altura', 'double', '(sin asignar)'); t.def('baseT', 'double', '(sin asignar)');
  yield t.en(2, '«Escribir» se traduce por Console.WriteLine.');
  t.writeLine('Introduce la altura del triángulo:');
  const a = yield t.leer(3, '«Leer altura»: ReadLine espera tu respuesta y double.Parse la convierte a número.');
  t.def('altura', 'double', doubleParse(a));
  yield t.en(4);
  t.writeLine('Introduce la base del triángulo:');
  const b = yield t.leer(5);
  t.def('baseT', 'double', doubleParse(b));
  yield t.en(6, 'La flecha ← del pseudocódigo es el = de C#: guarda el resultado en area.');
  const area = (doubleParse(a) * doubleParse(b)) / 2;
  t.def('area', 'double', area);
  yield t.en(7);
  t.writeLine(`El área del triángulo es: ${csDouble(area)}`);
};

export default function Cuerpo() {
  return (
    <>
      <Bloque id="simbolos" titulo="Los símbolos">
        <p>Un diagrama de flujo representa un proceso con símbolos estándar unidos por flechas. Cada símbolo significa una cosa, y cualquier programador del mundo lo lee igual.</p>
        <Simbolos />
      </Bloque>

      <Bloque id="reglas" titulo="Reglas del diagrama">
        <ul>
          <li>Se escribe <strong>de arriba abajo</strong> o <strong>de izquierda a derecha</strong>.</li>
          <li><strong>No se cruzan líneas.</strong> Para eso existe el conector, que solo se usa cuando no queda otra opción.</li>
          <li>Todas las flechas salen de un símbolo y llegan a otro: nada queda suelto.</li>
          <li>El texto dentro de cada forma es corto y legible.</li>
          <li>Todo rombo de decisión tiene <strong>más de una salida</strong> (sí / no).</li>
        </ul>
        <p>El diagrama de la lámina interactiva es el ejemplo del temario: muestra los pares del 0 al 98. Fíjate en la flecha que vuelve al rombo: así se dibuja un bucle. Recórrelo con un límite pequeño y cuenta cuántas veces se pregunta <C>{'num<=limite'}</C>: siempre una vez más que números se escriben. Esa última pregunta, la que responde «no», es la que termina el bucle.</p>
      </Bloque>

      <Bloque id="pseudocodigo" titulo="Pseudocódigo">
        <p>El pseudocódigo escribe el algoritmo con palabras casi naturales y estructura de programa. No lo ejecuta ningún ordenador. Las normas del temario:</p>
        <ul>
          <li>Empieza con <C>Algoritmo</C> seguido del nombre y termina con <C>FinAlgoritmo</C>.</li>
          <li>Entre medias va la secuencia de instrucciones: <em>Definir, Leer, Escribir</em>, asignaciones…</li>
          <li>La sangría no es obligatoria, pero sí muy recomendable.</li>
          <li>No distingue mayúsculas de minúsculas. C# sí las distingue: cuidado al traducir.</li>
        </ul>
        <pre style={{ padding: '16px 18px', borderRadius: 12, background: 'var(--t1)', border: '1px solid var(--t4)', font: '500 15px/1.7 var(--f-codigo)', overflowX: 'auto' }}>{PSEUDO}</pre>
        <Ojo dice="«Definir área, altura, base de tipo números reales»" realidad={<>Es pseudocódigo al estilo de PSeInt, una herramienta gratuita para practicar pseudocódigo que sí ejecuta los algoritmos. Para C#, «número real» se traduce por <C>double</C>. Y cuidado: <C>base</C> es palabra reservada en C# y no puede ser nombre de variable.</>} />
      </Bloque>

      <Bloque id="de-pseudo-a-cs" titulo="Del pseudocódigo a C#">
        <p>Traducir es casi mecánico: <em>Definir</em> → declarar variables, <em>Escribir</em> → <C>Console.WriteLine</C>, <em>Leer</em> → <C>Console.ReadLine</C> más una conversión, y la flecha <C>{'<-'}</C> → <C>=</C>. Ejecútalo y compara cada línea con su equivalente en pseudocódigo:</p>
        <Simulador titulo="El triángulo del temario, en C#" codigo={CS_TRIANGULO} programa={progTriangulo} pruebas={['6', '4,5', '10']} />
        <ParaElReto>
          <p>Antes de escribir el reto, haz su diagrama de flujo o su pseudocódigo: pedir datos, validar, elegir el IVA, calcular y mostrar. Son 15 minutos que te ahorran horas, y el control de flujo es el 40 % de la nota.</p>
        </ParaElReto>
        <Codigo titulo="Por qué el ejemplo usa baseT" codigo={`double base = 5;   // error CS1041: se esperaba un identificador; 'base' es una palabra clave`} numeros={false} />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="diagramas" preguntas={[
          { p: '¿Qué símbolo usarías para «¿la edad es mayor que 17?»?', opciones: ['Rectángulo', 'Rombo', 'Paralelogramo', 'Óvalo'], ok: 1, porque: 'Es una decisión: rombo con salida sí y salida no.' },
          { p: '¿Qué símbolo representa «Leer precio»?', opciones: ['Proceso', 'Terminal', 'Entrada/salida', 'Conector'], ok: 2, porque: 'Leer y mostrar datos se dibujan con el paralelogramo.' },
          { p: '¿Cuál es cierto sobre el pseudocódigo?', opciones: ['Se compila igual que C#', 'Distingue mayúsculas', 'Ningún ordenador lo ejecuta tal cual', 'Es obligatorio sangrarlo'], ok: 2, porque: 'Es una herramienta para pensar. (PSeInt lo interpreta, pero el pseudocódigo en sí no es un lenguaje de máquina.)' },
          { p: 'En el diagrama de pares hasta 10, ¿cuántas veces se evalúa la condición?', opciones: ['5', '6', '7', '11'], ok: 2, porque: 'Se escriben 0, 2, 4, 6, 8 y 10 (seis veces «sí») y una séptima pregunta responde «no» con num = 12.' },
        ]} />
      </div>
    </>
  );
}
