import { useMemo, useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Programar no empieza en el teclado. Primero piensas los pasos que resuelven el problema: eso es el <strong>algoritmo</strong>. Cuando escribes esos pasos en un lenguaje que el ordenador entiende y puede ejecutar, tienes un <strong>programa</strong>.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Una lista finita de pasos ordenados, sin ambigüedad, que termina con la solución.'],
  ['Se confunde con', 'El programa. Regla práctica: si está en tu cabeza o en papel, es algoritmo; si el ordenador lo puede ejecutar, es programa.'],
  ['Hábitat', 'Antes de escribir código. En el Reto 1: decidir en papel cómo calcular el IVA y las cuotas antes de abrir VS Code.'],
  ['Forma típica', 'Entrada → Proceso → Salida.'],
];

export const secciones = [
  { id: 'diferencia', titulo: 'Algoritmo frente a programa' },
  { id: 'eps', titulo: 'Entrada, proceso y salida' },
  { id: 'tres-formas', titulo: 'Tres formas de decir lo mismo' },
  { id: 'calidad', titulo: 'Qué hace bueno a un programa' },
  { id: 'paradigmas', titulo: 'Paradigmas' },
];

// ---------- Destacado: ordenar la receta ----------
const PASOS = ['Leer los precios de los productos', 'Sumar los precios', 'Si hay descuento, aplicarlo al total', 'Mostrar el total a pagar'];
const BARAJADO = [2, 0, 3, 1];

export function Destacado() {
  const [orden, setOrden] = useState<number[]>([]);
  const completo = orden.length === PASOS.length;
  const bien = completo && orden.every((p, i) => p === i);
  return (
    <Panel titulo="Ordena el algoritmo de la compra">
      <p style={{ margin: '0 0 14px', color: 'var(--t9)' }}>Toca los pasos en el orden en que los harías para calcular cuánto pagas en una tienda.</p>
      <div className="opciones" role="group" aria-label="Pasos desordenados">
        {BARAJADO.map((p) => (
          <button key={p} type="button" className="opcion" disabled={orden.includes(p)} aria-pressed={orden.includes(p)} onClick={() => setOrden([...orden, p])} style={{ opacity: orden.includes(p) ? 0.35 : 1 }}>{PASOS[p]}</button>
        ))}
      </div>
      <ol style={{ margin: '0 0 16px', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {PASOS.map((_, i) => (
          <li key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 10, alignItems: 'center', padding: '10px 12px', borderRadius: 10, border: '1px dashed var(--t5)', background: orden[i] !== undefined ? 'var(--t1)' : 'transparent', minHeight: 46 }}>
            <span style={{ font: '800 18px var(--f-titulo)', color: 'var(--familia)' }}>{i + 1}</span>
            <span style={{ color: completo && orden[i] !== i ? 'var(--rojo)' : 'var(--t10)' }}>{orden[i] !== undefined ? PASOS[orden[i]] : ''}</span>
          </li>
        ))}
      </ol>
      <p className="resultado" data-ok={completo ? bien : undefined} aria-live="polite">
        {!completo ? 'Faltan pasos por colocar.' : bien
          ? <><strong>Eso es un algoritmo:</strong> una secuencia finita y ordenada de pasos. Todavía no es un programa: aún no hay ni una línea de C#.</>
          : <><strong>Revisa el orden.</strong> No puedes aplicar un descuento a un total que aún no has sumado. En un algoritmo el orden importa.</>}
      </p>
      {orden.length > 0 && <div style={{ marginTop: 12 }}><Button label="Volver a empezar" variant="ghost" size="sm" onClick={() => setOrden([])} /></div>}
    </Panel>
  );
}

// ---------- Simulador: el algoritmo convertido en programa ----------
const CODIGO_COMPRA = `Console.Write("Precio 1: ");
double p1 = double.Parse(Console.ReadLine());
Console.Write("Precio 2: ");
double p2 = double.Parse(Console.ReadLine());
double total = p1 + p2;
if (total > 50)
{
    total = total * 0.90;   // 10 % de descuento
}
Console.WriteLine($"Total a pagar: {total:F2} €");`;

