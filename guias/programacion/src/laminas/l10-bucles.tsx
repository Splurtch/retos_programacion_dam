import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse, intParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Un bucle repite un bloque de código sin copiarlo. Para entender cualquier bucle bastan tres preguntas: <strong>¿con qué valor empiezo?</strong>, <strong>¿cuándo dejo de repetir?</strong> y <strong>¿qué cambia en cada vuelta?</strong> Si alguna falla, el bucle no arranca o no termina nunca.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>for (inicio; condición; cambio)</C>, <C>while (condición)</C>, <C>{'do { … } while (condición);'}</C></>],
  ['Se confunde con', 'while y do-while: while comprueba antes (puede no ejecutarse nunca); do-while comprueba después (al menos una vez).'],
  ['Hábitat', 'Tablas, acumular saldos, repetir menús y pedir datos hasta que sean válidos. En el reto: el desglose de cuotas mes a mes.'],
  ['Vocabulario', 'Iteración = cada vuelta. Contador = variable que cuenta vueltas. Acumulador = variable que va sumando.'],
];

export const secciones = [
  { id: 'por-que', titulo: 'Por qué repetir' },
  { id: 'for', titulo: 'for' },
  { id: 'while', titulo: 'while' },
  { id: 'do-while', titulo: 'do-while' },
  { id: 'acumular', titulo: 'Contadores y acumuladores' },
  { id: 'saltos', titulo: 'break, continue y return' },
  { id: 'foreach', titulo: 'foreach' },
];

// ---------- Destacado: anatomía del for ----------
export function Destacado() {
  const [ini, setIni] = useState(1);
  const [fin, setFin] = useState(12);
  const [paso, setPaso] = useState(1);
  const [foco, setFoco] = useState<0 | 1 | 2 | null>(null);
  const valores: number[] = [];
  const infinito = paso <= 0 && ini <= fin;
  if (!infinito) for (let i = ini; i <= fin && valores.length < 60; i += paso) valores.push(i);
  const parte = (k: 0 | 1 | 2, txt: string, color: string) => (
    <button type="button" className="pieza" aria-pressed={foco === k} onClick={() => setFoco(foco === k ? null : k)} style={{ color }}>{txt}</button>
  );
  const pregunta = ['¿Con qué valor empiezo? Se ejecuta una sola vez, antes de la primera vuelta.', '¿Cuándo dejo de repetir? Se comprueba ANTES de cada vuelta; si es false, se sale.', '¿Qué cambia en cada vuelta? Se ejecuta DESPUÉS de cada vuelta.'];
  return (
    <Panel titulo="Las tres partes de un for">
      <div className="codigo" style={{ margin: '0 0 16px' }}>
        <pre style={{ fontSize: 16, padding: '14px 18px' }}><code>
          <span className="cs-kw">for</span> ({parte(0, `int i = ${ini}`, '#7cb4ff')}; {parte(1, `i <= ${fin}`, '#c4a7ff')}; {parte(2, paso === 1 ? 'i++' : `i += ${paso}`, '#5ee0f0')}){'\n'}
          {'{\n    '}<span className="cs-clase">Console</span>.<span className="cs-met">Write</span>(<span className="cs-str">$"{'{'}i{'}'} "</span>);{'\n}'}
        </code></pre>
      </div>
      <p className="resultado" style={{ margin: '0 0 14px' }} aria-live="polite">{foco === null ? 'Toca cada parte de la cabecera del for.' : pregunta[foco]}</p>
      <div className="fila-controles">
        <Slider label={`inicio = ${ini}`} value={ini} onChange={(v: number) => setIni(v)} min={0} max={10} valueDisplay="none" />
        <Slider label={`fin = ${fin}`} value={fin} onChange={(v: number) => setFin(v)} min={0} max={24} valueDisplay="none" />
        <Slider label={`paso = ${paso}`} value={paso} onChange={(v: number) => setPaso(v)} min={-1} max={5} valueDisplay="none" />
      </div>
      {infinito
        ? <p className="resultado" data-ok="false"><strong>Bucle infinito.</strong> Con paso {paso}, i nunca supera {fin}: la condición siempre es true y el programa se queda colgado. Es el error clásico de olvidar «qué cambia».</p>
        : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} aria-label="Valores de i en cada vuelta">
              {valores.map((v, k) => (
                <span key={k} style={{ minWidth: 40, textAlign: 'center', padding: '6px 8px', borderRadius: 8, background: 'color-mix(in srgb, var(--cian-solido) 14%, transparent)', border: '1px solid color-mix(in srgb, var(--cian-solido) 40%, transparent)', fontFamily: 'var(--f-codigo)', fontSize: 14 }}>{v}</span>
              ))}
            </div>
            <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--t8)' }}>{valores.length === 0 ? `Cero vueltas: ${ini} <= ${fin} es false desde el principio, así que el for no se ejecuta ni una vez.` : `${valores.length} ${valores.length === 1 ? 'vuelta' : 'vueltas'}. Al salir, i valdría ${valores[valores.length - 1] + paso}: la primera que no cumple la condición.`}</p>
          </>
        )}
    </Panel>
  );
}

