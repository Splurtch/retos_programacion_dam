import { useState } from 'react';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Kbd } from '@astryxdesign/core/Kbd';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T, guardar, leer } from '../ui/guia.tsx';
import { C, Codigo, resaltar } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';

export const entradilla = (
  <p>Para programar en C# hacen falta tres piezas: un editor donde escribir, una extensión para que el editor entienda C# y el SDK de .NET, que compila y ejecuta. Con ellas montadas, tu primer programa cabe en ocho líneas, y en esta lámina vas a entender cada palabra.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>using System;</C>, <C>class Program</C> y <C>static void Main(string[] args)</C> con sus llaves.</>],
  ['Se confunde con', 'La plantilla moderna de una sola línea («top-level statements»). Es válida, pero en clase y en el reto se usa la estructura explícita con Main.'],
  ['Hábitat', 'Program.cs, dentro de la carpeta del proyecto, junto a .csproj, bin/ y obj/.'],
  ['Regla', 'Un proyecto, un solo Main. Con dos, el compilador no sabe por dónde empezar.'],
];

export const secciones = [
  { id: 'instalar', titulo: 'Montar el entorno' },
  { id: 'proyecto', titulo: 'Crear el proyecto' },
  { id: 'sentencias', titulo: 'Sentencias y bloques' },
  { id: 'consola', titulo: 'Escribir y leer en consola' },
  { id: 'comentarios', titulo: 'Comentarios' },
  { id: 'un-main', titulo: 'Un solo Main' },
];

// ---------- Destacado: anatomía de Program.cs ----------
const PARTES: { t: string; n: string; d: string }[] = [
  { t: 'using System;', n: 'using System;', d: 'Trae las herramientas del espacio de nombres System, como Console. Con el SDK moderno ya viene incluido de forma implícita, por eso VS Code a veces lo pinta atenuado.' },
  { t: 'class Program', n: 'class Program', d: 'Una clase es un contenedor de código. Todo programa C# vive dentro de al menos una. De momento es «la caja que lo envuelve todo»; las clases a fondo llegan en la Unidad 3.' },
  { t: 'static', n: 'static', d: 'Permite usar Main sin crear antes un objeto de la clase. Por ahora basta con saber que Main siempre lo lleva.' },
  { t: 'void', n: 'void', d: '«Vacío»: el método no devuelve ningún resultado al terminar.' },
  { t: 'Main', n: 'Main', d: 'El punto de entrada. Es lo primero que se ejecuta cuando arranca el programa. Lo que quieras que ocurra va dentro de sus llaves.' },
  { t: 'string[] args', n: 'string[] args', d: 'Una lista de textos que se puede pasar al programa desde la línea de comandos. En este curso casi nunca la usarás, pero forma parte de la firma.' },
  { t: 'Console.WriteLine("Hola, DAM");', n: 'Console.WriteLine(…);', d: 'Escribe el texto en la consola y salta de línea. El texto va entre comillas dobles y la instrucción termina en punto y coma.' },
];
const LINEAS: (string | number)[][] = [
  [0], [' '], [1], ['{'], ['    ', 2, ' ', 3, ' ', 4, '(', 5, ')'], ['    {'], ['        ', 6], ['    }'], ['}'],
];

