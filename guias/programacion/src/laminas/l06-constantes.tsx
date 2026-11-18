import { useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';

export const entradilla = (
  <p>Algunos valores no deben cambiar nunca mientras el programa se ejecuta: el 21 % de IVA general, los 7 días de la semana, el precio fijo de una bicicleta. Para eso están las <strong>constantes</strong>. Y cada valor que escribes tal cual en el código, como <C>21</C>, <C>0.21</C> o <C>"Hola"</C>, es un <strong>literal</strong>, con una forma exacta para cada tipo.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>const</C> delante del tipo, nombre en MAYÚSCULAS con guion bajo y valor obligatorio: <C>const double IVA_GENERAL = 0.21;</C></>],
  ['Se confunde con', 'La variable. Si intentas asignar otra vez una constante, no compila.'],
  ['Hábitat', 'Al principio del programa o de la clase, a la vista. En el Reto 1: los tipos de IVA y los valores fijos.'],
  ['Ventaja', 'Si el IVA cambia, se cambia en un solo sitio.'],
];

export const secciones = [
  { id: 'const', titulo: 'Constantes' },
  { id: 'literales', titulo: 'Literales y sus sufijos' },
  { id: 'escape', titulo: 'Secuencias de escape' },
];

// ---------- Destacado: el IVA en un sitio o en quince ----------
export function Destacado() {
  const [iva, setIva] = useState(21);
  const [conConst, setConConst] = useState(true);
  const precios = [10, 24.5, 99.99];
  const lineas = conConst
    ? [`const double IVA_GENERAL = ${(iva / 100).toFixed(2)};`, ...precios.map((p, i) => `double total${i + 1} = ${p} * (1 + IVA_GENERAL);`)]
    : precios.map((p, i) => `double total${i + 1} = ${p} * (1 + ${(iva / 100).toFixed(2)});`);
  return (
    <Panel titulo="Cambia el IVA">
      <div className="opciones" role="group" aria-label="Forma de escribirlo">
        <button type="button" className="opcion" aria-pressed={conConst} onClick={() => setConConst(true)}>Con constante</button>
        <button type="button" className="opcion" aria-pressed={!conConst} onClick={() => setConConst(false)}>Con el número repetido</button>
      </div>
      <div className="opciones" role="group" aria-label="Nuevo porcentaje de IVA">
        {[21, 10, 4].map((v) => <button key={v} type="button" className="opcion" aria-pressed={iva === v} onClick={() => setIva(v)}>IVA {v} %</button>)}
      </div>
      <Codigo codigo={lineas.join('\n')} marcas={conConst ? { 1: 'ok' } : { 1: 'error', 2: 'error', 3: 'error' }} />
      <p className="resultado" data-ok={conConst} aria-live="polite">
        {conConst
          ? <><strong>1 línea cambiada.</strong> Los cálculos usan el nombre IVA_GENERAL, así que todos se actualizan solos.</>
          : <><strong>{precios.length} líneas que cambiar a mano</strong>, y en un programa real pueden ser quince. Basta olvidar una para tener un error lógico silencioso.</>}
      </p>
    </Panel>
  );
}

// ---------- Detector de literales ----------
function tipoLiteral(s: string): [string, string] | null {
  const t = s.trim();
  if (!t) return null;
  if (/^(true|false)$/.test(t)) return ['bool', 'Literal lógico.'];
  if (/^'(\\.|[^\\'])'$/.test(t)) return ['char', 'Un carácter entre comillas simples.'];
  if (/^\$?".*"$/.test(t)) return ['string', t.startsWith('$') ? 'Cadena interpolada: lo que va entre llaves se sustituye por su valor.' : 'Texto entre comillas dobles.'];
  if (/^-?0[xX][0-9a-fA-F]+$/.test(t)) return ['int', `Entero en hexadecimal (prefijo 0x). Vale ${parseInt(t, 16)} en decimal.`];
  if (/^-?\d+$/.test(t)) return ['int', 'Entero decimal sin sufijo: C# lo trata como int.'];
  if (/^-?\d+[lL]$/.test(t)) return ['long', 'El sufijo L lo convierte en long.'];
  if (/^-?\d+(\.\d+)?[fF]$/.test(t)) return ['float', 'El sufijo F lo convierte en float.'];
  if (/^-?\d+(\.\d+)?[mM]$/.test(t)) return ['decimal', 'El sufijo M lo convierte en decimal: el de los importes de dinero.'];
  if (/^-?\d+(\.\d+)?[dD]$/.test(t)) return ['double', 'El sufijo D lo deja como double, igual que sin sufijo.'];
  if (/^-?\d+\.\d+$/.test(t)) return ['double', 'Con punto decimal y sin sufijo: double por defecto.'];
  if (/^-?\d+,\d+$/.test(t)) return ['error', 'En el código la coma no es decimal. Escribe 3.4.'];
  return ['error', 'No es un literal. Sin comillas, C# lo leería como el nombre de una variable.'];
}