// ---------- Simuladores ----------
const CODIGO_TABLA = `Console.Write("Número: ");
int numero = int.Parse(Console.ReadLine());
for (int i = 1; i <= 10; i++)
{
    int resultado = numero * i;
    Console.WriteLine($"{numero} x {i} = {resultado}");
}`;
const progTabla: Programa = function* (t) {
  yield t.en(1);
  t.write('Número: ');
  const s = yield t.leer(2);
  const n = intParse(s);
  t.def('numero', 'int', n);
  for (let i = 1; ; i++) {
    yield t.en(3, i === 1 ? 'Inicio: i = 1. Luego se comprueba i <= 10.' : `i++ → i vale ${i}. ¿${i} <= 10? ${i <= 10}`);
    t.def('i', 'int', i);
    if (i > 10) break;
    yield t.en(5);
    t.def('resultado', 'int', n * i);
    yield t.en(6);
    t.writeLine(`${n} x ${i} = ${n * i}`);
    t.quitar('resultado');
  }
  t.quitar('i');
  yield t.en(7, 'La condición fue false: fin del bucle. i y resultado solo existían dentro del for.');
};

const CODIGO_AHORRO = `Console.Write("Saldo inicial: ");
double saldo = double.Parse(Console.ReadLine());
Console.Write("Aportación mensual: ");
double aporte = double.Parse(Console.ReadLine());
Console.Write("Meses: ");
int meses = int.Parse(Console.ReadLine());
for (int mes = 1; mes <= meses; mes++)
{
    saldo += aporte;   // saldo = saldo + aporte
    Console.WriteLine($"Mes {mes}: {saldo:F2} €");
}`;
const progAhorro: Programa = function* (t) {
  yield t.en(1);
  t.write('Saldo inicial: ');
  let saldo = doubleParse((yield t.leer(2)));
  t.def('saldo', 'double', saldo);
  yield t.en(3);
  t.write('Aportación mensual: ');
  const aporte = doubleParse((yield t.leer(4)));
  t.def('aporte', 'double', aporte);
  yield t.en(5);
  t.write('Meses: ');
  const meses = intParse((yield t.leer(6)));
  t.def('meses', 'int', meses);
  for (let mes = 1; mes <= meses; mes++) {
    yield t.en(7);
    t.def('mes', 'int', mes);
    yield t.en(9, mes === 1 ? 'saldo es un ACUMULADOR: en cada vuelta se le suma la aportación al valor que ya tenía.' : undefined);
    saldo += aporte;
    t.def('saldo', 'double', saldo);
    yield t.en(10);
    t.writeLine(`Mes ${mes}: ${csDouble(saldo, 'F2')} €`);
  }
  t.quitar('mes');
  yield t.en(11);
};

