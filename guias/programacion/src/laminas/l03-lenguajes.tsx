import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, T } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';

export const entradilla = (
  <p>El procesador solo entiende ceros y unos. Tú escribes en un lenguaje pensado para personas. Entre los dos hay una <strong>traducción</strong>, y cómo y cuándo se hace marca la diferencia entre compilar e interpretar. En C# el viaje tiene una parada intermedia que conviene conocer.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Alto nivel: palabras y símbolos legibles. Bajo nivel: registros e instrucciones de la máquina.'],
  ['Se confunde con', 'Compilado e interpretado no son tipos de lenguaje cerrados: C# y Java compilan a un código intermedio y luego lo traducen al ejecutar.'],
  ['Hábitat', 'Cada vez que pulsas Run: dotnet compila tu Program.cs y el CLR lo ejecuta.'],
  ['Clave de C#', '.cs → compilador → IL (MSIL) → CLR con JIT → código máquina.'],
];

export const secciones = [
  { id: 'niveles', titulo: 'Alto y bajo nivel' },
  { id: 'comunicacion', titulo: 'Usuario, canal y lenguaje' },
  { id: 'traduccion', titulo: 'Compilar e interpretar' },
  { id: 'csharp-java', titulo: 'C# y Java' },
  { id: 'dotnet', titulo: '.NET, SDK y runtime' },
];

// ---------- Destacado: el viaje del código ----------
const VIAJES = {
  csharp: {
    nombre: 'C# (.NET)',
    etapas: [
      ['Program.cs', 'Tu código fuente: texto legible que escribes en VS Code.'],
      ['Compilador de C#', 'Al pulsar Run, «dotnet build» revisa la sintaxis y traduce. Si hay un error, se para aquí y no se ejecuta nada.'],
      ['IL (MSIL)', 'Resultado: un .dll en un lenguaje intermedio que no es de ningún procesador concreto. Por eso es portable.'],
      ['CLR + JIT', 'El Common Language Runtime carga el IL y su compilador JIT («justo a tiempo») lo traduce a código máquina mientras se ejecuta.'],
      ['Procesador', 'Código máquina nativo de tu equipo (Intel, AMD, Apple…). Ahora sí se ejecuta.'],
    ],
  },
  java: {
    nombre: 'Java',
    etapas: [
      ['Programa.java', 'Código fuente Java. Lo usarás en los retos 3 y 4.'],
      ['javac', 'El compilador de Java traduce a bytecode y detecta errores de sintaxis.'],
      ['Bytecode (.class)', 'Código intermedio, igual de portable que el IL de C#.'],
      ['JVM + JIT', 'La máquina virtual de Java interpreta y compila con JIT el bytecode.'],
      ['Procesador', 'Código máquina nativo.'],
    ],
  },
  c: {
    nombre: 'C (nativo)',
    etapas: [
      ['programa.c', 'Código fuente en C, un lenguaje de nivel medio.'],
      ['Compilador', 'Traduce directamente a código máquina de UN tipo de procesador.'],
      ['Enlazador', 'Une ese código con las librerías y produce el ejecutable (.exe).'],
      ['Procesador', 'Se ejecuta directamente. Rapidísimo, pero solo en ese tipo de máquina y sistema.'],
    ],
  },
  python: {
    nombre: 'Interpretado',
    etapas: [
      ['programa.py', 'Código fuente de un lenguaje interpretado, como Python (el de Fundamentos).'],
      ['Intérprete', 'Lee una sentencia, la traduce y la ejecuta. Luego la siguiente. No genera un ejecutable antes.'],
      ['Procesador', 'Ejecuta cada sentencia según llega. Un error en la línea 40 no aparece hasta que la ejecución llega allí.'],
    ],
  },
} as const;
type Viaje = keyof typeof VIAJES;