export function Destacado() {
  const [sel, setSel] = useState(4);
  return (
    <Panel titulo="Anatomía de Program.cs">
      <div className="codigo" style={{ margin: 0 }}>
        <pre style={{ fontSize: 15 }}>
          <code>
            {LINEAS.map((l, i) => (
              <span key={i} className="cl">
                <span className="cl-n" aria-hidden="true">{i + 1}</span>
                <span className="cl-t">
                  {l.map((x, j) => typeof x === 'number'
                    ? <button key={j} type="button" className="pieza" aria-pressed={sel === x} onClick={() => setSel(x)}>{resaltar(PARTES[x].t)}</button>
                    : <span key={j} className="cs-op">{x}</span>)}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
      <p className="resultado" style={{ marginTop: 16 }} aria-live="polite"><strong style={{ fontFamily: 'var(--f-codigo)' }}>{PARTES[sel].n}</strong> · {PARTES[sel].d}</p>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--t8)' }}>Toca cada pieza. Se lee de fuera hacia dentro: clase → método Main → instrucciones.</p>
    </Panel>
  );
}

// ---------- Checklist de instalación ----------
type SO = 'windows' | 'mac' | 'linux';
const PASOS_SO: Record<SO, [string, React.ReactNode][]> = {
  windows: [
    ['vscode', <>Instala <strong>VS Code</strong> (x64 en casi todos los PC). Marca «Añadir al PATH» y «Abrir con Code».</>],
    ['devkit', <>En VS Code: Extensiones (<Kbd keys="ctrl+shift+x" />) → busca <strong>C# Dev Kit</strong> de Microsoft → Instalar.</>],
    ['sdk', <>Descarga el <strong>.NET 10 SDK</strong> para Windows x64 (o Arm64 si tu equipo es ARM) desde dotnet.microsoft.com. SDK, no Runtime.</>],
    ['version', <>Abre la terminal de VS Code y escribe <C>dotnet --version</C>. Debe responder 10.0.algo.</>],
  ],
  mac: [
    ['vscode', <>Instala <strong>VS Code</strong> para macOS.</>],
    ['devkit', <>Extensiones (<Kbd keys="mod+shift+x" />) → <strong>C# Dev Kit</strong> → Instalar.</>],
    ['sdk', <>Descarga el <strong>.NET 10 SDK</strong>: Arm64 si tu Mac es Apple Silicon (M1, M2, M3…), x64 si es Intel. Instala el .pkg y reabre la Terminal.</>],
    ['version', <>En la terminal: <C>dotnet --version</C> → 10.0.algo.</>],
  ],
  linux: [
    ['vscode', <>Instala <strong>VS Code</strong> (paquete .deb en Ubuntu).</>],
    ['devkit', <>Extensiones (<Kbd keys="ctrl+shift+x" />) → <strong>C# Dev Kit</strong> → Instalar.</>],
    ['sdk', <>En Ubuntu 24.04: <C>sudo apt install dotnet-sdk-10.0</C>. Es lo que tiene instalado este ordenador.</>],
    ['version', <>En la terminal: <C>dotnet --version</C> → 10.0.115 en este equipo.</>],
  ],
};

function Instalacion() {
  const [so, setSo] = useState<SO>(() => leer('so', 'linux'));
  const [hechos, setHechos] = useState<string[]>(() => leer('instalacion', []));
  const marcar = (k: string, v: boolean) => {
    const n = v ? [...hechos, k] : hechos.filter((x) => x !== k);
    setHechos(n);
    guardar('instalacion', n);
  };
  return (
    <Panel titulo="Tu entorno">
      <SegmentedControl label="Sistema operativo" value={so} onChange={(v) => { setSo(v as SO); guardar('so', v); }} size="sm">
        <SegmentedControlItem value="windows" label="Windows" />
        <SegmentedControlItem value="mac" label="macOS" />
        <SegmentedControlItem value="linux" label="Linux" />
      </SegmentedControl>
      <ol style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'grid', gap: 12 }}>
        {PASOS_SO[so].map(([k, txt], i) => (
          <li key={k} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start' }}>
            <CheckboxInput label={`Paso ${i + 1} hecho`} isLabelHidden value={hechos.includes(k)} onChange={(v: boolean) => marcar(k, v)} />
            <span style={{ color: hechos.includes(k) ? 'var(--t8)' : 'var(--t10)' }}><strong>{i + 1}.</strong> {txt}</span>
          </li>
        ))}
      </ol>
      <p className="resultado" data-ok={hechos.length === 4 ? true : undefined} style={{ marginTop: 16 }}>
        {hechos.length === 4 ? 'Entorno listo. Ya puedes crear el proyecto.' : `${hechos.length} de 4 pasos hechos.`}
      </p>
    </Panel>
  );
}

// ---------- Simuladores ----------
const CODIGO_TARJETA = `using System;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Synji");
        Console.WriteLine("1.º DAM");
        Console.WriteLine("Hoy empiezo C#");
    }
}`;
const progTarjeta: Programa = function* (t) {
  yield t.en(5, 'El programa arranca siempre por Main. Todo lo de fuera es la estructura que lo envuelve.');
  yield t.en(7, 'Primera instrucción: escribe el texto y salta de línea.');
  t.writeLine('Synji');
  yield t.en(8);
  t.writeLine('1.º DAM');
  yield t.en(9);
  t.writeLine('Hoy empiezo C#');
  yield t.en(10, 'Al llegar a la llave que cierra Main, el programa termina.');
};

const CODIGO_LEER = `Console.Write("¿Cómo te llamas? ");
string nombre = Console.ReadLine();
Console.WriteLine("Hola " + nombre);
Console.WriteLine($"Bienvenido a DAM, {nombre}");`;
const progLeer: Programa = function* (t) {
  yield t.en(1, 'Write, sin Line: escribe y deja el cursor en la misma línea, para que respondas al lado.');
  t.write('¿Cómo te llamas? ');
  const n = yield t.leer(2, 'ReadLine se para hasta que escribas y pulses Enter. Lo que escribas llega siempre como string.');
  t.def('nombre', 'string', n ?? '');
  yield t.en(3, 'Concatenar: el + pega dos textos.');
  t.writeLine(`Hola ${n}`);
  yield t.en(4, 'Interpolar: el $ delante de las comillas permite meter variables entre llaves. Es más claro.');
  t.writeLine(`Bienvenido a DAM, ${n}`);
};

export default function Cuerpo() {
  return (
    <>
      <Bloque id="instalar" titulo="Montar el entorno">
        <p>Un <T def="Entorno de desarrollo integrado: editor, compilador, depurador y más en una sola aplicación.">IDE</T> o editor te ayuda a escribir (colorea, autocompleta), a encontrar errores (depurador) y a compilar. En clase se usa este trío:</p>
        <ul>
          <li><strong>VS Code</strong> = escribo. Editor ligero y multiplataforma.</li>
          <li><strong>C# Dev Kit</strong> = VS Code entiende C#: autocompletado, errores, botón de ejecutar y depurador.</li>
          <li><strong>.NET SDK</strong> = compilo y ejecuto. Sin él solo tendrías un bloc de notas con colores.</li>
        </ul>
        <Instalacion />
        <Ojo dice="Usa Visual Studio en Windows/Mac y, en Linux, el proyecto Mono con MonoDevelop." realidad="MonoDevelop está abandonado. Hoy .NET funciona de forma nativa en Linux y el entorno de clase es VS Code + C# Dev Kit + .NET SDK en los tres sistemas. Visual Studio (el completo) sigue siendo válido en Windows, pero pesa mucho más." />
        <EnClase fecha="07/10">
          <p>La primera sesión se dedicó entera a esto, con problemas típicos: la interfaz en inglés, el aviso de «¿Confías en esta carpeta?» (hay que confiar) y haber instalado el Runtime en lugar del SDK. Si <C>dotnet --version</C> responde «command not found», cierra y reabre VS Code; si sigue igual, instala el SDK.</p>
        </EnClase>
      </Bloque>

      <Bloque id="proyecto" titulo="Crear el proyecto">
        <ol>
          <li>Crea una carpeta para la asignatura, por ejemplo <C>ProgramacionDAM</C>, con subcarpetas <C>Reto1</C>, <C>Reto2</C>…</li>
          <li>En VS Code: Archivo → Abrir carpeta → <C>ProgramacionDAM</C>.</li>
          <li>Paleta de comandos <Kbd keys="mod+shift+p" /> → <strong>.NET: New Project</strong> → <strong>Console App</strong> → nombre <C>PrimerCSharp</C>.</li>
          <li>Alternativa por terminal: <C>dotnet new console -n PrimerCSharp</C></li>
        </ol>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Archivo</th><th>Qué es</th><th>¿Lo tocas?</th></tr></thead>
            <tbody>
              <tr><td><C>Program.cs</C></td><td>Tu código C#. La extensión .cs es la de los ficheros de C#.</td><td>Sí, casi todo el reto ocurre aquí</td></tr>
              <tr><td><C>PrimerCSharp.csproj</C></td><td>Describe el proyecto: versión de .NET y configuración</td><td>No</td></tr>
              <tr><td><C>obj/</C></td><td>Archivos temporales de compilación</td><td>No</td></tr>
              <tr><td><C>bin/</C></td><td>El resultado compilado (el .dll que ejecuta el CLR)</td><td>No</td></tr>
            </tbody>
          </table>
        </div>
        <p>Al crear el proyecto, VS Code puede enseñarte un Program.cs de <strong>una sola línea</strong>: <C>Console.WriteLine("Hello, World!");</C>. No es un error: se llama «top-level statements» y el compilador genera el Main por ti. En clase se usa la versión explícita, porque el reto pide «un método Main como punto de entrada».</p>
        <Simulador titulo="Ejercicio de clase · mi primera tarjeta por consola" codigo={CODIGO_TARJETA} programa={progTarjeta} />
      </Bloque>

      <Bloque id="sentencias" titulo="Sentencias y bloques">
        <p>Un programa es una secuencia de <strong>sentencias</strong> (instrucciones) que terminan en <C>;</C>, agrupadas en <strong>bloques</strong> delimitados por llaves <C>{'{ }'}</C>. En Program.cs hay tres bloques anidados: el de la clase, el de Main y, dentro, tus instrucciones.</p>
        <p>Si falta un <C>;</C> o una llave, <strong>no compila</strong>, y el error aparece en la pestaña de problemas o en la salida. La regla de supervivencia: no adivines. Lee el mensaje: dice el archivo, la línea y casi siempre qué falta.</p>
        <Codigo titulo="Un error de compilación típico" codigo={`Console.WriteLine("Hola")\n// Program.cs(7,34): error CS1002: Se esperaba ;`} />
      </Bloque>

      <Bloque id="consola" titulo="Escribir y leer en consola">
        <p>La clase <C>Console</C> es el puente entre el programa y la persona. Sus tres métodos imprescindibles:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Método</th><th>Hace</th></tr></thead>
            <tbody>
              <tr><td><C>Console.WriteLine(x)</C></td><td>Escribe y salta a la línea siguiente</td></tr>
              <tr><td><C>Console.Write(x)</C></td><td>Escribe y deja el cursor en la misma línea. Ideal para preguntas</td></tr>
              <tr><td><C>Console.ReadLine()</C></td><td>Espera a que el usuario escriba y pulse Enter. Devuelve lo escrito como <C>string</C></td></tr>
            </tbody>
          </table>
        </div>
        <Simulador titulo="Preguntar y saludar" codigo={CODIGO_LEER} programa={progLeer} pruebas={['Synji', 'Ana']} />
        <Ojo dice={<>Que <C>Console.Read()</C> «leerá el dato introducido por el usuario y devolverá un dato de tipo entero».</>} realidad={<>Devuelve el <strong>código</strong> del primer carácter tecleado, no el número. Si escribes 7, devuelve 55, el código del carácter «7». Para leer números se usa <C>ReadLine</C> más una conversión (lámina 08). <C>ReadKey()</C> lee una sola tecla sin esperar a Enter.</>} />
        <ParaElReto>
          <p>El reto pide «introducir los datos por consola y mostrar los resultados de forma clara». <C>Console.Write</C> para preguntar e interpolación <C>{'$"…{variable}…"'}</C> para responder: así es como se trabajó en clase.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="comentarios" titulo="Comentarios">
        <p>Un comentario es texto para personas: el compilador lo ignora. Sirve para explicar el porqué del código y es parte de la nota del reto («comentarios útiles»).</p>
        <Codigo codigo={`// Comentario de una línea
/* Comentario de
   varias líneas */
/// <summary>Comentario de documentación (lámina 11)</summary>`} />
        <p>Comenta el porqué, no lo obvio. <C>{'cuota = capital * i / (1 - Math.Pow(1 + i, -n)); // fórmula del préstamo francés'}</C> ayuda. <C>{'edad = 5; // pongo 5 en edad'}</C> no aporta nada. El temario dice «tantos comentarios como sea posible»; la práctica profesional dice «tantos como hagan falta».</p>
      </Bloque>

      <Bloque id="un-main" titulo="Un solo Main">
        <EnClase fecha="21/10">
          <p>Media clase se fue en un error: varios ejercicios en el mismo proyecto, cada uno con su <C>Main</C>. El compilador protesta: «el programa tiene más de un punto de entrada definido» (error CS0017). <strong>En un proyecto debe haber un único Main.</strong></p>
          <p>Soluciones: comentar los Main que no uses, renombrarlos (<C>Main8</C>, <C>Main9</C>…) y llamarlos desde el Main bueno, o usar un proyecto por ejercicio. Para el reto: un proyecto y un Main.</p>
        </EnClase>
        <EnClase fecha="28/10">
          <p>Llaves en los <C>if</C>: si se omiten, solo la primera instrucción queda dentro. Recomendación de la profesora: <strong>usa llaves siempre</strong>. Y <C>using System;</C> puede aparecer atenuado porque el SDK lo incluye de forma implícita.</p>
        </EnClase>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="entorno" preguntas={[
          { p: '¿Qué pieza compila y ejecuta tu código C#?', opciones: ['VS Code', 'C# Dev Kit', '.NET SDK', 'El navegador'], ok: 2, porque: 'VS Code es el editor y C# Dev Kit la extensión. Compila el SDK.' },
          { p: '¿Qué se ejecuta primero al arrancar el programa?', opciones: ['using System', 'La primera línea del archivo', 'El método Main', 'class Program'], ok: 2, porque: 'Main es el punto de entrada.' },
          { p: <>¿Qué diferencia hay entre <C>Write</C> y <C>WriteLine</C>?</>, opciones: ['Ninguna', 'WriteLine salta de línea al final', 'Write solo escribe números', 'WriteLine lee del teclado'], ok: 1, porque: 'Write deja el cursor en la misma línea.' },
          { p: <>¿De qué tipo es lo que devuelve <C>Console.ReadLine()</C>?</>, opciones: ['int', 'string', 'char', 'Depende de lo que escriba el usuario'], ok: 1, porque: 'Siempre es texto, aunque el usuario escriba cifras. Por eso hay que convertir.' },
          { p: 'Tienes dos ejercicios con su Main en el mismo proyecto. ¿Qué pasa?', opciones: ['Se ejecutan los dos', 'Se ejecuta el primero', 'No compila: hay más de un punto de entrada', 'Se ejecuta el último'], ok: 2, porque: 'Error CS0017. Un proyecto, un Main.' },
        ]} />
      </div>
    </>
  );
}