const CODIGO_BICI = `const double PRECIO = 900;
Console.Write("¿En cuántos meses la financias? ");
int meses = int.Parse(Console.ReadLine());
double cuota = PRECIO / meses;
Console.WriteLine($"Cuota mensual: {cuota:F2} €");
double saldoPendiente = PRECIO;
for (int mes = 1; mes <= meses; mes++)
{
    saldoPendiente -= cuota;
    Console.WriteLine($"Mes {mes}: quedan {saldoPendiente:F2} €");
}`;
const progBici: Programa = function* (t) {
  yield t.en(1);
  t.def('PRECIO', 'const double', 900);
  yield t.en(2);
  t.write('¿En cuántos meses la financias? ');
  const meses = intParse((yield t.leer(3, 'Prueba con 12, con 7 o con 0.')));
  t.def('meses', 'int', meses);
  yield t.en(4, meses === 0 ? '900 / 0 con double no rompe: da ∞ (infinito). Con int habría sido DivideByZeroException.' : 'PRECIO es double, así que la división conserva decimales.');
  const cuota = 900 / meses;
  t.def('cuota', 'double', cuota);
  yield t.en(5);
  t.writeLine(`Cuota mensual: ${csDouble(cuota, 'F2')} €`);
  yield t.en(6, 'El saldo pendiente necesita su propia variable: a una constante no se le puede restar.');
  let pend = 900;
  t.def('saldoPendiente', 'double', pend);
  for (let mes = 1; mes <= meses; mes++) {
    yield t.en(7);
    t.def('mes', 'int', mes);
    yield t.en(9);
    pend -= cuota;
    t.def('saldoPendiente', 'double', pend);
    yield t.en(10, mes === meses && pend < 0 && pend > -0.005 ? `¿«-0,00»? double no guarda ${csDouble(cuota)} exacto y, tras ${meses} restas, queda ${pend.toExponential(1).replace('.', ',')}: un pelín por debajo de cero. .NET lo imprime igual. Por eso el dinero se maneja con decimal o con Math.Round.` : undefined);
    t.writeLine(`Mes ${mes}: quedan ${csDouble(pend, 'F2')} €`);
  }
  t.quitar('mes');
  yield t.en(11);
};

const CODIGO_DO = `int opcion;
do
{
    Console.WriteLine("1. Saludar  0. Salir");
    opcion = int.Parse(Console.ReadLine());
    if (opcion == 1)
    {
        Console.WriteLine("¡Hola!");
    }
} while (opcion != 0);
Console.WriteLine("Adiós");`;
const progDo: Programa = function* (t) {
  yield t.en(1);
  t.def('opcion', 'int', '(sin asignar)');
  for (;;) {
    yield t.en(4, 'do: entra SIN comprobar nada. El menú se muestra al menos una vez.');
    t.writeLine('1. Saludar  0. Salir');
    const op = intParse((yield t.leer(5)));
    t.def('opcion', 'int', op);
    yield t.en(6);
    if (op === 1) { yield t.en(8); t.writeLine('¡Hola!'); }
    yield t.en(10, `Ahora sí se comprueba: ¿opcion != 0? ${op} != 0 → ${op !== 0}. ${op !== 0 ? 'Repite.' : 'Sale.'}`);
    if (op === 0) break;
  }
  yield t.en(11);
  t.writeLine('Adiós');
};

const CODIGO_CONTINUE = `for (int i = 1; i <= 10; i++)
{
    if (i < 9)
    {
        continue;
    }
    Console.WriteLine(i);
}`;
const progContinue: Programa = function* (t) {
  for (let i = 1; i <= 10; i++) {
    yield t.en(1);
    t.def('i', 'int', i);
    yield t.en(3, `¿${i} < 9? ${i < 9}`);
    if (i < 9) { yield t.en(5, 'continue: salta el resto de ESTA vuelta y pasa a la siguiente.'); continue; }
    yield t.en(7);
    t.writeLine(String(i));
  }
  t.quitar('i');
};

