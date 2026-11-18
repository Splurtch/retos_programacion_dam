import { useMemo, useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse, intParse, tryParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Todo lo que el usuario escribe en la consola llega como <strong>texto</strong>, aunque sean cifras. Para hacer cuentas hay que convertirlo, y la conversión puede fallar. Esta lámina enseña a elegir la conversión correcta y a que el programa no se rompa cuando alguien escribe «hola» donde esperabas un número.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>(int)</C> delante de un valor, <C>int.Parse(…)</C>, <C>int.TryParse(…, out …)</C> y <C>Convert.ToX(…)</C>.</>],
  ['Se confunde con', 'Casting y Parse: casting convierte entre números; Parse convierte texto en número.'],
  ['Hábitat', 'Justo después de cada Console.ReadLine(). En el Reto 1, en cada dato que se pide.'],
  ['Regla de decisión', '¿Viene como texto? → Parse/TryParse. ¿Cabe sin perder nada? → implícita. ¿Puede perder datos? → casting.'],
];

export const secciones = [
  { id: 'por-que', titulo: 'Por qué hay que convertir' },
  { id: 'casting', titulo: 'Implícita y casting' },
  { id: 'parse', titulo: 'Texto a número: Parse' },
  { id: 'coma', titulo: 'La coma y el punto' },
  { id: 'tryparse', titulo: 'TryParse: sin romperse' },
  { id: 'convert', titulo: 'La clase Convert' },
  { id: 'mostrar', titulo: 'Número a texto: mostrar' },
];

// ---------- Destacado: árbol de decisión ----------
const CASOS = [
  { n: 'int edad → long', ruta: ['texto-no', 'cabe-si'], res: 'Implícita', cod: 'int edad = 30;\nlong grande = edad;          // cabe sin perder nada' },
  { n: 'double 1.85 → int', ruta: ['texto-no', 'cabe-no'], res: 'Casting explícito', cod: 'double altura = 1.85;\nint metros = (int)altura;    // 1: trunca, NO redondea' },
  { n: '"50" del teclado → int', ruta: ['texto-si', 'fiable-si'], res: 'int.Parse', cod: 'string texto = Console.ReadLine();\nint n = int.Parse(texto);    // si escriben "hola", se rompe' },
  { n: 'Dato del usuario → int', ruta: ['texto-si', 'fiable-no'], res: 'int.TryParse', cod: 'int n;\nwhile (!int.TryParse(Console.ReadLine(), out n))\n{\n    Console.Write("No es un número. Otra vez: ");\n}' },
];

export function Destacado() {
  const [k, setK] = useState(3);
  const c = CASOS[k];
  const on = (id: string) => c.ruta.includes(id);
  const nodo = (id: string, txt: string) => (
    <div style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid', borderColor: on(id) ? 'var(--lila-solido)' : 'var(--t4)', background: on(id) ? 'color-mix(in srgb, var(--lila-solido) 14%, transparent)' : 'transparent', color: on(id) ? 'var(--t10)' : 'var(--t7)', fontSize: 14, fontWeight: 600, transition: 'all 220ms var(--ease)' }}>{txt}</div>
  );
  return (
    <Panel titulo="¿Qué conversión necesito?">
      <div className="opciones" role="group" aria-label="Caso">
        {CASOS.map((x, i) => <button key={x.n} type="button" className="opcion" aria-pressed={k === i} onClick={() => setK(i)}>{x.n}</button>)}
      </div>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr', marginTop: 4 }} aria-hidden="true">
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontWeight: 700, color: 'var(--t10)' }}>¿El dato viene como texto?</div>
        {nodo('texto-no', 'No: ya es un número')}
        {nodo('texto-si', 'Sí: viene de ReadLine')}
        {nodo('cabe-si', '¿Cabe sin perder nada? Sí → implícita')}
        {nodo('fiable-si', '¿Seguro que es válido? Sí → Parse')}
        {nodo('cabe-no', '¿Cabe sin perder nada? No → casting')}
        {nodo('fiable-no', '¿Lo escribe una persona? → TryParse')}
      </div>
      <p style={{ margin: '16px 0 0' }} aria-live="polite">Respuesta: <span className="grande" style={{ fontSize: 18, color: 'var(--lila)' }}>{c.res}</span></p>
      <Codigo codigo={c.cod} numeros={false} />
    </Panel>
  );
}