function Literales() {
  const [s, setS] = useState('4.5F');
  const r = tipoLiteral(s);
  return (
    <Panel titulo="¿De qué tipo es este literal?">
      <TextInput label="Escribe un literal" value={s} onChange={setS} description="Prueba: 10, 0x3F, 3.4, 3.4d, 4.5F, 3.2m, 'a', &quot;Hola&quot;, true, 3,4" />
      <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', marginTop: 16, flexWrap: 'wrap' }} aria-live="polite">
        <span className="grande" style={{ color: r?.[0] === 'error' ? 'var(--rojo)' : 'var(--lila)' }}>{r ? (r[0] === 'error' ? 'no válido' : r[0]) : '—'}</span>
        <span style={{ color: 'var(--t9)' }}>{r?.[1]}</span>
      </div>
    </Panel>
  );
}

// ---------- Escapes ----------
const ESCAPES: [string, string, string][] = [
  ['\\n', 'Nueva línea', 'Línea 1\\nLínea 2'],
  ['\\t', 'Tabulación', 'Producto\\tPrecio'],
  ['\\"', 'Comilla doble', 'Dijo \\"hola\\"'],
  ["\\'", 'Comilla simple', "Rock\\'n\\'roll"],
  ['\\\\', 'Barra invertida', 'C:\\\\Proyectos\\\\Reto1'],
];
const interpretar = (s: string) => s.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, '\\');

