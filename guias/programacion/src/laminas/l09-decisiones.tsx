import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Switch } from '@astryxdesign/core/Switch';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse, intParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Hasta ahora los programas iban en línea recta. Con <C>if</C> el programa <strong>decide</strong>: si se cumple una condición, hace una cosa; si no, otra. Es el núcleo del Reto 1 (control de flujo, 40 % de la nota) y la forma de aplicar un IVA u otro según lo que elija el usuario.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>{'if (condición) { … }'}</C>, opcionalmente <C>else if (…)</C> y un <C>else</C> final. Para menús: <C>switch</C> con <C>case</C>, <C>break</C> y <C>default</C>.</>],
  ['Se confunde con', 'Varios if sueltos. Con else if solo se ejecuta UNA rama; con if sueltos pueden ejecutarse varias.'],
  ['Hábitat', 'Validar datos, clasificar por rangos y elegir opciones de un menú. En el reto: el tipo de IVA.'],
  ['Regla de clase', 'Llaves siempre, aunque solo haya una instrucción dentro.'],
];

export const secciones = [
  { id: 'if', titulo: 'if' },
  { id: 'if-else', titulo: 'if-else' },
  { id: 'else-if', titulo: 'else if y rangos' },
  { id: 'switch', titulo: 'switch' },
  { id: 'llaves', titulo: 'Las llaves' },
  { id: 'practica', titulo: 'Práctica de clase' },
];

// ---------- Destacado: nota → rama ----------
const CON_ELSE = `if (nota >= 9)
    Console.WriteLine("Sobresaliente");
else if (nota >= 7)
    Console.WriteLine("Notable");
else if (nota >= 5)
    Console.WriteLine("Aprobado");
else
    Console.WriteLine("Suspenso");`;
const SIN_ELSE = `if (nota >= 9)
    Console.WriteLine("Sobresaliente");
if (nota >= 7)
    Console.WriteLine("Notable");
if (nota >= 5)
    Console.WriteLine("Aprobado");
if (nota < 5)
    Console.WriteLine("Suspenso");`;

export function Destacado() {
  const [nota, setNota] = useState(8);
  const [encadenado, setEncadenado] = useState(true);
  const conds = [nota >= 9, nota >= 7, nota >= 5, nota < 5];
  const textos = ['Sobresaliente', 'Notable', 'Aprobado', 'Suspenso'];
  let salida: string[];
  const marcas: Record<number, 'ok' | 'error'> = {};
  if (encadenado) {
    const k = conds.findIndex((c, i) => (i < 3 ? c : true));
    salida = [textos[k]];
    marcas[k * 2 + 2] = 'ok';
  } else {
    salida = textos.filter((_, i) => conds[i]);
    conds.forEach((c, i) => { if (c) marcas[i * 2 + 2] = salida.length > 1 ? 'error' : 'ok'; });
  }
  return (
    <Panel titulo="¿Qué rama se ejecuta?">
      <Slider label={`nota = ${nota}`} value={nota} onChange={(v: number) => setNota(v)} min={0} max={10} step={0.5} valueDisplay="none" />
      <div style={{ margin: '14px 0 4px' }}>
        <Switch label={encadenado ? 'Con else if (una sola rama)' : 'Con if sueltos'} value={encadenado} onChange={setEncadenado} />
      </div>
      <Codigo codigo={encadenado ? CON_ELSE : SIN_ELSE} marcas={marcas} />
      <div className="consola" style={{ minHeight: 0 }} aria-label="Salida" aria-live="polite">{salida.map((s) => <div key={s} className="c-linea">{s}</div>)}</div>
      {!encadenado && salida.length > 1 && <p className="resultado" data-ok="false" style={{ marginTop: 12 }}><strong>{salida.length} mensajes para una sola nota.</strong> Un {csDouble(nota)} cumple varias condiciones a la vez. Con else if se para en la primera que se cumple.</p>}
    </Panel>
  );
}