export function Destacado() {
  const [v, setV] = useState<Viaje>('csharp');
  const [i, setI] = useState(0);
  const etapas = VIAJES[v].etapas;
  return (
    <Panel titulo="El viaje de tu código hasta el procesador">
      <SegmentedControl label="Modelo de ejecución" value={v} onChange={(x) => { setV(x as Viaje); setI(0); }} size="sm">
        {(Object.keys(VIAJES) as Viaje[]).map((k) => <SegmentedControlItem key={k} value={k} label={VIAJES[k].nombre} />)}
      </SegmentedControl>
      <ol style={{ listStyle: 'none', margin: '20px 0 0', padding: 0, display: 'grid', gap: 0 }}>
        {etapas.map(([n, d], k) => (
          <li key={n} style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 14 }}>
            <div style={{ display: 'grid', justifyItems: 'center', gridTemplateRows: '28px 1fr' }} aria-hidden="true">
              <span style={{ width: 16, height: 16, marginTop: 6, borderRadius: '50%', border: '2px solid', borderColor: k <= i ? 'var(--cian-solido)' : 'var(--t6)', background: k === i ? 'var(--cian-solido)' : k < i ? 'color-mix(in srgb, var(--cian-solido) 30%, transparent)' : 'transparent', transition: 'all 260ms var(--ease)' }} />
              {k < etapas.length - 1 && <span style={{ width: 2, background: k < i ? 'var(--cian-solido)' : 'var(--t5)', transition: 'background 260ms' }} />}
            </div>
            <div style={{ paddingBottom: 14, opacity: k <= i ? 1 : 0.45, transition: 'opacity 260ms' }}>
              <div style={{ font: '700 16px var(--f-titulo)', color: 'var(--t10)' }}>{n}</div>
              {k === i && <p style={{ margin: '4px 0 0', fontSize: 15, color: 'var(--t9)' }} aria-live="polite">{d}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div className="sim-mandos">
        <Button label={i < etapas.length - 1 ? 'Siguiente etapa' : 'Ejecutándose'} variant="primary" size="sm" isDisabled={i >= etapas.length - 1} onClick={() => setI(i + 1)} />
        <Button label="Desde el principio" variant="ghost" size="sm" isDisabled={i === 0} onClick={() => setI(0)} />
      </div>
    </Panel>
  );
}

// ---------- Niveles ----------
const NIVELES = [
  { n: 'C# (alto nivel)', c: 'total = precio + iva;', d: 'Se lee casi como una frase. Funciona igual en Windows, Mac y Linux.' },
  { n: 'Ensamblador (bajo nivel)', c: 'mov eax, [precio]\nadd eax, [iva]\nmov [total], eax', d: 'Cada línea es una instrucción del procesador y trabaja con registros (eax). Solo vale para esa familia de procesadores.' },
  { n: 'Código máquina', c: '8B 05 10 00 00 00\n03 05 14 00 00 00\n89 05 18 00 00 00', d: 'Lo único que entiende el procesador: bytes. Nadie programa así a mano.' },
];

function Niveles() {
  const [k, setK] = useState(0);
  return (
    <Panel titulo="La misma suma a tres niveles (ilustrativo)">
      <div className="opciones" role="group" aria-label="Nivel">
        {NIVELES.map((x, j) => <button key={x.n} type="button" className="opcion" aria-pressed={k === j} onClick={() => setK(j)}>{x.n}</button>)}
      </div>
      <pre style={{ margin: '0 0 12px', padding: '16px 18px', borderRadius: 12, background: 'light-dark(#141416, #0c0c0e)', color: '#dbe4f3', font: '500 16px/1.7 var(--f-codigo)' }}>{NIVELES[k].c}</pre>
      <p style={{ margin: 0, color: 'var(--t9)' }} aria-live="polite">{NIVELES[k].d}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="niveles" titulo="Alto y bajo nivel">
        <p>Si el ordenador entiende código máquina, ¿por qué no programamos así? Porque el programa quedaría <strong>pegado al hardware</strong>: solo funcionaría en ese tipo de procesador y mantenerlo sería una pesadilla.</p>
        <Niveles />
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th></th><th>Alto nivel</th><th>Bajo nivel</th></tr></thead>
            <tbody>
              <tr><td>Cerca de…</td><td>Las personas</td><td>La máquina</td></tr>
              <tr><td>Depende de la máquina</td><td>No: es portable</td><td>Totalmente</td></tr>
              <tr><td>Modificar y actualizar</td><td>Fácil</td><td>Difícil</td></tr>
              <tr><td>Traducir a máquina</td><td>Necesita compilador o intérprete</td><td>Casi directo</td></tr>
              <tr><td>Ejemplos</td><td>C#, Java, Python, PHP, VB.NET</td><td>Ensamblador</td></tr>
            </tbody>
          </table>
        </div>
        <p>Entre medias está el <strong>nivel medio</strong>, como el lenguaje C, que mezcla rasgos de ambos. Un error típico es pensar que «más cerca del hardware» es mejor: solo compensa cuando de verdad necesitas controlar el hardware. Para casi todo lo demás, alto nivel.</p>
      </Bloque>

      <Bloque id="comunicacion" titulo="Usuario, canal y lenguaje">
        <p>Programar es comunicar a una persona con una máquina. Como en cualquier comunicación, hacen falta un <strong>emisor y un receptor</strong> (tú y el ordenador), un <strong>canal</strong> (el teclado) y un <strong>lenguaje</strong> común. Como cada uno habla un idioma completamente distinto, los lenguajes de programación hacen de puente.</p>
      </Bloque>

      <Bloque id="traduccion" titulo="Compilar e interpretar">
        <p>La diferencia clave es <strong>cuándo</strong> se traduce:</p>
        <ul>
          <li><strong>Compilado</strong>: un <T def="Programa que traduce todo el código fuente antes de ejecutarlo y avisa de los errores de sintaxis.">compilador</T> traduce todo el programa antes de ejecutarlo. Si hay un error de sintaxis, no se ejecuta nada.</li>
          <li><strong>Interpretado</strong>: un <T def="Programa que traduce y ejecuta el código sentencia a sentencia, sin generar antes un ejecutable.">intérprete</T> traduce y ejecuta a la vez, sentencia a sentencia. Suele ser más lento, porque traduce mientras ejecuta.</li>
        </ul>
        <p>En un lenguaje compilado clásico, como C, interviene además el <T def="Herramienta que une el código traducido con las librerías que necesita para producir el ejecutable final.">enlazador</T>, que une tu código traducido con las <strong>librerías</strong> del lenguaje: código ya hecho para mostrar texto, calcular raíces y mil cosas más.</p>
        <Ojo dice="«Un intérprete verifica cada línea del programa cuando se escribe»." realidad="La verifica cuando la va a ejecutar, no mientras tú escribes. Lo que te marca errores al escribir es el editor (VS Code con C# Dev Kit), que analiza el código en segundo plano." />
        <Ojo dice="Java «es interpretado, ya que su código máquina se puede ejecutar sobre cualquier máquina» y se transforma en «un código máquina muy parecido al ensamblador»." realidad="Java compila a bytecode, un código intermedio, y la JVM lo ejecuta interpretándolo y compilándolo con JIT. Es el mismo modelo que C# con IL y CLR. Ambos son mixtos: compilan a intermedio y traducen a máquina al ejecutar." />
        <p>En C# no hay un paso de enlazado como el de C: las librerías de .NET son también IL y el CLR las carga al ejecutar. El temario simplifica con «compilador y enlazador», y para el examen basta con saber qué hace cada uno.</p>
      </Bloque>

      <Bloque id="csharp-java" titulo="C# y Java">
        <p>Son primos hermanos: sintaxis casi idéntica, orientados a objetos y con un entorno que gestiona la memoria por ti. Lo que aprendas ahora en C# lo reutilizarás en los retos 3 y 4 de Java.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Aspecto</th><th>C#</th><th>Java</th></tr></thead>
            <tbody>
              <tr><td>Paradigma</td><td>Orientado a objetos</td><td>Orientado a objetos</td></tr>
              <tr><td>Código intermedio</td><td>IL (MSIL)</td><td>Bytecode</td></tr>
              <tr><td>Entorno de ejecución</td><td>CLR (.NET)</td><td>JVM</td></tr>
              <tr><td>Memoria</td><td>Recolector de basura del CLR: no liberas memoria a mano</td><td>Recolector de basura de la JVM</td></tr>
              <tr><td>Tipos</td><td>De valor y de referencia; todo deriva de <C>System.Object</C>, también los básicos</td><td>Primitivos (int, double…) aparte de los objetos</td></tr>
              <tr><td>Paso de argumentos</td><td>Por valor por defecto; <C>ref</C> y <C>out</C> para pasar por referencia</td><td>Siempre por valor</td></tr>
              <tr><td>Hilos</td><td>Sí</td><td>Sí, desde el propio lenguaje</td></tr>
            </tbody>
          </table>
        </div>
      </Bloque>

      <Bloque id="dotnet" titulo=".NET, SDK y runtime">
        <p>C# vive dentro de la plataforma <strong>.NET</strong>. Para trabajar necesitas el <T def="Kit de desarrollo de .NET: compilador, herramientas de proyecto y runtime.">SDK</T>, no solo el runtime:</p>
        <ul>
          <li><strong>SDK</strong>: herramientas para crear, compilar y ejecutar. Lo necesita quien programa.</li>
          <li><strong>Runtime</strong>: solo ejecuta aplicaciones ya construidas. Basta para quien usa la aplicación.</li>
        </ul>
        <EnClase fecha="07/10">
          <p>«Code escribo, C# Dev Kit para que VS Code entienda C#, .NET SDK para compilar y ejecutar». La comprobación de que todo está bien es abrir la terminal y escribir <C>dotnet --version</C>. Lo montas paso a paso en la lámina 04.</p>
        </EnClase>
        <Codigo titulo="Terminal de VS Code" codigo={`dotnet --version\n10.0.100`} numeros={false} />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="lenguajes" preguntas={[
          { p: '¿Qué genera el compilador de C# al compilar tu Program.cs?', opciones: ['Código máquina del procesador', 'IL (código intermedio)', 'Bytecode de Java', 'Pseudocódigo'], ok: 1, porque: 'El IL lo traduce después a máquina el JIT del CLR.' },
          { p: '¿Qué es el CLR?', opciones: ['Un editor de código', 'El entorno que ejecuta el IL de .NET', 'Una librería de matemáticas', 'Un lenguaje de bajo nivel'], ok: 1, porque: 'Common Language Runtime: carga, compila con JIT y ejecuta, y además gestiona la memoria.' },
          { p: '¿Cuál es un lenguaje de bajo nivel?', opciones: ['Python', 'C#', 'Ensamblador', 'Java'], ok: 2, porque: 'Trabaja con registros y depende totalmente del procesador.' },
          { p: 'Para programar en C# en tu ordenador necesitas…', opciones: ['Solo el runtime de .NET', 'El SDK de .NET', 'Java instalado', 'Nada, basta con VS Code'], ok: 1, porque: 'El SDK incluye el compilador y las herramientas de proyecto. VS Code solo es el editor.' },
        ]} />
      </div>
    </>
  );
}
