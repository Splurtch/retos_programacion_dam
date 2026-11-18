import { useState } from 'react';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';

export const entradilla = (
  <p>Una variable es una caja con etiqueta en la memoria del ordenador. La etiqueta es el <strong>nombre</strong>, lo que cabe dentro lo decide el <strong>tipo</strong>, y el contenido, el <strong>valor</strong>, puede cambiar mientras el programa se ejecuta. Por eso se llama variable.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <>Empieza por un tipo (<C>int</C>, <C>double</C>, <C>string</C>…), sigue un nombre y termina en <C>;</C></>],
  ['Se confunde con', <>La <strong>constante</strong>: lleva <C>const</C> delante y su valor no cambia jamás (lámina 06).</>],
  ['Hábitat', <>Dentro de <C>Main</C>. En el Reto 1 guardan el precio, los meses, el interés y la cuota.</>],
  ['Ojo, el temario', <>Dice que <C>char</C> guarda «uno o varios caracteres». Solo guarda <strong>uno</strong>. Para texto se usa <C>string</C>.</>],
];

export const secciones = [
  { id: 'que-es', titulo: 'Declarar y asignar' },
  { id: 'tipos', titulo: 'Los tipos que vas a usar' },
  { id: 'cabe', titulo: '¿Cabe en la caja?' },
  { id: 'nombres', titulo: 'Nombres válidos' },
  { id: 'ambito', titulo: 'Dónde vive una variable' },
  { id: 'colecciones', titulo: 'enum y arrays' },
];

// ---------- Destacado: la sentencia partida en piezas ----------
const PIEZAS = [
  { t: 'int', k: 'a', n: 'Tipo', d: 'Qué cabe en la caja. int = números enteros, sin decimales.' },
  { t: 'edad', k: 'b', n: 'Nombre', d: 'La etiqueta para usarla después. Sin espacios y sin empezar por número.' },
  { t: '=', k: '', n: 'Asignación', d: 'No es «igual a»: significa «guarda lo de la derecha en la caja de la izquierda».' },
  { t: '25', k: 'c', n: 'Valor', d: 'Lo que hay dentro ahora mismo. Más adelante puede cambiar.' },
  { t: ';', k: 'n', n: 'Fin de sentencia', d: 'Cada instrucción de C# termina en punto y coma. Si falta, no compila.' },
] as const;

export function Destacado() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <Panel titulo="Toca cada pieza">
      <div className="tokens" role="group" aria-label="Piezas de la sentencia int edad = 25;">
        {PIEZAS.map((p, i) => (
          <button key={i} type="button" className="tok" data-k={p.k || undefined} aria-pressed={sel === i} onClick={() => setSel(sel === i ? null : i)}>{p.t}</button>
        ))}
      </div>
      <div className="marcas">
        {PIEZAS.filter((p) => p.k).map((p) => {
          const i = PIEZAS.indexOf(p);
          return (
            <div key={p.n} className="marca-campo" style={{ ['--k-solido' as string]: `var(--${p.k === 'a' ? 'azul' : p.k === 'b' ? 'lila' : p.k === 'c' ? 'cian' : 't7'}${p.k === 'n' ? '' : '-solido'})` }} data-apagada={sel !== null && sel !== i ? true : undefined}>
              <b>{p.n}</b>{p.d}
            </div>
          );
        })}
      </div>
      <div className="sim-mem" style={{ border: 0, padding: '20px 0 0', minHeight: 0 }} aria-live="polite">
        {sel === 2 ? <p className="resultado" style={{ margin: 0 }}>{PIEZAS[2].d}</p> : (
          <ul><li data-recien><span className="v-tipo">int</span><span className="v-nombre">edad · 4 bytes en memoria</span><span className="v-valor">25</span></li></ul>
        )}
      </div>
    </Panel>
  );
}