const progCompra: Programa = function* (t) {
  yield t.en(1, 'Paso 1 del algoritmo, «leer precios». Primero se escribe la pregunta.');
  t.write('Precio 1: ');
  const a = yield t.leer(2, 'Escribe un precio. En la consola, con el ordenador en español, los decimales van con coma: 12,50.');
  const p1 = doubleParse(a);
  t.def('p1', 'double', p1);
  yield t.en(3);
  t.write('Precio 2: ');
  const b = yield t.leer(4);
  const p2 = doubleParse(b);
  t.def('p2', 'double', p2);
  yield t.en(5, 'Paso 2, «sumar los precios».');
  let total = p1 + p2;
  t.def('total', 'double', total);
  yield t.en(6, `Paso 3, «si hay descuento». ¿total > 50? ${csDouble(total)} > 50 es ${total > 50}.`);
  if (total > 50) {
    yield t.en(8, 'Se cumple: aplicamos un 10 % de descuento multiplicando por 0,90.');
    total = total * 0.9;
    t.def('total', 'double', total);
  }
  yield t.en(10, 'Paso 4, «mostrar el total». :F2 lo deja con dos decimales.');
  t.writeLine(`Total a pagar: ${csDouble(total, 'F2')} €`);
};

// ---------- Entrada · proceso · salida ----------
function EPS() {
  const [base, setBase] = useState(6);
  const [altura, setAltura] = useState(4);
  const caja = (titulo: string, cuerpo: React.ReactNode, color: string) => (
    <div style={{ flex: '1 1 160px', padding: '14px 16px', borderRadius: 12, border: `1px solid ${color}`, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
      <div style={{ font: '700 12.5px var(--f-titulo)', letterSpacing: '.06em', textTransform: 'uppercase', color, marginBottom: 6 }}>{titulo}</div>
      <div className="grande" style={{ fontSize: 18 }}>{cuerpo}</div>
    </div>
  );
  return (
    <Panel titulo="Área de un rectángulo">
      <div className="fila-controles">
        <Slider label="Base" value={base} onChange={(v: number) => setBase(v)} min={1} max={12} valueDisplay="text" />
        <Slider label="Altura" value={altura} onChange={(v: number) => setAltura(v)} min={1} max={8} valueDisplay="text" />
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
        {caja('Entrada', <>base = {base}<br />altura = {altura}</>, 'var(--azul)')}
        {caja('Proceso', <>área = base × altura</>, 'var(--lila)')}
        {caja('Salida', <>área = {base * altura}</>, 'var(--cian)')}
      </div>
      <svg viewBox="0 0 260 120" style={{ width: '100%', maxWidth: 360, height: 'auto', display: 'block', margin: '18px auto 0' }} role="img" aria-label={`Rectángulo de ${base} por ${altura}`}>
        <rect x={130 - base * 10} y={60 - altura * 7} width={base * 20} height={altura * 14} rx="4" fill="color-mix(in srgb, var(--cian-solido) 22%, transparent)" stroke="var(--cian)" strokeWidth="1.5" style={{ transition: 'all 300ms var(--ease)' }} />
      </svg>
    </Panel>
  );
}

// ---------- Tres formas ----------
const FORMAS = {
  natural: { titulo: 'Lenguaje natural', texto: 'Pide un número. Pide otro número. Súmalos. Enseña el resultado.' },
  pseudo: { titulo: 'Pseudocódigo', texto: 'Algoritmo Sumar\n    Leer A\n    Leer B\n    resultado ← A + B\n    Escribir resultado\nFinAlgoritmo' },
  csharp: { titulo: 'C#', texto: 'int a = int.Parse(Console.ReadLine());\nint b = int.Parse(Console.ReadLine());\nint resultado = a + b;\nConsole.WriteLine(resultado);' },
} as const;

function TresFormas() {
  const [f, setF] = useState<keyof typeof FORMAS>('natural');
  return (
    <Panel titulo="La misma solución, tres formas">
      <SegmentedControl label="Forma de expresar el algoritmo" value={f} onChange={(v) => setF(v as keyof typeof FORMAS)}>
        <SegmentedControlItem value="natural" label="Lenguaje natural" />
        <SegmentedControlItem value="pseudo" label="Pseudocódigo" />
        <SegmentedControlItem value="csharp" label="C#" />
      </SegmentedControl>
      {f === 'csharp'
        ? <Codigo codigo={FORMAS.csharp.texto} />
        : <pre style={{ margin: '18px 0 0', padding: '16px 18px', borderRadius: 12, background: 'var(--t1)', border: '1px solid var(--t4)', font: f === 'pseudo' ? '500 15px/1.7 var(--f-codigo)' : '500 18px/1.6 var(--f-texto)', whiteSpace: 'pre-wrap', color: 'var(--t10)' }}>{FORMAS[f].texto}</pre>}
      <p style={{ margin: '14px 0 0', color: 'var(--t8)', fontSize: 15 }}>
        {f === 'natural' ? 'Cualquier persona lo entiende, pero es ambiguo: ¿qué es «enseñar»? ¿Y si escribe letras?' : f === 'pseudo' ? 'Estructurado como un programa, pero ningún ordenador lo ejecuta. Sirve para pensar.' : 'Ahora sí: el ordenador lo puede compilar y ejecutar. Esto ya es un programa.'}
      </p>
    </Panel>
  );
}

// ---------- Calidad ----------
const CALIDAD = [
  ['Finito', 'Tiene un número limitado de instrucciones y termina.', 'Un bucle que nunca acaba no resuelve nada.'],
  ['Legible', 'Se entiende al leerlo: sangría, espacios y nombres claros.', <C key="l">{'int x=a*b+c;'}</C>],
  ['Modificable', 'Cambiarlo cuando cambian las necesidades no es un drama.', 'El 21 % de IVA escrito a mano en 15 sitios distintos.'],
  ['Eficiente', 'Usa poca memoria y se ejecuta rápido.', 'Recalcular lo mismo mil veces dentro de un bucle.'],
  ['Modulable', 'Dividido en un programa principal y subprogramas que se reutilizan.', 'Un Main de 600 líneas que lo hace todo.'],
  ['Estructurado', 'Reúne todo lo anterior: fácil de leer, de modificar y hecho de piezas reutilizables.', 'Saltos sin orden en los que nadie sabe por dónde va.'],
] as const;

export default function Cuerpo() {
  const [cal, setCal] = useState(0);
  const filas = useMemo(() => CALIDAD, []);
  return (
    <>
      <Bloque id="diferencia" titulo="Algoritmo frente a programa">
        <p>Un <T def="Secuencia finita y ordenada de operaciones que resuelve un problema.">algoritmo</T> es una secuencia finita de operaciones que resuelve un problema. Es la idea, la receta: puede vivir en tu cabeza o en una servilleta.</p>
        <p>Un <T def="Conjunto de instrucciones escritas en un lenguaje que el ordenador entiende, para decirle lo que queremos que haga.">programa</T> es esa misma receta escrita en un lenguaje que el ordenador entiende, para que la ejecute exactamente así, paso a paso. El método de trabajo es siempre el mismo: <strong>primero diseñas el algoritmo y después lo programas</strong>.</p>
        <p>Abajo tienes el algoritmo de la compra que acabas de ordenar, convertido en C#. No hace falta que entiendas aún cada palabra: fíjate en que cada línea corresponde a uno de los cuatro pasos. Pulsa «Paso» y escribe dos precios cuando te los pida.</p>
        <Simulador titulo="El algoritmo de la compra, ya como programa" codigo={CODIGO_COMPRA} programa={progCompra} pruebas={['12,50', '40', '2.5', 'diez']} />
        <p>Prueba también con <C>diez</C>: el programa se rompe. Hacer programas que no se rompan con lo que escribe el usuario es justo lo que pide el Reto 1, y se aprende en las láminas 08 y 11.</p>
      </Bloque>

      <Bloque id="eps" titulo="Entrada, proceso y salida">
        <p>Casi todo programa sigue el mismo esquema. Recibe datos (<strong>entrada</strong>), hace algo con ellos (<strong>proceso</strong>) y devuelve un resultado (<strong>salida</strong>). Si te bloqueas ante un enunciado, sepáralo en esas tres preguntas: ¿qué me dan?, ¿qué tengo que calcular? y ¿qué tengo que enseñar?</p>
        <EPS />
        <EnClase fecha="14/10">
          <p>La profesora usó este ejemplo del rectángulo para presentar el esquema entrada → proceso → salida antes de escribir la primera variable.</p>
        </EnClase>
      </Bloque>

      <Bloque id="tres-formas" titulo="Tres formas de decir lo mismo">
        <p>Una misma solución se puede expresar con distintos grados de precisión. Pasar de una a otra es el oficio de programar:</p>
        <TresFormas />
        <p>El pseudocódigo y los diagramas de flujo son las dos herramientas oficiales para representar un algoritmo antes de programarlo. Las ves a fondo en la lámina 02.</p>
      </Bloque>

      <Bloque id="calidad" titulo="Qué hace bueno a un programa">
        <p>No basta con que funcione. El temario pide seis cualidades. Toca cada una para ver su contraejemplo:</p>
        <Panel titulo="Las seis cualidades de un buen programa">
          <div className="opciones" role="tablist" aria-label="Cualidades">
            {filas.map(([n], i) => <button key={n} type="button" role="tab" className="opcion" aria-selected={cal === i} aria-pressed={cal === i} onClick={() => setCal(i)}>{n}</button>)}
          </div>
          <div role="tabpanel" aria-live="polite">
            <p style={{ margin: '0 0 10px', fontSize: 18, color: 'var(--t10)' }}><strong>{filas[cal][0]}:</strong> {filas[cal][1]}</p>
            <p className="resultado" data-ok="false" style={{ margin: 0 }}><strong>Contraejemplo:</strong> {filas[cal][2]}</p>
          </div>
        </Panel>
        <p>La sexta, <strong>estructurado</strong>, resume a las demás. Un programa estructurado se lee bien, se modifica sin miedo y está hecho de piezas que se reutilizan. Por eso la Unidad 1 se llama <em>programación estructurada</em>.</p>
        <ParaElReto>
          <p>La rúbrica dedica un 10 % a «Calidad del código»: código claro, organizado y con comentarios útiles. Legible y modificable no son adornos: puntúan.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="paradigmas" titulo="Paradigmas">
        <p>Un <T def="Una manera de organizar y pensar los programas.">paradigma</T> es un estilo de organizar un programa. La píldora lo nombra en su título, aunque no lo desarrolla. Este es el mapa del curso:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Paradigma</th><th>Idea</th><th>En el módulo</th></tr></thead>
            <tbody>
              <tr><td>Imperativo y estructurado</td><td>Instrucciones en orden, con decisiones y bucles</td><td>Unidad 1 y Reto 1</td></tr>
              <tr><td>Modular</td><td>Partir el programa en funciones reutilizables</td><td>Unidad 2</td></tr>
              <tr><td>Orientado a objetos</td><td>Organizar el programa en clases y objetos</td><td>Unidades 3 y 4, Java</td></tr>
              <tr><td>Declarativo</td><td>Describir qué quieres, no cómo conseguirlo (SQL, por ejemplo)</td><td>Módulo de Bases de datos</td></tr>
            </tbody>
          </table>
        </div>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="algoritmos" preguntas={[
          { p: 'Has escrito en un papel los pasos para calcular la nota media. ¿Qué tienes?', opciones: ['Un programa', 'Un algoritmo', 'Un compilador', 'Nada todavía'], ok: 1, porque: 'Mientras no esté escrito en un lenguaje que el ordenador pueda ejecutar, es un algoritmo.' },
          { p: 'En «calcular el área de un rectángulo», ¿qué es la base?', opciones: ['Entrada', 'Proceso', 'Salida', 'Ninguna'], ok: 0, porque: 'Es un dato que el programa recibe para trabajar.' },
          { p: '¿Cuál de estas cualidades engloba a las demás?', opciones: ['Eficiente', 'Finito', 'Estructurado', 'Legible'], ok: 2, porque: 'Un programa estructurado es legible, modificable y modular a la vez.' },
          { p: 'Un programa entra en un bucle que nunca termina. ¿Qué cualidad incumple?', opciones: ['Modulable', 'Finito', 'Legible', 'Ninguna, funciona'], ok: 1, porque: 'Un programa debe terminar. Si no termina, no da la solución.' },
        ]} />
      </div>
    </>
  );
}