export default function Cuerpo() {
  return (
    <>
      <Bloque id="por-que" titulo="Por qué repetir">
        <p>Imagina mostrar los meses del 1 al 12. Sin bucles, doce líneas casi iguales. Con un <C>for</C>, tres. Y si mañana son 48 meses de préstamo, cambias un número.</p>
        <Codigo codigo={`// Sin bucle
Console.WriteLine("Mes 1");
Console.WriteLine("Mes 2");
// … diez líneas más

// Con bucle
for (int i = 1; i <= 12; i++)
{
    Console.WriteLine($"Mes {i}");
}`} />
        <EnClase fecha="28/10">
          <p>La sesión 4 entera fue de bucles, con las tres preguntas para entender cualquiera: «¿con qué valor empiezo?, ¿cuándo dejo de repetir? y ¿qué cambia en cada vuelta?». Por convención el contador se llama <C>i</C> (de iteración), y en bucles anidados se usan <C>i</C> y <C>j</C>.</p>
        </EnClase>
      </Bloque>

      <Bloque id="for" titulo="for">
        <p><C>for</C> es el bucle para cuando <strong>sabes cuántas vueltas</strong> darás: 10 filas de una tabla, N meses de un préstamo. Su cabecera reúne las tres respuestas, separadas por <C>;</C>.</p>
        <Simulador titulo="Ejercicio 8 de clase · tabla de multiplicar" codigo={CODIGO_TABLA} programa={progTabla} pruebas={['7', '3']} />
        <p>El paso no tiene por qué ser 1. <C>{'for (int i = 0; i <= 10; i += 2)'}</C> da 0, 2, 4, 6, 8 y 10: lo mismo que el diagrama de la lámina 02.</p>
      </Bloque>

      <Bloque id="while" titulo="while">
        <p><C>while</C> repite <strong>mientras</strong> se cumpla la condición, sin un número de vueltas fijo. Se usa cuando no sabes cuántas veces hará falta: ahorrar hasta llegar a un objetivo, o pedir una contraseña hasta que sea correcta.</p>
        <Codigo codigo={`double saldo = 0;
int meses = 0;
while (saldo < 1000)
{
    saldo += 150;    // ahorro mensual
    meses++;
}
Console.WriteLine($"Llegas a 1000 € en {meses} meses");   // 7`} />
        <p>La condición se comprueba <strong>al principio</strong>: si ya es false la primera vez, el bloque no se ejecuta nunca. Y algo dentro del bucle tiene que acercarla a false, o no terminará jamás. El uso estrella en el reto es validar entradas (lámina 08): <C>{'while (!int.TryParse(…))'}</C>.</p>
      </Bloque>

      <Bloque id="do-while" titulo="do-while">
        <p>Igual que while, pero comprueba la condición <strong>al final</strong>: el bloque se ejecuta <strong>al menos una vez</strong>. Ideal para menús, que siempre deben mostrarse antes de preguntar si salir.</p>
        <Simulador titulo="Un menú que se repite hasta elegir 0" codigo={CODIGO_DO} programa={progDo} pruebas={['1', '0']} />
        <p>Ojo al <C>;</C> después del <C>while (…)</C> del final: en do-while es obligatorio.</p>
      </Bloque>

      <Bloque id="acumular" titulo="Contadores y acumuladores">
        <p>Dos patrones que aparecen en todos los bucles:</p>
        <ul>
          <li><strong>Contador</strong>: cuenta vueltas o sucesos. <C>contador++;</C></li>
          <li><strong>Acumulador</strong>: va sumando (o restando) valores. <C>total += precio;</C> Se inicializa <strong>antes</strong> del bucle, normalmente a 0.</li>
        </ul>
        <Simulador titulo="Ejercicio 9 de clase · ahorro mes a mes" codigo={CODIGO_AHORRO} programa={progAhorro} pruebas={['100', '50', '6']} />
        <Simulador titulo="Ejercicio 10 de clase · financiar una bicicleta de 900 €" codigo={CODIGO_BICI} programa={progBici} pruebas={['12', '7', '13', '0']} />
        <EnClase fecha="28/10">
          <p>En el ejercicio 10, los errores comunes que señaló la profesora fueron intentar restar a la constante <C>PRECIO</C> (no se puede: hace falta <C>saldoPendiente</C>) y meter dentro del bucle mensajes que debían ir fuera, una sola vez.</p>
        </EnClase>
        <ParaElReto>
          <p>La tabla de amortización del reto es este mismo ejercicio con intereses: cada mes calculas los intereses sobre el capital pendiente, restas a la cuota lo que no es interés y actualizas el pendiente. Lo montas en la lámina 12.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="saltos" titulo="break, continue y return">
        <ul>
          <li><C>break</C>: sale del bucle (o del switch) inmediatamente.</li>
          <li><C>continue</C>: abandona la vuelta actual y salta a la siguiente.</li>
          <li><C>return</C>: termina el método entero y, si corresponde, devuelve un valor.</li>
        </ul>
        <Simulador titulo="continue (ejemplo del temario): solo imprime 9 y 10" codigo={CODIGO_CONTINUE} programa={progContinue} />
        <Ojo dice={<>En el ejemplo de <C>return</C>, <C>static double CalculaArea(int radio)</C> «devuelve la variable local área como un valor de tipo entero».</>} realidad={<>Devuelve un <C>double</C>, que es lo que indica la firma del método. Lo verás a fondo en la Unidad 2 (programación modular).</>} />
        <EnClase fecha="04/11">
          <p>Para validar entradas, <strong>no</strong> uses <C>break</C> para salir del bucle de petición: saldrías con la variable sin un valor válido (0 por defecto). La condición del while es la que debe decidir cuándo el dato ya es correcto.</p>
        </EnClase>
      </Bloque>

      <Bloque id="foreach" titulo="foreach">
        <p>Recorre <strong>cada elemento</strong> de una colección (un array, una lista) sin manejar índices:</p>
        <Codigo codigo={`int[] diasMes = { 1, 21, 30 };
foreach (int dia in diasMes)
{
    Console.WriteLine($"Día del mes: {dia}");
}`} />
        <p>Se lee «para cada <C>dia</C> en <C>diasMes</C>…». No sirve para cambiar los elementos del array, solo para leerlos.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="bucles" preguntas={[
          { p: <>¿Cuántas veces se ejecuta <C>{'for (int i = 0; i < 5; i++)'}</C>?</>, opciones: ['4', '5', '6', 'Infinitas'], ok: 1, porque: 'i toma los valores 0, 1, 2, 3 y 4: cinco vueltas.' },
          { p: 'Necesitas mostrar un menú al menos una vez y repetirlo hasta que elijan 0. ¿Qué bucle?', opciones: ['for', 'while', 'do-while', 'foreach'], ok: 2, porque: 'do-while ejecuta primero y comprueba después.' },
          { p: <>¿Qué pasa con <C>{'for (int i = 1; i <= 10; i--)'}</C>?</>, opciones: ['Diez vueltas', 'Ninguna vuelta', 'Bucle infinito (en la práctica)', 'No compila'], ok: 2, porque: 'i baja y siempre es <= 10. Técnicamente acabaría al desbordar el int, tras unos 2.000 millones de vueltas.' },
          { p: <>¿Qué hace <C>continue</C>?</>, opciones: ['Sale del bucle', 'Salta a la siguiente vuelta', 'Termina el programa', 'Repite la vuelta actual'], ok: 1, porque: 'Se salta lo que queda de esta iteración y sigue con la próxima.' },
          { p: <>Dentro de un bucle escribes <C>total = precio;</C> en vez de <C>total += precio;</C>. ¿Qué tipo de error es?</>, opciones: ['De compilación', 'De ejecución', 'Lógico', 'No es un error'], ok: 2, porque: 'Compila y se ejecuta, pero en lugar de acumular solo guarda el último precio.' },
        ]} />
      </div>
    </>
  );
}