// ---------- Simulador: la variable cambia ----------
const CODIGO_EDAD = `int edad;              // declarar: reservo la caja
edad = 20;             // asignar: guardo un valor
Console.WriteLine(edad);
edad = 21;             // cumple años: el valor cambia
Console.WriteLine(edad);
double precio = 19.99; // declarar y asignar a la vez
string nombre = "Synji";
bool aprobado = true;`;

const progEdad: Programa = function* (t) {
  yield t.en(1, 'Se reserva una caja llamada edad que solo admite enteros. Aún no tiene valor útil.');
  t.def('edad', 'int', '(sin asignar)');
  yield t.en(2, 'Ahora sí: guardamos 20 dentro de edad.');
  t.def('edad', 'int', 20);
  yield t.en(3, 'WriteLine lee la caja y escribe su contenido en la consola.');
  t.writeLine('20');
  yield t.en(4, 'Asignar de nuevo sustituye el valor anterior. El 20 desaparece.');
  t.def('edad', 'int', 21);
  yield t.en(5, 'La misma instrucción de antes, pero la caja tiene otro valor.');
  t.writeLine('21');
  yield t.en(6, 'Declarar y asignar en una sola línea. double admite decimales (con punto en el código).');
  t.def('precio', 'double', 19.99);
  yield t.en(7, 'string guarda texto. El texto va siempre entre comillas dobles.');
  t.def('nombre', 'string', 'Synji');
  yield t.en(8, 'bool solo admite true o false, en minúscula.');
  t.def('aprobado', 'bool', true);
};

// ---------- ¿Cabe en la caja? ----------
type TipoCaja = 'int' | 'long' | 'double' | 'decimal' | 'char' | 'string' | 'bool';
function cabe(tipo: TipoCaja, lit: string): [boolean, string] {
  const s = lit.trim();
  if (!s) return [false, 'Escribe un valor para probar.'];
  const esCadena = /^".*"$/.test(s);
  const esChar = /^'.*'$/.test(s);
  const esEntero = /^-?\d+$/.test(s);
  const esReal = /^-?\d+\.\d+$/.test(s);
  const conComa = /^-?\d+,\d+$/.test(s);
  if (conComa) return [false, 'En el código C# los decimales se escriben con punto: 19.99. La coma separa cosas (por ejemplo, argumentos). Ojo: al teclear en la consola con el ordenador en español, es al revés (lámina 08).'];
  switch (tipo) {
    case 'int':
    case 'long': {
      if (esEntero) {
        const n = BigInt(s);
        const max = tipo === 'int' ? 2147483647n : 9223372036854775807n;
        return n > max || n < -max - 1n
          ? [false, `Demasiado grande para ${tipo}. El máximo es ${max.toLocaleString('es-ES')}.${tipo === 'int' ? ' Prueba con long.' : ''}`]
          : [true, `Cabe. Un ${tipo} guarda enteros entre ${(-max - 1n).toLocaleString('es-ES')} y ${max.toLocaleString('es-ES')}.`];
      }
      if (esReal) return [false, `Error de compilación: no se puede convertir implícitamente double en ${tipo}. Un entero no admite decimales; habría que convertir a mano (casting, lámina 08) y se perderían.`];
      break;
    }
    case 'double':
      if (esEntero || esReal) return [true, esEntero ? 'Cabe: un entero entra sin problema en un double (conversión implícita).' : 'Cabe. double es el tipo habitual para decimales: medias, porcentajes, medidas.'];
      break;
    case 'decimal':
      if (esEntero) return [true, 'Cabe: un entero entra sin problema en decimal.'];
      if (esReal) return [false, `Error: un literal con decimales es double por defecto. Para decimal hay que añadir la M: ${s}M`];
      if (/^-?\d+(\.\d+)?[mM]$/.test(s)) return [true, 'Cabe. decimal tiene más precisión que double y es el indicado para dinero. La M dice «este número es decimal».'];
      break;
    case 'char':
      if (esChar && [...s.slice(1, -1)].length === 1) return [true, 'Cabe: exactamente un carácter entre comillas simples.'];
      if (esChar && s.length === 2) return [false, "Un char no puede estar vacío: '' no es un carácter."];
      if (esChar) return [false, 'Demasiados caracteres en el literal de char. Un char guarda UNO; para más, usa string.'];
      if (esCadena) return [false, 'Las comillas dobles crean un string, no un char. Para char se usan comillas simples: \'A\'.'];
      break;
    case 'string':
      if (esCadena) return [true, s === '""' ? 'Cabe: es una cadena vacía, válida.' : 'Cabe. Cualquier texto entre comillas dobles es un string, aunque parezca un número: "25" es texto.'];
      if (esChar) return [false, 'Las comillas simples son de char. Un string va entre comillas dobles.'];
      if (esEntero || esReal) return [false, 'Error: no se puede convertir int/double en string así. Si quieres el texto "25", ponlo entre comillas.'];
      break;
    case 'bool':
      if (s === 'true' || s === 'false') return [true, 'Cabe. Un bool solo puede ser true o false.'];
      if (/^(true|false)$/i.test(s)) return [false, `C# distingue mayúsculas: ${s} no existe. Se escribe en minúscula: ${s.toLowerCase()}.`];
      if (s === '0' || s === '1') return [false, 'En C# un bool no es un número: 0 y 1 no valen. Solo true o false.'];
      break;
  }
  if (esCadena) return [false, `Error: un texto entre comillas no se puede guardar en ${tipo}. Para convertir "25" en número existe int.Parse (lámina 08).`];
  if (esChar) return [false, `Un char no se guarda así en ${tipo}.`];
  return [false, `C# no reconoce ${s} como un valor de tipo ${tipo}. Si es una palabra sin comillas, la toma como el nombre de una variable que no existe.`];
}