// ---------- Casting: truncar frente a redondear ----------
function Truncar() {
  const [v, setV] = useState(1.85);
  return (
    <Panel titulo="(int) trunca, no redondea">
      <Slider label={`double valor = ${csDouble(v)}`} value={v} onChange={(x: number) => setV(x)} min={-3} max={3} step={0.05} valueDisplay="none" />
      <table className="tabla" style={{ marginTop: 14 }}>
        <tbody>
          <tr><td><C>(int)valor</C></td><td className="grande" style={{ fontSize: 17 }}>{Math.trunc(v)}</td><td style={{ fontSize: 14 }}>Corta los decimales (hacia el cero)</td></tr>
          <tr><td><C>(int)Math.Round(valor)</C></td><td className="grande" style={{ fontSize: 17 }}>{bankers(v)}</td><td style={{ fontSize: 14 }}>Redondea al entero más cercano (los ,5 van al par)</td></tr>
        </tbody>
      </table>
    </Panel>
  );
}
// Math.Round de .NET usa por defecto «redondeo del banquero»: 2,5 → 2 y 3,5 → 4.
function bankers(x: number) {
  const r = Math.round(x * 100) / 100;
  const f = Math.floor(r);
  const d = r - f;
  if (Math.abs(d - 0.5) < 1e-9) return f % 2 === 0 ? f : f + 1;
  return Math.round(r);
}

// ---------- Simuladores ----------
const CODIGO_EDAD = `Console.Write("Edad: ");
string texto = Console.ReadLine();
int edad = int.Parse(texto);
Console.WriteLine($"El año que viene tendrás {edad + 1}");`;
const progEdad: Programa = function* (t) {
  yield t.en(1);
  t.write('Edad: ');
  const s = yield t.leer(2, 'Escribe una edad… o escribe «hola» para ver qué pasa.');
  t.def('texto', 'string', s ?? '');
  yield t.en(3, 'int.Parse intenta convertir el texto en entero. Si no puede, lanza una FormatException y el programa se para.');
  const edad = intParse(s);
  t.def('edad', 'int', edad);
  yield t.en(4, 'Ahora sí es un número: se puede sumar.');
  t.writeLine(`El año que viene tendrás ${edad + 1}`);
};

const CODIGO_PESO = `Console.Write("Peso del paquete (kg): ");
double peso = double.Parse(Console.ReadLine());
Console.WriteLine($"Has escrito {peso} kg");`;
const progPeso = (cultura: 'es' | 'en'): Programa => function* (t) {
  yield t.en(1);
  t.write('Peso del paquete (kg): ');
  const s = yield t.leer(2, cultura === 'es' ? 'Ordenador en español. Prueba con 2,5 y luego con 2.5.' : 'Ordenador en inglés, como el de clase. Prueba con 1,45 y luego con 1.45.');
  const p = doubleParse(s ?? null, cultura);
  t.def('peso', 'double', p);
  const raro = cultura === 'es' ? s?.includes('.') && !s.includes(',') : s?.includes(',') && !s.includes('.');
  yield t.en(3, raro ? `¡${csDouble(p)}! El separador que has usado es el de miles en este idioma, así que lo ha ignorado. Ningún error: un fallo silencioso.` : undefined);
  t.writeLine(`Has escrito ${cultura === 'es' ? csDouble(p) : String(p)} kg`);
};

function PesoCultura() {
  const [c, setC] = useState<'es' | 'en'>('es');
  const prog = useMemo(() => progPeso(c), [c]);
  return (
    <>
      <div className="opciones" role="group" aria-label="Idioma del ordenador">
        <button type="button" className="opcion" aria-pressed={c === 'es'} onClick={() => setC('es')}>Ordenador en español</button>
        <button type="button" className="opcion" aria-pressed={c === 'en'} onClick={() => setC('en')}>Ordenador en inglés (como el de clase)</button>
      </div>
      <Simulador key={c} titulo={`double.Parse · configuración ${c === 'es' ? 'española' : 'inglesa'}`} codigo={CODIGO_PESO} programa={prog} pruebas={c === 'es' ? ['2,5', '2.5', '1.000,75'] : ['1.45', '1,45']} />
    </>
  );
}

const CODIGO_TRY = `int edad;
Console.Write("Edad: ");
while (!int.TryParse(Console.ReadLine(), out edad))
{
    Console.Write("Dato no válido. Edad: ");
}
Console.WriteLine($"Edad correcta: {edad}");`;
const progTry: Programa = function* (t) {
  yield t.en(1);
  t.def('edad', 'int', 0);
  yield t.en(2);
  t.write('Edad: ');
  for (;;) {
    const s = yield t.leer(3, 'TryParse intenta convertir. Devuelve true o false y, si puede, deja el número en edad (out). El ! invierte: «mientras NO se pueda…».');
    const [ok, v] = tryParse(intParse, s);
    t.def('edad', 'int', v);
    if (ok) break;
    yield t.en(5, 'No se pudo convertir: TryParse devolvió false, así que !false = true y se repite. El programa NO se rompe.');
    t.write('Dato no válido. Edad: ');
  }
  yield t.en(7, 'TryParse devolvió true: salimos del bucle con un número válido.');
  t.writeLine(`Edad correcta: ${t.vars.get('edad')?.valor}`);
};