// ---------- Simuladores ----------
const CODIGO_SALDO = `double saldo = 30;
Console.Write("Importe de la compra: ");
double compra = double.Parse(Console.ReadLine());
if (saldo >= compra)
{
    Console.WriteLine("Compra autorizada");
}
else
{
    Console.WriteLine("Saldo insuficiente");
}`;
const progSaldo: Programa = function* (t) {
  yield t.en(1);
  t.def('saldo', 'double', 30);
  yield t.en(2);
  t.write('Importe de la compra: ');
  const s = yield t.leer(3);
  const compra = doubleParse(s);
  t.def('compra', 'double', compra);
  const ok = 30 >= compra;
  yield t.en(4, `¿saldo >= compra? 30 >= ${csDouble(compra)} → ${ok}. Con if-else SIEMPRE se ejecuta exactamente uno de los dos bloques.`);
  if (ok) { yield t.en(6); t.writeLine('Compra autorizada'); }
  else { yield t.en(10, 'La condición fue false: salta directamente al bloque else.'); t.writeLine('Saldo insuficiente'); }
};

const CODIGO_TARIFA = `Console.Write("Peso del paquete: ");
double peso = double.Parse(Console.ReadLine());
double tarifa;
if (peso <= 2)
{
    tarifa = 4;
}
else if (peso <= 5)
{
    tarifa = 7;
}
else
{
    tarifa = 12;
}
Console.WriteLine($"Tu tarifa es de {tarifa} €");`;
const progTarifa: Programa = function* (t) {
  yield t.en(1);
  t.write('Peso del paquete: ');
  const s = yield t.leer(2, 'Escribe un peso con coma decimal: 1,45 · 3 · 6,45');
  const peso = doubleParse(s);
  t.def('peso', 'double', peso);
  yield t.en(3, 'La variable tarifa se crea UNA vez fuera de los if y cada rama solo la actualiza.');
  t.def('tarifa', 'double', '(sin asignar)');
  yield t.en(4, `¿peso <= 2? ${csDouble(peso)} <= 2 → ${peso <= 2}`);
  let tarifa: number;
  if (peso <= 2) { yield t.en(6); tarifa = 4; }
  else {
    yield t.en(8, `No era <= 2, así que ya sabemos que es mayor que 2. ¿peso <= 5? → ${peso <= 5}`);
    if (peso <= 5) { yield t.en(10); tarifa = 7; }
    else { yield t.en(14, 'Ninguna anterior se cumplió: el else final cubre «más de 5».'); tarifa = 12; }
  }
  t.def('tarifa', 'double', tarifa);
  yield t.en(16);
  t.writeLine(`Tu tarifa es de ${tarifa} €`);
};

const CODIGO_MENU = `Console.WriteLine("1. Agua  2. Café  3. Té");
Console.Write("Elige: ");
int opcion = int.Parse(Console.ReadLine());
switch (opcion)
{
    case 1:
        Console.WriteLine("Aquí tienes tu agua");
        break;
    case 2:
        Console.WriteLine("Aquí tienes tu café");
        break;
    case 3:
        Console.WriteLine("Aquí tienes tu té");
        break;
    default:
        Console.WriteLine("Opción no válida");
        break;
}`;
const progMenu: Programa = function* (t) {
  yield t.en(1);
  t.writeLine('1. Agua  2. Café  3. Té');
  yield t.en(2);
  t.write('Elige: ');
  const s = yield t.leer(3);
  const op = intParse(s);
  t.def('opcion', 'int', op);
  yield t.en(4, `switch compara opcion (${op}) con cada case, de arriba abajo.`);
  const lineas: Record<number, [number, string]> = { 1: [7, 'Aquí tienes tu agua'], 2: [10, 'Aquí tienes tu café'], 3: [13, 'Aquí tienes tu té'] };
  const [l, txt] = lineas[op] ?? [16, 'Opción no válida'];
  yield t.en(l - 1, lineas[op] ? `Coincide con case ${op}.` : 'No coincide con ningún case: entra en default.');
  yield t.en(l);
  t.writeLine(txt);
  yield t.en(l + 1, 'break: sal del switch. Sin él, C# da error de compilación (no deja «caer» al siguiente case).');
};