function CabeEnLaCaja() {
  const [tipo, setTipo] = useState<TipoCaja>('int');
  const [lit, setLit] = useState('19.99');
  const [ok, msg] = cabe(tipo, lit);
  return (
    <Panel titulo="¿Cabe este valor en la caja?" ancho>
      <div className="fila-controles">
        <SegmentedControl label="Tipo de la variable" value={tipo} onChange={(v) => setTipo(v as TipoCaja)}>
          {['int', 'long', 'double', 'decimal', 'char', 'string', 'bool'].map((t) => <SegmentedControlItem key={t} value={t} label={t} />)}
        </SegmentedControl>
      </div>
      <div className="fila-controles">
        <TextInput label="Valor que escribes en el código" value={lit} onChange={setLit} description={`Prueba: 25, 19.99, 19,99, 199.99M, 'A', "Hola", true, True, 3000000000`} />
      </div>
      <Codigo codigo={`${tipo} caja = ${lit || '…'};`} numeros={false} />
      <p className="resultado" data-ok={lit.trim() ? ok : undefined} aria-live="polite"><strong>{lit.trim() ? (ok ? 'Compila. ' : 'No compila. ') : ''}</strong>{msg}</p>
    </Panel>
  );
}

// ---------- Validador de nombres ----------
const RESERVADAS = new Set('abstract as base bool break byte case catch char checked class const continue decimal default delegate do double else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is lock long namespace new null object operator out override params private protected public readonly ref return sbyte sealed short sizeof stackalloc static string struct switch this throw true try typeof uint ulong unchecked unsafe ushort using virtual void volatile while'.split(' '));