function Escapes() {
  const [k, setK] = useState(0);
  const lit = ESCAPES[k][2];
  return (
    <Panel titulo="Qué imprime cada secuencia de escape">
      <div className="opciones" role="group" aria-label="Secuencia">
        {ESCAPES.map(([e, n], i) => <button key={e} type="button" className="opcion" aria-pressed={k === i} onClick={() => setK(i)}><span style={{ fontFamily: 'var(--f-codigo)' }}>{e}</span> {n}</button>)}
      </div>
      <Codigo codigo={`Console.WriteLine("${lit}");`} numeros={false} />
      <div className="consola" style={{ minHeight: 0 }} aria-label="Salida"><div className="c-linea" style={{ tabSize: 12 }}>{interpretar(lit)}</div></div>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="const" titulo="Constantes">
        <p>Una <strong>constante</strong> es un espacio de memoria cuyo contenido no puede cambiar mientras el programa se ejecuta. Su valor queda decidido al compilar.</p>
        <Codigo codigo={`const double IVA_GENERAL = 0.21;
const double IVA_REDUCIDO = 0.10;
const double IVA_SUPERREDUCIDO = 0.04;

IVA_GENERAL = 0.25;   // error CS0131: el lado izquierdo de una asignación debe ser una variable`} />
        <ul>
          <li>Lleva <C>const</C> delante del tipo.</li>
          <li>Se le da valor <strong>en la misma línea</strong>. Es obligatorio.</li>
          <li>Convención de clase: nombre en <strong>MAYÚSCULAS</strong>, con guion bajo si tiene varias palabras.</li>
          <li>Se declaran al principio, a la vista, para encontrarlas y reutilizarlas.</li>
        </ul>
        <Ojo dice={<>La sintaxis es <C>{'const <tipo> <nombre>;'}</C>, con el ejemplo <C>const int num;</C></>} realidad={<>Eso no compila (error CS0145: un campo constante requiere que se proporcione un valor). Una constante siempre se escribe con su valor: <C>const int NUM = 5;</C></>} />
        <Ojo dice="Las constantes «se definen fuera del cuerpo de cualquier función»." realidad={<>Pueden ir en la clase, fuera de los métodos (<C>public const int DIAS_SEMANA = 7;</C>), o dentro de Main como constantes locales, que es lo que se hizo en clase y en el ejercicio 15. Las dos formas son correctas.</>} />
        <EnClase fecha="28/10">
          <p>En el ejercicio de la bicicleta (900 €) la profesora pidió guardar el precio como <C>const double PRECIO = 900;</C>. El error típico que comentó fue intentar ir restando las cuotas a la constante: para eso hace falta una variable aparte, <C>saldoPendiente</C>.</p>
        </EnClase>
        <ParaElReto>
          <p>El enunciado pide literalmente «constantes para los tipos de IVA». Declara <C>IVA_GENERAL</C>, <C>IVA_REDUCIDO</C> e <C>IVA_SUPERREDUCIDO</C> al principio de Main y no vuelvas a escribir 0.21 en ningún otro sitio.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="literales" titulo="Literales y sus sufijos">
        <p>Un <strong>literal</strong> es un valor escrito directamente en el código: no se calcula ni se lee de ningún sitio. Su forma decide su tipo:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Literal</th><th>Tipo</th><th>Regla</th></tr></thead>
            <tbody>
              <tr><td><C>10</C></td><td>int</td><td>Entero decimal, sin prefijo</td></tr>
              <tr><td><C>0x3F</C></td><td>int</td><td>Prefijo 0x: hexadecimal (63)</td></tr>
              <tr><td><C>3.4</C> · <C>3.4d</C></td><td>double</td><td>Con decimales: double por defecto o con D</td></tr>
              <tr><td><C>4.5F</C></td><td>float</td><td>Sufijo F</td></tr>
              <tr><td><C>3.2m</C></td><td>decimal</td><td>Sufijo M (dinero)</td></tr>
              <tr><td><C>true</C> · <C>false</C></td><td>bool</td><td>En minúscula</td></tr>
              <tr><td><C>'a'</C></td><td>char</td><td>Un carácter entre comillas simples</td></tr>
              <tr><td><C>"Hola"</C></td><td>string</td><td>Comillas dobles</td></tr>
            </tbody>
          </table>
        </div>
        <Literales />
      </Bloque>

      <Bloque id="escape" titulo="Secuencias de escape">
        <p>¿Cómo metes unas comillas dentro de un texto que ya va entre comillas? Con una <strong>barra invertida</strong> delante: le dice a C# que el siguiente carácter es especial.</p>
        <Escapes />
        <p>El temario también lista <C>\0</C> (carácter nulo), <C>\b</C> (retroceso), <C>\f</C> (salto de página), <C>\r</C> (retorno de carro) y <C>\v</C> (tabulación vertical). En consola casi nunca los usarás, pero conviene reconocerlos. Truco: <C>{'@"C:\\Proyectos"'}</C>, con <C>@</C> delante, no interpreta las barras. Es muy útil para rutas de archivos.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="constantes" preguntas={[
          { p: '¿Cuál compila?', opciones: [<C key="a">const int DIAS;</C>, <C key="b">const double IVA = 0.21;</C>, <C key="c">constant int X = 3;</C>, <C key="d">const IVA = 0.21;</C>], ok: 1, porque: 'Una constante necesita const, el tipo, el nombre y el valor en la misma línea.' },
          { p: <>¿De qué tipo es el literal <C>199.99M</C>?</>, opciones: ['double', 'float', 'decimal', 'string'], ok: 2, porque: 'El sufijo M marca decimal.' },
          { p: <>¿Qué imprime <C>{'Console.WriteLine("A\\nB");'}</C>?</>, opciones: ['A\\nB', 'A y B en la misma línea', 'A en una línea y B en la siguiente', 'Error'], ok: 2, porque: '\\n es un salto de línea.' },
          { p: '¿Por qué usar una constante para el IVA en el reto?', opciones: ['Ocupa menos memoria', 'Si cambia, se modifica en un solo sitio y nadie puede alterarla por error', 'Es obligatorio en C#', 'Hace el programa más rápido'], ok: 1, porque: 'Mantenibilidad y seguridad. Además, el enunciado lo pide.' },
        ]} />
      </div>
    </>
  );
}