export default function Cuerpo() {
  return (
    <>
      <Bloque id="por-que" titulo="Por qué hay que convertir">
        <p>En C# cada variable tiene un tipo fijo, y el compilador no adivina cómo transformar una cosa en otra:</p>
        <Codigo codigo={`int numero = 10;
numero = "a";   // error CS0029: no se puede convertir implícitamente el tipo 'string' en 'int'`} />
        <p>A veces sí necesitas pasar un valor de un tipo a otro: el texto <C>"50"</C> que llega del teclado, un precio <C>double</C> que quieres sin decimales… Eso es una <T def="Pasar un valor de un tipo de dato a otro.">conversión de tipo</T>, y hay cuatro herramientas según el caso. El árbol de la lámina resume cuándo usar cada una.</p>
      </Bloque>

      <Bloque id="casting" titulo="Implícita y casting">
        <p><strong>Implícita</strong>: C# la hace sola cuando el valor cabe en el destino sin truncarse ni redondearse. Un <C>long</C> (64 bits) puede guardar cualquier <C>int</C> (32 bits):</p>
        <Codigo codigo={`int a = 300;\nlong numero = a;      // implícita: no se pierde nada\ndouble d = a;         // también: 300 cabe en un double`} />
        <p><strong>Explícita o casting</strong>: cuando puede perderse información, C# te obliga a decir que lo haces a propósito, poniendo el tipo destino entre paréntesis:</p>
        <Codigo codigo={`double num = 100.85;\nint b = (int)num;\nConsole.WriteLine(b);   // 100`} />
        <Truncar />
      </Bloque>

      <Bloque id="parse" titulo="Texto a número: Parse">
        <p>Casting convierte entre números. Cuando el dato es <strong>texto</strong>, como lo que devuelve <C>ReadLine</C>, se usa <C>Parse</C>. Escribe una edad válida y después escribe «hola»:</p>
        <Simulador titulo="int.Parse con un dato del usuario" codigo={CODIGO_EDAD} programa={progEdad} pruebas={['30', 'hola', '3,5', '']} />
        <p>Con «hola» el programa se rompe con una <strong>excepción</strong>, un error en tiempo de ejecución. En clase se escribía todo en una línea: <C>int edad = int.Parse(Console.ReadLine());</C>. Funciona igual, pero sigue rompiéndose si el texto no es un número.</p>
        <EnClase fecha="21/10">
          <p>«ReadLine devuelve texto; si queremos operar, convertimos». Fue el patrón de la sesión 3: preguntar con <C>Write</C>, leer con <C>ReadLine</C> y convertir con <C>int.Parse</C> antes del <C>if</C>.</p>
        </EnClase>
      </Bloque>

      <Bloque id="coma" titulo="La coma y el punto">
        <p>Una trampa que se vio en directo en clase. <strong>En el código</strong> los decimales se escriben con punto (<C>19.99</C>). Pero <C>double.Parse</C> lee lo que escribe el usuario <strong>según el idioma del ordenador</strong>, y en español el separador decimal es la coma.</p>
        <PesoCultura />
        <EnClase fecha="21/10">
          <p>En el ejercicio de la tarifa de envío, la profesora escribió <C>1,45</C> kg y el programa respondió «tu tarifa es de 12 €» en vez de 4 €. Su ordenador está en inglés, la coma se tomó como separador de miles y leyó 145 kg. Con <C>1.45</C> funcionó. En tu ordenador, si está en español, pasará justo al revés.</p>
          <p>Por eso conviene indicarlo en la pregunta: <C>{'Console.Write("Peso (usa coma para decimales): ");'}</C></p>
        </EnClase>
      </Bloque>

      <Bloque id="tryparse" titulo="TryParse: sin romperse">
        <p><C>TryParse</C> intenta convertir y <strong>nunca lanza excepción</strong>. Devuelve un <C>bool</C>: <C>true</C> si lo consiguió y <C>false</C> si no. El número convertido lo deja en la variable que pasas con <C>out</C>. Combinado con un <C>while</C>, insiste hasta que el dato sea válido:</p>
        <Simulador titulo="Ejercicio 11 de clase · pedir hasta que sea válido" codigo={CODIGO_TRY} programa={progTry} pruebas={['hola', '', '25']} />
        <p><C>out</C> significa «este parámetro es de salida: el método escribirá aquí el resultado». Si la conversión falla, la variable queda en 0.</p>
        <Ojo dice={<><C>{'while (Int32.TryParse("50", out int miNumero)) Console.WriteLine(miNumero);'}</C> «La salida por pantalla será 50».</>} realidad={<>Es un <strong>bucle infinito</strong>: <C>"50"</C> siempre se convierte bien, la condición siempre es true y escribe 50 sin parar. Debería ser un <C>if</C>. (El mismo ejemplo trae además la errata <C>iint numValido</C> por <C>int</C>.)</>} />
        <ParaElReto>
          <p>El reto exige «controlar posibles errores en la introducción de datos, evitando que el programa finalice inesperadamente». Este patrón, <C>while (!TryParse … || condición)</C>, es exactamente eso. Es el que se usó en el ejercicio 15 (IVA), el ensayo general del reto.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="convert" titulo="La clase Convert">
        <p><C>Convert</C> agrupa métodos para pasar entre muchos tipos:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Método</th><th>Convierte a</th></tr></thead>
            <tbody>
              <tr><td><C>Convert.ToInt32(x)</C></td><td>int (32 bits). También <C>ToInt16</C> y <C>ToInt64</C></td></tr>
              <tr><td><C>Convert.ToDouble(x)</C></td><td>double</td></tr>
              <tr><td><C>Convert.ToDecimal(x)</C></td><td>decimal</td></tr>
              <tr><td><C>Convert.ToBoolean(x)</C></td><td>bool</td></tr>
              <tr><td><C>Convert.ToChar(x)</C></td><td>char</td></tr>
              <tr><td><C>Convert.ToString(x)</C></td><td>string</td></tr>
            </tbody>
          </table>
        </div>
        <p>Una diferencia sutil: <C>Convert.ToInt32(2.7)</C> <strong>redondea</strong> (da 3), mientras que <C>(int)2.7</C> trunca (da 2). Y con texto no válido, <C>Convert.ToInt32("hola")</C> también lanza excepción, igual que Parse.</p>
        <Ojo dice="Tolnt16, Tolnt32, Tolnt64." realidad={<>Errata de maquetación: es <C>ToInt16</C>, <C>ToInt32</C> y <C>ToInt64</C>, con I mayúscula de Int. Si lo copias del PDF, no compila.</>} />
      </Bloque>

      <Bloque id="mostrar" titulo="Número a texto: mostrar">
        <p>Para mostrar resultados tienes tres formas. La interpolación es la más clara y la que se usa en clase:</p>
        <Codigo codigo={`double total = 1234.5;
Console.WriteLine("Total: " + total + " €");     // concatenar con +
Console.WriteLine($"Total: {total} €");          // interpolar con $ y {}
Console.WriteLine($"Total: {total:F2} €");       // F2: siempre 2 decimales → 1234,50
string texto = total.ToString();                 // a string explícitamente`} />
        <p>Sin el <C>$</C> delante de las comillas, las llaves se imprimen tal cual: <C>{'"{total}"'}</C> muestra literalmente <em>{'{total}'}</em>. El formato <C>F2</C> redondea a dos decimales al mostrar, pero no cambia el valor guardado.</p>
        <EnClase fecha="28/10">
          <p>En el ejercicio 9 (ahorro mensual) se usó <C>{'{saldo:F2}'}</C> para que el dinero saliera con dos decimales. La coma o el punto al mostrar depende de la configuración regional del ordenador.</p>
        </EnClase>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="conversiones" preguntas={[
          { p: <>¿Qué vale <C>(int)9.99</C>?</>, opciones: ['10', '9', '9,99', 'Error'], ok: 1, porque: 'El casting a int trunca: corta los decimales.' },
          { p: 'El usuario puede escribir cualquier cosa. ¿Qué usas para convertir su edad?', opciones: ['(int)', 'int.Parse', 'int.TryParse', 'Convert.ToString'], ok: 2, porque: 'TryParse nunca se rompe y te dice si lo consiguió.' },
          { p: <>Con el ordenador en español, el usuario escribe <C>2.5</C> y haces <C>double.Parse</C>. ¿Qué obtienes?</>, opciones: ['2,5', '25', 'Una excepción', '2'], ok: 1, porque: 'En es-ES el punto es separador de miles. Hay que escribir 2,5.' },
          { p: <>¿Qué devuelve <C>int.TryParse("abc", out n)</C>?</>, opciones: ['Una excepción', 'false, y n queda en 0', 'true', '"abc"'], ok: 1, porque: 'Devuelve el éxito como bool y deja el resultado en n.' },
          { p: <>¿Qué hace la conversión <C>long l = miInt;</C>?</>, opciones: ['Error de compilación', 'Necesita (long)', 'Es implícita: cabe sin pérdida', 'Trunca'], ok: 2, porque: 'Todo int cabe en un long.' },
        ]} />
      </div>
    </>
  );
}