function Nombres() {
  const [n, setN] = useState('mi numero');
  const reglas: [string, boolean][] = [
    ['Empieza por una letra o por _', /^[\p{L}_]/u.test(n)],
    ['Solo letras, dígitos y _ (nada de espacios, guiones ni símbolos)', /^[\p{L}\p{Nd}_]*$/u.test(n) && n.length > 0],
    ['No empieza por un dígito', !/^\d/.test(n)],
    ['No es una palabra reservada de C#', !RESERVADAS.has(n)],
  ];
  const valido = reglas.every(([, v]) => v);
  const camel = /^[a-zñ][a-zA-Zñ0-9]*$/.test(n);
  return (
    <Panel titulo="¿Es un nombre válido?">
      <TextInput label="Nombre de variable" value={n} onChange={setN} description="Prueba: mi numero, 2datos, string, _total, precioFinal, contraseña, Edad" />
      <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
        {reglas.map(([r, v]) => (
          <li key={r} style={{ display: 'flex', gap: 10, alignItems: 'baseline', color: v ? 'var(--t9)' : 'var(--rojo)' }}>
            <Icon icon={v ? 'check' : 'close'} size="sm" />
            <span><span className="vh">{v ? 'Cumple: ' : 'No cumple: '}</span>{r}</span>
          </li>
        ))}
      </ul>
      <p className="resultado" data-ok={valido} aria-live="polite">
        {valido
          ? <><strong>Válido.</strong> {camel ? 'Y además sigue la convención camelCase, la que se usa en clase.' : /^[A-Z]/.test(n) ? 'Compila, pero las variables locales se escriben en camelCase: empiezan en minúscula.' : n.includes('_') ? 'Compila. En C# las variables locales suelen ir en camelCase (precioFinal) en vez de con guiones bajos.' : ''}{/ñ/i.test(n) ? ' La ñ es legal en C#, aunque mucha gente la evita por costumbre.' : ''}</>
          : <><strong>No compila.</strong> El compilador marcaría error en ese nombre.</>}
      </p>
    </Panel>
  );
}

