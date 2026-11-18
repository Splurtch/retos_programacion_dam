import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Switch } from '@astryxdesign/core/Switch';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, intDiv, intMod } from '../sim/cs.ts';

export const entradilla = (
  <p>Los operadores son los verbos de las expresiones: suman, comparan, combinan condiciones. La mayoría hacen lo que esperas, pero hay tres sorpresas que suspenden exámenes: <C>5 / 2</C> da 2, <C>=</C> no es lo mismo que <C>==</C>, y <C>num++</C> no es igual que <C>++num</C>.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <>Aritméticos <C>+ - * / %</C>, incremento <C>++ --</C>, comparación <C>{'== != < > <= >='}</C> y lógicos <C>{'&& || !'}</C>.</>],
  ['Se confunde con', <><C>=</C> (guardar) frente a <C>==</C> (preguntar si son iguales).</>],
  ['Hábitat', 'En cada cálculo y en cada condición de if y bucles.'],
  ['Trampa n.º 1', 'Entre dos int, / hace división entera y tira los decimales.'],
];

export const secciones = [
  { id: 'aritmeticos', titulo: 'Aritméticos' },
  { id: 'incremento', titulo: '++ y --' },
  { id: 'comparacion', titulo: 'Comparar' },
  { id: 'logicos', titulo: 'Lógicos' },
  { id: 'precedencia', titulo: 'Quién va primero' },
];