export default function Cuerpo() {
  const [conLlaves, setConLlaves] = useState(false);
  const [edad, setEdad] = useState(15);
  return (
    <>
      <Bloque id="if" titulo="if">
        <p>La forma más simple: si la condición entre paréntesis es <C>true</C>, se ejecuta el bloque; si es <C>false</C>, se salta y no pasa nada.</p>
        <Codigo codigo={`if (edad >= 18)
{
    Console.WriteLine("Eres mayor de edad");
}`} />
        <p>La condición siempre es una expresión que da <C>bool</C>: una comparación (<C>{'edad >= 18'}</C>), una combinación (<C>{'edad >= 16 && tieneEntrada'}</C>) o una variable bool.</p>
      </Bloque>

      <Bloque id="if-else" titulo="if-else">
        <p>Dos caminos excluyentes: si se cumple, uno; si no, el otro. <strong>Siempre</strong> se ejecuta exactamente uno de los dos.</p>
        <Simulador titulo="Clase del 21/10 · ¿alcanza el saldo?" codigo={CODIGO_SALDO} programa={progSaldo} pruebas={['25', '30', '42,90']} />
        <Ojo dice="«En las estructuras dobles, por cada IF, debe haber un ELSE»." realidad="Es una tautología: una estructura doble es justamente if + else. Pero un if puede ir perfectamente sin else, como en la sección anterior. No hace falta poner else si no tienes nada que hacer en el otro caso." />
      </Bloque>

      <Bloque id="else-if" titulo="else if y rangos">
        <p>Para más de dos caminos se encadenan condiciones con <C>else if</C>. C# las prueba en orden y <strong>se para en la primera que se cumple</strong>. El <C>else</C> final recoge todo lo que no cumplió ninguna.</p>
        <p>Por eso el orden importa. En la lámina interactiva de arriba, si pusieras <C>{'nota >= 5'}</C> la primera, un 9,5 diría «Aprobado» y nunca llegaría a «Sobresaliente». Con rangos: <strong>de lo más restrictivo a lo menos</strong>, o de menor a mayor con <C>{'<='}</C>, como en la tarifa.</p>
        <EnClase fecha="21/10">
          <p>La profesora explicó por qué no valen varios if independientes para las notas: «una nota de 8 cumple ≥ 7 y ≥ 5, y saldrían dos mensajes». Con else if «solo se puede cumplir una».</p>
        </EnClase>
      </Bloque>

      <Bloque id="switch" titulo="switch">
        <p>Cuando decides según el <strong>valor exacto</strong> de una variable, como el número de un menú, <C>switch</C> se lee mejor que una cadena de else if.</p>
        <Simulador titulo="Ejercicio 3 de clase · menú de bebidas" codigo={CODIGO_MENU} programa={progMenu} pruebas={['1', '2', '3', '7']} />
        <ul>
          <li><C>case valor:</C> marca el bloque para ese valor.</li>
          <li><C>break;</C> sale del switch. En C# es obligatorio al final de cada case con instrucciones (error CS0163 si falta).</li>
          <li><C>default:</C> recoge cualquier otro valor. Es opcional, pero en un menú es tu red de seguridad.</li>
        </ul>
        <ParaElReto>
          <p>El menú de tipos de IVA (1 general, 2 reducido, 3 superreducido) encaja perfecto con un switch, o con if/else if como en el ejercicio 15. Las dos opciones aparecen en la solución esperada del reto.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="llaves" titulo="Las llaves">
        <p>Si un if tiene <strong>una sola</strong> instrucción, las llaves pueden omitirse. Pero si luego añades una segunda línea sin llaves, esa línea queda <strong>fuera</strong> del if y se ejecuta siempre, aunque la sangría engañe a la vista:</p>
        <Panel titulo="La sangría miente">
          <div className="fila-controles">
            <Slider label={`edad = ${edad}`} value={edad} onChange={(v: number) => setEdad(v)} min={10} max={30} valueDisplay="none" />
            <Switch label="Con llaves" value={conLlaves} onChange={setConLlaves} />
          </div>
          <Codigo codigo={conLlaves
            ? `if (edad >= 18)\n{\n    Console.WriteLine("Puedes votar");\n    Console.WriteLine("Recuerda llevar el DNI");\n}`
            : `if (edad >= 18)\n    Console.WriteLine("Puedes votar");\n    Console.WriteLine("Recuerda llevar el DNI");`} />
          <div className="consola" style={{ minHeight: 0 }} aria-live="polite">
            {edad >= 18 && <div className="c-linea">Puedes votar</div>}
            {(edad >= 18 || !conLlaves) && <div className="c-linea">Recuerda llevar el DNI</div>}
          </div>
          {!conLlaves && edad < 18 && <p className="resultado" data-ok="false" style={{ marginTop: 12 }}><strong>Error lógico:</strong> con {edad} años no puede votar, pero le pedimos el DNI igualmente. La segunda línea nunca estuvo dentro del if.</p>}
        </Panel>
        <EnClase fecha="28/10">
          <p>«Acostumbraos a usar llaves siempre». Es la recomendación de la profesora y evita este error tan difícil de ver.</p>
        </EnClase>
      </Bloque>

      <Bloque id="practica" titulo="Práctica de clase">
        <p>El ejercicio de la tarifa de envío (21/10): hasta 2 kg cuesta 4 €, de más de 2 hasta 5 kg cuesta 7 €, y más de 5 kg, 12 €. Fíjate en tres decisiones de diseño que se comentaron en clase:</p>
        <ul>
          <li><C>peso</C> es <C>double</C>, porque un paquete puede pesar 3,75 kg.</li>
          <li><C>tarifa</C> se declara <strong>una vez, fuera</strong> de los if, y cada rama solo le da valor. Si la declaras dentro de cada if, al acabar el if ya no existe.</li>
          <li>Los rangos van de menor a mayor, y el <C>else</C> final cubre «más de 5» sin necesidad de condición.</li>
        </ul>
        <Simulador titulo="Ejercicio 2 de clase · tarifa de envío" codigo={CODIGO_TARIFA} programa={progTarifa} pruebas={['1,45', '2', '3,75', '6,45']} />
        <p>Prueba con los límites exactos: 2 y 5. Probar los bordes es la forma de encontrar errores en los rangos (¿&lt; o &lt;=?). En clase se insistió en probar también valores negativos en el ejercicio de la edad: ¿qué debería pasar con −3 años?</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="decisiones" preguntas={[
          { p: 'Con if / else if / else, ¿cuántas ramas pueden ejecutarse?', opciones: ['Todas las que se cumplan', 'Exactamente una', 'Ninguna o una', 'Dos como máximo'], ok: 1, porque: 'Con else final siempre se ejecuta exactamente una. (Sin else final, podría no ejecutarse ninguna.)' },
          { p: <>Con la tarifa de clase, ¿cuánto paga un paquete de 5 kg?</>, opciones: ['4 €', '7 €', '12 €', 'Ninguna'], ok: 1, porque: '5 <= 5 es true: entra en la segunda rama.' },
          { p: <>¿Qué pasa si quitas un <C>break</C> en un case con instrucciones?</>, opciones: ['Pasa al siguiente case', 'No compila (CS0163)', 'Se ejecuta default', 'Nada'], ok: 1, porque: 'C# no permite «caer» de un case a otro de forma implícita.' },
          { p: 'Ordenas: if (nota >= 5) Aprobado; else if (nota >= 9) Sobresaliente. Con nota 9,5…', opciones: ['Sobresaliente', 'Aprobado', 'Los dos', 'Error'], ok: 1, porque: 'La primera condición ya se cumple y la segunda nunca se mira. El orden importa.' },
        ]} />
      </div>
    </>
  );
}