// ---------- Array ----------
function ArrayCajas() {
  const v = [1, 3, 5, 7, 9];
  const [i, setI] = useState(2);
  const fuera = i >= v.length;
  return (
    <Panel titulo="Un array son cajas numeradas desde 0">
      <Codigo codigo={`int[] v = { 1, 3, 5, 7, 9 };\nConsole.WriteLine(v[${i}]);`} numeros={false} />
      <div style={{ display: 'flex', gap: 8, margin: '18px 0', flexWrap: 'wrap' }} role="group" aria-label="Elige una posición">
        {[0, 1, 2, 3, 4, 5].map((k) => (
          <button key={k} type="button" className="opcion" aria-pressed={i === k} onClick={() => setI(k)} style={{ minWidth: 72, fontFamily: 'var(--f-codigo)' }}>
            v[{k}]{k < v.length && <><br /><span style={{ fontSize: 18 }}>{v[k]}</span></>}
          </button>
        ))}
      </div>
      <p className="resultado" data-ok={!fuera} aria-live="polite">
        {fuera
          ? <><strong>Se rompe:</strong> IndexOutOfRangeException. El array tiene 5 cajas (0 a 4); la posición 5 no existe.</>
          : <>v[{i}] vale <strong>{v[i]}</strong>. Es la caja número {i + 1}, porque se empieza a contar en 0.</>}
      </p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="que-es" titulo="Declarar y asignar">
        <p>Antes de usar una caja hay que crearla. Eso es <strong>declarar</strong>: decirle a C# el tipo y el nombre, por ejemplo <C>int edad;</C>. Después se puede <strong>asignar</strong> un valor con <C>=</C>: <C>edad = 20;</C>. Las dos cosas pueden hacerse a la vez: <C>int edad = 20;</C></p>
        <p>El símbolo <C>=</C> no significa «es igual» como en matemáticas. Se lee de derecha a izquierda: <em>«coge el 20 y guárdalo en edad»</em>. Para preguntar si dos cosas son iguales se usa <C>==</C>, que verás en la lámina 07.</p>
        <Simulador titulo="Una variable cambia de valor" codigo={CODIGO_EDAD} programa={progEdad} />
        <EnClase fecha="14/10">
          <p>La profesora mostró este mismo ejemplo: <C>edad = 20;</C> y luego <C>edad = 21;</C>. La misma línea <C>Console.WriteLine(edad)</C> imprime cosas distintas según el momento, y por eso se llama variable.</p>
        </EnClase>
      </Bloque>

      <Bloque id="tipos" titulo="Los tipos que vas a usar">
        <p>C# es un lenguaje de <T def="Cada variable tiene un tipo fijo desde que se declara y el compilador comprueba que nunca le metes otra cosa.">tipado estático</T>: el tipo de una caja se decide al declararla y no cambia nunca. Para el Reto 1 te bastan seis:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Guarda</th><th>Ejemplo</th><th>Úsalo para</th></tr></thead>
            <tbody>
              <tr><td><C>int</C></td><td>Enteros (±2.147 millones)</td><td><C>int meses = 12;</C></td><td>Edades, unidades, meses, contadores</td></tr>
              <tr><td><C>double</C></td><td>Números con decimales</td><td><C>double peso = 2.5;</C></td><td>Medias, porcentajes, medidas</td></tr>
              <tr><td><C>decimal</C></td><td>Decimales de alta precisión</td><td><C>decimal precio = 199.99M;</C></td><td>Dinero (necesita la M)</td></tr>
              <tr><td><C>string</C></td><td>Texto</td><td><C>string nombre = "Ana";</C></td><td>Nombres, emails, códigos postales</td></tr>
              <tr><td><C>char</C></td><td>Un solo carácter</td><td><C>char letra = 'a';</C></td><td>Una inicial, una opción de menú</td></tr>
              <tr><td><C>bool</C></td><td>true o false</td><td><C>bool esMayor = true;</C></td><td>Respuestas sí/no, resultados de comparar</td></tr>
            </tbody>
          </table>
        </div>
        <p>El temario lista también la familia completa de enteros. Cambian en el tamaño de la caja y en si admiten negativos:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Con signo</th><th>Sin signo (solo ≥ 0)</th><th>Tamaño</th></tr></thead>
            <tbody>
              <tr><td><C>sbyte</C></td><td><C>byte</C></td><td>8 bits</td></tr>
              <tr><td><C>short</C></td><td><C>ushort</C></td><td>16 bits</td></tr>
              <tr><td><C>int</C></td><td><C>uint</C></td><td>32 bits</td></tr>
              <tr><td><C>long</C></td><td><C>ulong</C></td><td>64 bits</td></tr>
            </tbody>
          </table>
        </div>
        <Ojo dice={<>«Char: uno o varios caracteres» y escribe el tipo sin signo de 16 bits como «unshort».</>} realidad={<><C>char</C> guarda exactamente un carácter, y el tipo correcto es <C>ushort</C>. Además, en C# los tipos se escriben en minúscula (<C>float</C>, no «Float»).</>} />
        <p>Un número entre comillas es texto, no un número: <C>"25"</C> es un <C>string</C>. Se imprime igual que <C>25</C>, pero no se puede sumar como número. Este matiz explica media lámina 08.</p>
      </Bloque>

      <Bloque id="cabe" titulo="¿Cabe en la caja?">
        <p>La mejor forma de entender los tipos es equivocarse a propósito. Elige un tipo, escribe un valor y mira qué diría el compilador. Prueba sobre todo los casos raros: la coma decimal, la M, las comillas simples y <C>True</C> con mayúscula.</p>
        <CabeEnLaCaja />
      </Bloque>

      <Bloque id="nombres" titulo="Nombres válidos">
        <p>El nombre de una variable es un <T def="Nombre que das a una variable, constante, método o clase.">identificador</T>. Tiene que cumplir estas reglas:</p>
        <ul>
          <li>Empieza por una letra o por guion bajo <C>_</C>, nunca por un dígito.</li>
          <li>Solo letras, dígitos y <C>_</C>. Nada de espacios.</li>
          <li>Distingue mayúsculas: <C>edad</C> y <C>Edad</C> son dos variables distintas.</li>
          <li>No puede ser una <T def="Palabra que C# ya usa para sí mismo: int, class, if, string, return…">palabra reservada</T> como <C>string</C> o <C>class</C>.</li>
        </ul>
        <p>Además de válido, que sea claro: <C>precioFinal</C> dice lo que guarda; <C>x2</C> no. La convención de C# para variables locales es <strong>camelCase</strong>: primera palabra en minúscula y las siguientes empezando en mayúscula.</p>
        <Nombres />
        <Ojo dice="«Debe estar formada por caracteres del alfabeto (no podemos usar ñ)»." realidad={<>C# admite letras Unicode, incluida la ñ. El ejercicio 12 de clase usa <C>string contraseña</C> y compila sin problema. Evitarla es una costumbre, no una regla del lenguaje.</>} />
      </Bloque>

      <Bloque id="ambito" titulo="Dónde vive una variable">
        <p>Una variable declarada dentro de <C>Main</C> es <strong>local</strong>: existe desde la línea en que se declara hasta la llave <C>{'}'}</C> que cierra su bloque. Fuera de ahí, C# no la conoce.</p>
        <Codigo codigo={`class Program
{
    static int contador = 0;   // fuera de los métodos: la ven todos los métodos de la clase

    static void Main(string[] args)
    {
        int edad = 30;         // local: solo existe dentro de Main
        contador++;
    }
}`} />
        <p>El temario llama «globales» a las declaradas fuera de los métodos. En C# no existen variables globales como tales: lo más parecido es un campo <C>static</C> de la clase, como <C>contador</C>. El aviso del temario es correcto: <strong>no es buena práctica</strong>. Declara las variables locales, justo donde las necesitas.</p>
      </Bloque>

      <Bloque id="colecciones" titulo="enum y arrays">
        <p>Dos estructuras que el temario presenta ya en esta unidad. Se profundiza en ellas más adelante, pero conviene reconocerlas:</p>
        <h3>enum: un conjunto cerrado con nombres</h3>
        <Codigo codigo={`enum Dias { Domingo, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado }

int x = (int)Dias.Domingo;   // 0
int y = (int)Dias.Viernes;   // 5`} />
        <p>Un <C>enum</C> se usa cuando el valor solo puede ser uno de una lista fija. Por dentro cada nombre es un número que empieza en 0.</p>
        <h3>Arrays: muchas cajas del mismo tipo bajo un nombre</h3>
        <p>Un array guarda varios valores del mismo tipo. Se accede a cada uno por su posición, su <strong>índice</strong>, empezando en 0. Si son filas y columnas, se usa un array de dos dimensiones: <C>{'int[,] m = new int[2, 3];'}</C></p>
        <ArrayCajas />
        <ParaElReto>
          <p>El Reto 1 no exige arrays. Céntrate en elegir bien entre <C>int</C>, <C>double</C> y <C>string</C>: en la rúbrica, «Sintaxis, variables y tipos» vale el 30 %.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="variables" preguntas={[
          { p: <>¿Qué tipo usarías para guardar el número de meses de un préstamo?</>, opciones: ['string', 'int', 'bool', 'char'], ok: 1, porque: <>Los meses son un número entero. <C>int</C> es lo natural.</> },
          { p: <>¿Cuál de estas líneas compila?</>, opciones: [<C>char letra = "A";</C>, <C>int total = 3.5;</C>, <C>decimal precio = 9.95M;</C>, <C>bool ok = True;</C>], ok: 2, porque: <>El literal decimal necesita la M. Las otras fallan por comillas dobles en un char, por decimales en un int y por <C>True</C> en mayúscula.</> },
          { p: <>¿Qué nombre de variable NO es válido?</>, opciones: ['_total', 'precioFinal', '2datos', 'contraseña'], ok: 2, porque: 'Un identificador no puede empezar por un dígito. La ñ sí es válida en C#.' },
          { p: <>Tras ejecutar <C>int a = 5; a = 8;</C> ¿cuánto vale a?</>, opciones: ['5', '8', '13', 'Da error: a ya existe'], ok: 1, porque: 'Asignar sustituye el valor anterior. Error sería volver a declarar con int a otra vez.' },
          { p: <>¿Qué es <C>"25"</C>?</>, opciones: ['Un int', 'Un double', 'Un string', 'Un char'], ok: 2, porque: 'Todo lo que va entre comillas dobles es texto, aunque contenga cifras.' },
        ]} />
      </div>
    </>
  );
}