// ---------- Destacado: calculadora con reglas de C# ----------
export function Destacado() {
  const [a, setA] = useState(5);
  const [b, setB] = useState(2);
  const [dbl, setDbl] = useState(false);
  const t = dbl ? 'double' : 'int';
  const f = (op: string): [string, boolean] => {
    try {
      if (op === '/') return dbl ? [b === 0 ? (a === 0 ? 'NaN' : a > 0 ? '∞' : '-∞') : csDouble(a / b), false] : [String(intDiv(a, b)), a % b !== 0];
      if (op === '%') return [dbl ? csDouble(a % b) : String(intMod(a, b)), false];
      const r = op === '+' ? a + b : op === '-' ? a - b : a * b;
      return [dbl ? csDouble(r) : String(r), false];
    } catch {
      return ['DivideByZeroException', true];
    }
  };
  return (
    <Panel titulo="Calcula como C#">
      <div className="fila-controles">
        <Slider label={`a = ${a}`} value={a} onChange={(v: number) => setA(v)} min={-10} max={20} valueDisplay="none" />
        <Slider label={`b = ${b}`} value={b} onChange={(v: number) => setB(v)} min={-5} max={10} valueDisplay="none" />
      </div>
      <Switch label={`Las dos variables son ${t}`} value={dbl} onChange={setDbl} description={dbl ? 'Con double, la división conserva los decimales.' : 'Con int, la división es entera.'} />
      <table className="tabla" style={{ marginTop: 16 }}>
        <thead><tr><th>Expresión</th><th>Resultado</th></tr></thead>
        <tbody>
          {['+', '-', '*', '/', '%'].map((op) => {
            const [r, ojo] = f(op);
            return (
              <tr key={op}>
                <td><C>{`a ${op} b`}</C></td>
                <td><span className="grande" style={{ fontSize: 17, color: r.includes('Exception') ? 'var(--rojo)' : ojo ? 'var(--rojo)' : undefined }}>{r}</span>{ojo && !r.includes('Exception') && <span style={{ fontSize: 13, color: 'var(--t8)', marginLeft: 10 }}>decimales perdidos</span>}{r.includes('Exception') && <span style={{ fontSize: 13, color: 'var(--t8)', marginLeft: 10 }}>dividir un int entre 0 rompe el programa</span>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Panel>
  );
}

// ---------- ++ prefijo y sufijo ----------
const CODIGO_INC = `int num = 100;
Console.WriteLine(num);    // 100
Console.WriteLine(num++);  // ¿?
Console.WriteLine(num);    // ¿?
Console.WriteLine(++num);  // ¿?`;
const progInc: Programa = function* (t) {
  yield t.en(1);
  let num = 100;
  t.def('num', 'int', num);
  yield t.en(2);
  t.writeLine(String(num));
  yield t.en(3, 'num++ (sufijo): primero USA el valor actual (100) y DESPUÉS lo incrementa.');
  t.writeLine(String(num));
  num++;
  t.def('num', 'int', num);
  yield t.en(4, 'Ahora sí vale 101.');
  t.writeLine(String(num));
  yield t.en(5, '++num (prefijo): primero INCREMENTA y después usa el valor. Imprime 102.');
  num++;
  t.def('num', 'int', num);
  t.writeLine(String(num));
};

// ---------- Tabla de verdad ----------
function TablaVerdad() {
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const fila = (n: string, v: boolean, d: string) => (
    <tr key={n}><td><C>{n}</C></td><td><span className="grande" style={{ fontSize: 17, color: v ? 'var(--verde)' : 'var(--rojo)' }}>{String(v)}</span></td><td style={{ fontSize: 14 }}>{d}</td></tr>
  );
  return (
    <Panel titulo="Tabla de verdad viva">
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', marginBottom: 12 }}>
        <Switch label={`a = ${a}`} value={a} onChange={setA} />
        <Switch label={`b = ${b}`} value={b} onChange={setB} />
      </div>
      <table className="tabla">
        <thead><tr><th>Expresión</th><th>Vale</th><th>Se lee</th></tr></thead>
        <tbody>
          {fila('a && b', a && b, 'a Y b: hacen falta las dos')}
          {fila('a || b', a || b, 'a O b: basta con una')}
          {fila('!a', !a, 'NO a: le da la vuelta')}
          {fila('a ^ b', a !== b, 'a O b, pero no las dos (XOR)')}
        </tbody>
      </table>
    </Panel>
  );
}

// ---------- Precedencia paso a paso ----------
const EXPRS: { e: string; pasos: string[]; nota: string }[] = [
  { e: '2 + 3 * 4', pasos: ['2 + 3 * 4', '2 + 12', '14'], nota: 'Primero * y después +, igual que en matemáticas.' },
  { e: '(2 + 3) * 4', pasos: ['(2 + 3) * 4', '5 * 4', '20'], nota: 'Los paréntesis mandan. En caso de duda, ponlos.' },
  { e: '10 - 7 / 2 * 2', pasos: ['10 - 7 / 2 * 2', '10 - 3 * 2', '10 - 6', '4'], nota: '7 / 2 entre enteros da 3. Con el mismo nivel de prioridad (/ y *), se evalúa de izquierda a derecha.' },
  { e: '17 % 5 + 1', pasos: ['17 % 5 + 1', '2 + 1', '3'], nota: '% tiene la misma prioridad que * y /.' },
  { e: 'nota >= 5 && faltas < 3', pasos: ['nota >= 5 && faltas < 3', '7 >= 5 && 1 < 3', 'true && true', 'true'], nota: 'Con nota = 7 y faltas = 1. Las comparaciones se resuelven antes que &&.' },
];

function Precedencia() {
  const [k, setK] = useState(0);
  const [p, setP] = useState(0);
  const x = EXPRS[k];
  return (
    <Panel titulo="Evalúa como el compilador">
      <div className="opciones" role="group" aria-label="Expresión">
        {EXPRS.map((y, i) => <button key={y.e} type="button" className="opcion" aria-pressed={k === i} onClick={() => { setK(i); setP(0); }} style={{ fontFamily: 'var(--f-codigo)' }}>{y.e}</button>)}
      </div>
      <ol style={{ listStyle: 'none', padding: 0, margin: '8px 0 14px', display: 'grid', gap: 6 }}>
        {x.pasos.slice(0, p + 1).map((s, i) => (
          <li key={i} className="grande" style={{ fontSize: 19, opacity: i === p ? 1 : 0.5 }}>{i > 0 && <span style={{ color: 'var(--t7)' }}>→ </span>}{s}</li>
        ))}
      </ol>
      <div className="sim-mandos">
        <button type="button" className="opcion" onClick={() => setP(Math.min(p + 1, x.pasos.length - 1))} disabled={p === x.pasos.length - 1}>Siguiente reducción</button>
        <button type="button" className="opcion" onClick={() => setP(0)} disabled={p === 0}>Reiniciar</button>
      </div>
      {p === x.pasos.length - 1 && <p className="resultado" style={{ marginTop: 12 }}>{x.nota}</p>}
    </Panel>
  );
}

export default function Cuerpo() {
  const [n, setN] = useState(7);
  return (
    <>
      <Bloque id="aritmeticos" titulo="Aritméticos">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Operador</th><th>Hace</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td><C>+</C></td><td>Suma (y une textos)</td><td><C>3 + 4</C> → 7</td></tr>
              <tr><td><C>-</C></td><td>Resta</td><td><C>10 - 4</C> → 6</td></tr>
              <tr><td><C>*</C></td><td>Multiplica</td><td><C>3 * 4</C> → 12</td></tr>
              <tr><td><C>/</C></td><td>Divide. Entre int, división entera</td><td><C>7 / 2</C> → 3 · <C>7.0 / 2</C> → 3,5</td></tr>
              <tr><td><C>%</C></td><td>Resto de la división entera</td><td><C>7 % 2</C> → 1</td></tr>
            </tbody>
          </table>
        </div>
        <p>La división entera es la trampa más frecuente: si los dos operandos son <C>int</C>, el resultado también es <C>int</C> y los decimales se tiran (no se redondea). Para obtener decimales, al menos uno de los dos tiene que ser <C>double</C>.</p>
        <p>El operador <C>%</C> (módulo) parece inútil hasta que lo necesitas. ¿Un número es par? Su resto entre 2 es 0.</p>
        <Panel titulo="¿Par o impar?">
          <Slider label={`n = ${n}`} value={n} onChange={(v: number) => setN(v)} min={0} max={30} valueDisplay="none" />
          <p className="grande" style={{ margin: '12px 0 0' }}>{n} % 2 == {n % 2} → <span style={{ color: n % 2 === 0 ? 'var(--cian)' : 'var(--lila)' }}>{n % 2 === 0 ? 'par' : 'impar'}</span></p>
        </Panel>
        <EnClase fecha="14/10">
          <p>«Si ambos son int, la división descarta decimales: 5/2 da 2». Y para el dinero: <C>decimal</C> con sufijo M, o <C>double</C> como en los ejercicios de clase.</p>
        </EnClase>
      </Bloque>

      <Bloque id="incremento" titulo="++ y --">
        <p><C>num++</C> equivale a <C>num = num + 1</C>, y <C>num--</C> a <C>num = num - 1</C>. Solos en una línea, <C>num++;</C> y <C>++num;</C> hacen lo mismo. La diferencia aparece cuando se usan <strong>dentro</strong> de otra expresión:</p>
        <Simulador titulo="Sufijo frente a prefijo (ejemplo del temario)" codigo={CODIGO_INC} programa={progInc} />
        <p>También existen las asignaciones abreviadas, muy usadas en bucles: <C>saldo += aporte;</C> equivale a <C>saldo = saldo + aporte;</C>, y lo mismo con <C>-=</C>, <C>*=</C> y <C>/=</C>.</p>
      </Bloque>

      <Bloque id="comparacion" titulo="Comparar">
        <p>Una comparación siempre da un <C>bool</C>: <C>true</C> o <C>false</C>.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Operador</th><th>Pregunta</th></tr></thead>
            <tbody>
              <tr><td><C>==</C></td><td>¿Son iguales?</td></tr>
              <tr><td><C>!=</C></td><td>¿Son distintos?</td></tr>
              <tr><td><C>{'>'}</C> · <C>{'<'}</C></td><td>¿Mayor? ¿Menor?</td></tr>
              <tr><td><C>{'>='}</C> · <C>{'<='}</C></td><td>¿Mayor o igual? ¿Menor o igual?</td></tr>
            </tbody>
          </table>
        </div>
        <Codigo codigo={`int edad = 18;
bool esMayor = edad >= 18;   // true
if (edad = 18) { }           // error CS0029: no se puede convertir int en bool
if (edad == 18) { }          // así sí: pregunta, no asigna`} />
        <p>Un detalle que despista: <C>{'Console.WriteLine(edad >= 18);'}</C> imprime <strong>True</strong>, con mayúscula, aunque en el código el literal se escriba <C>true</C>. Es como .NET convierte un bool a texto.</p>
      </Bloque>

      <Bloque id="logicos" titulo="Lógicos">
        <p>Combinan condiciones. Son la base de cualquier validación del reto: «el precio es mayor que 0 <strong>y</strong> la opción está entre 1 y 3».</p>
        <TablaVerdad />
        <p><strong>Cortocircuito.</strong> <C>{'&&'}</C> no mira la segunda condición si la primera ya es <C>false</C>, y <C>||</C> no la mira si la primera ya es <C>true</C>. Esto no es un detalle: <C>{'if (b != 0 && a / b > 2)'}</C> nunca divide entre cero, porque si b es 0 la división no llega a evaluarse. Los operadores <C>{'&'}</C> y <C>|</C> (simples) evalúan siempre los dos lados.</p>
        <EnClase fecha="04/11">
          <p>En el ejercicio del radio la condición fue <C>{'!double.TryParse(Console.ReadLine(), out radio) || radio <= 0'}</C>: «repite si NO es número O es menor o igual que cero». Gracias al cortocircuito, si no es un número ni se comprueba el radio.</p>
        </EnClase>
      </Bloque>

      <Bloque id="precedencia" titulo="Quién va primero">
        <p>Cuando una expresión mezcla operadores, C# sigue un orden fijo. De más a menos prioridad:</p>
        <ol>
          <li><C>x++</C> <C>x--</C> (sufijo)</li>
          <li><C>++x</C> <C>--x</C> <C>!</C> (prefijo y negación)</li>
          <li><C>*</C> <C>/</C> <C>%</C></li>
          <li><C>+</C> <C>-</C></li>
          <li><C>{'< > <= >='}</C></li>
          <li><C>==</C> <C>!=</C></li>
          <li><C>{'&&'}</C></li>
          <li><C>||</C></li>
          <li><C>=</C> <C>+=</C> <C>-=</C> … (asignación, la última)</li>
        </ol>
        <Precedencia />
        <Ojo dice="Prioridad 3: «operadores de multiplicación, división y resta *, / y %»." realidad={<>Es <strong>resto</strong>, no resta: <C>%</C> va con <C>*</C> y <C>/</C>. La resta va con la suma, un escalón por debajo.</>} />
        <ParaElReto>
          <p>En la fórmula de la cuota del préstamo pon paréntesis de sobra. <C>capital * i / (1 - Math.Pow(1 + i, -n))</C> sin el paréntesis del denominador da un resultado completamente distinto. Es un error lógico: compila, pero calcula mal.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="operadores" preguntas={[
          { p: <>Con <C>int a = 7, b = 2;</C> ¿cuánto vale <C>a / b</C>?</>, opciones: ['3,5', '3', '4', '1'], ok: 1, porque: 'División entera: se descartan los decimales sin redondear.' },
          { p: <>¿Y <C>a % b</C>?</>, opciones: ['3', '0', '1', '3,5'], ok: 2, porque: '7 entre 2 da 3 y sobra 1.' },
          { p: <><C>int x = 5; Console.WriteLine(x++);</C> imprime…</>, opciones: ['5', '6', '4', 'Error'], ok: 0, porque: 'El sufijo usa el valor y después incrementa. Tras la línea, x vale 6.' },
          { p: <>¿Qué vale <C>{'true || false && false'}</C>?</>, opciones: ['true', 'false', 'Error', 'Depende'], ok: 0, porque: '&& va antes: false && false = false; luego true || false = true.' },
          { p: <>¿Para qué sirve <C>==</C>?</>, opciones: ['Asignar un valor', 'Comparar si dos valores son iguales', 'Sumar dos veces', 'Declarar una constante'], ok: 1, porque: 'Un solo = guarda; dos == preguntan.' },
        ]} />
      </div>
    </>
  );
}
