import { useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Slider } from '@astryxdesign/core/Slider';
import { Kbd } from '@astryxdesign/core/Kbd';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse, intDiv, intParse, tryParse } from '../sim/cs.ts';

export const entradilla = (
  <p>Un programa de verdad recibe datos sucios: espacios de más, mayúsculas al azar, letras donde iban números, un cero donde se iba a dividir. Esta lámina reúne las herramientas para que tu programa los aguante: métodos de <C>string</C>, la clase <C>Math</C>, validación con <C>TryParse</C> y excepciones con <C>try-catch</C>. Al final, cómo encontrar errores, probar y documentar.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', <><C>texto.Trim().ToLower()</C>, <C>Math.Pow(…)</C>, <C>{'try { … } catch (Exception) { … }'}</C></>],
  ['Se confunde con', 'Validar y capturar. Validar (TryParse + while) evita el error; try-catch lo atrapa cuando ya ha ocurrido.'],
  ['Hábitat', 'Donde entra un dato del usuario y donde una operación puede fallar.'],
  ['En el reto', 'Calidad del código y tratamiento de errores = 10 %. Entrada y librerías (Console, Math) = 20 %.'],
];

export const secciones = [
  { id: 'cadenas', titulo: 'Trabajar con texto' },
  { id: 'math', titulo: 'La clase Math' },
  { id: 'validar', titulo: 'Validar sin romperse' },
  { id: 'try-catch', titulo: 'try-catch' },
  { id: 'tipos-error', titulo: 'Tres tipos de error' },
  { id: 'depurar', titulo: 'Depurar' },
  { id: 'ciclo', titulo: 'Ciclo de vida y pruebas' },
  { id: 'documentar', titulo: 'Documentar' },
];

// ---------- Destacado: clasificar errores ----------
const CASOS = [
  { c: 'Console.WriteLine("Hola")', t: 0, p: 'Falta el ; al final. El compilador lo detecta antes de ejecutar: error CS1002.' },
  { c: 'int total = 10 / divisor;   // divisor vale 0', t: 1, p: 'Compila, pero al ejecutar con divisor 0 lanza DivideByZeroException.' },
  { c: 'double media = (nota1 + nota2) / 3;', t: 2, p: 'Compila y se ejecuta sin quejarse, pero divide entre 3 cuando hay 2 notas. El resultado es incorrecto.' },
  { c: 'int edad = int.Parse("veinte");', t: 1, p: 'Compila (el texto es un string válido), pero al ejecutar lanza FormatException.' },
  { c: 'string nombre = 25;', t: 0, p: 'Tipos incompatibles: error CS0029. No llega a ejecutarse.' },
  { c: 'if (edad > 18) Console.WriteLine("Mayor de edad");', t: 2, p: 'Con 18 años justos dice que no es mayor de edad. Debía ser >=. Error lógico en el borde.' },
];
const TIPOS = ['Compilación', 'Ejecución', 'Lógico'];

export function Destacado() {
  const [i, setI] = useState(0);
  const [resp, setResp] = useState<number | null>(null);
  const [aciertos, setAciertos] = useState(0);
  const c = CASOS[i % CASOS.length];
  const elegir = (t: number) => { if (resp !== null) return; setResp(t); if (t === c.t) setAciertos((a) => a + 1); };
  return (
    <Panel titulo="¿Qué tipo de error es?">
      <Codigo codigo={c.c} numeros={false} />
      <div className="opciones" role="group" aria-label="Tipo de error">
        {TIPOS.map((t, k) => (
          <button key={t} type="button" className="opcion" aria-pressed={resp === k} onClick={() => elegir(k)}
            style={resp !== null && k === c.t ? { background: 'var(--verde)', color: '#fff', borderColor: 'transparent' } : resp === k ? { background: 'var(--rojo)', color: '#fff', borderColor: 'transparent' } : undefined}>{t}</button>
        ))}
      </div>
      {resp !== null && <p className="resultado" data-ok={resp === c.t} aria-live="polite"><strong>{resp === c.t ? 'Exacto.' : `Es de ${TIPOS[c.t].toLowerCase()}.`}</strong> {c.p}</p>}
      <div className="sim-mandos" style={{ marginTop: 12, justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--t8)' }}>Caso {(i % CASOS.length) + 1} de {CASOS.length} · {aciertos} {aciertos === 1 ? 'acierto' : 'aciertos'}</span>
        <button type="button" className="opcion" disabled={resp === null} onClick={() => { setI(i + 1); setResp(null); if ((i + 1) % CASOS.length === 0) setAciertos(0); }}>Siguiente caso</button>
      </div>
    </Panel>
  );
}

// ---------- Laboratorio de cadenas ----------
function LabCadenas() {
  const [s, setS] = useState('  Alumno DAM  ');
  const filas: [string, string][] = [
    ['texto.Length', String(s.length)],
    ['texto.Trim()', `"${s.trim()}"`],
    ['texto.ToLower()', `"${s.toLocaleLowerCase('es-ES')}"`],
    ['texto.ToUpper()', `"${s.toLocaleUpperCase('es-ES')}"`],
    ['texto.Trim().ToLower()', `"${s.trim().toLocaleLowerCase('es-ES')}"`],
    ['texto.Contains("DAM")', String(s.includes('DAM'))],
    ['texto.IndexOf("a")', String(s.indexOf('a'))],
    ['texto.Replace(" ", "_")', `"${s.replaceAll(' ', '_')}"`],
    ['texto.Trim().Length', String(s.trim().length)],
  ];
  return (
    <Panel titulo="Laboratorio de string" ancho>
      <TextInput label="string texto =" value={s} onChange={setS} description="Escribe con espacios delante y detrás, mezcla mayúsculas…" />
      <div className="tabla-scroll" style={{ marginTop: 12 }}>
        <table className="tabla">
          <thead><tr><th>Expresión</th><th>Resultado</th></tr></thead>
          <tbody>{filas.map(([e, r]) => <tr key={e}><td><C>{e}</C></td><td style={{ fontFamily: 'var(--f-codigo)', whiteSpace: 'pre' }}>{r}</td></tr>)}</tbody>
        </table>
      </div>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--t8)' }}>Las posiciones empiezan en 0. IndexOf devuelve −1 si no lo encuentra. Ninguno de estos métodos cambia <C>texto</C>: devuelven una cadena nueva.</p>
    </Panel>
  );
}

// ---------- Math ----------
function LabMath() {
  const [x, setX] = useState(2);
  const [y, setY] = useState(3);
  const filas: [string, string, string][] = [
    [`Math.Pow(${x}, ${y})`, csDouble(x ** y), 'Potencia: x elevado a y'],
    [`Math.Sqrt(${x})`, x < 0 ? 'NaN' : csDouble(Math.sqrt(x)), 'Raíz cuadrada (NaN si es negativo)'],
    [`Math.Round(Math.Sqrt(${x}), 2)`, x < 0 ? 'NaN' : csDouble(Math.round(Math.sqrt(x) * 100) / 100), 'Redondear a 2 decimales'],
    [`Math.Abs(${x - y})`, String(Math.abs(x - y)), 'Valor absoluto'],
    [`Math.Max(${x}, ${y})`, String(Math.max(x, y)), 'El mayor de dos'],
    [`Math.Min(${x}, ${y})`, String(Math.min(x, y)), 'El menor de dos'],
    ['Math.PI', csDouble(Math.PI), 'La constante π'],
  ];
  return (
    <Panel titulo="La clase Math">
      <div className="fila-controles">
        <Slider label={`x = ${x}`} value={x} onChange={(v: number) => setX(v)} min={-4} max={16} valueDisplay="none" />
        <Slider label={`y = ${y}`} value={y} onChange={(v: number) => setY(v)} min={-2} max={6} valueDisplay="none" />
      </div>
      <table className="tabla">
        <tbody>{filas.map(([e, r, d]) => <tr key={d}><td><C>{e}</C></td><td className="grande" style={{ fontSize: 16 }}>{r}</td><td style={{ fontSize: 14 }}>{d}</td></tr>)}</tbody>
      </table>
    </Panel>
  );
}

// ---------- Simuladores de clase (04/11) ----------
const CODIGO_LOGIN = `Console.Write("Usuario: ");
string usuario = Console.ReadLine().Trim().ToLower();
Console.Write("Contraseña: ");
string contraseña = Console.ReadLine();
if (usuario == "alumno" && contraseña == "dam2026")
{
    Console.WriteLine("Acceso permitido");
}
else
{
    Console.WriteLine("Acceso denegado");
}`;
const progLogin: Programa = function* (t) {
  yield t.en(1);
  t.write('Usuario: ');
  const u = (yield t.leer(2, 'Prueba a escribir «  ALUMNO » con espacios y mayúsculas.')) ?? '';
  const un = u.trim().toLocaleLowerCase('es-ES');
  t.def('usuario', 'string', un);
  yield t.en(3, 'Solo se normaliza el usuario. La contraseña sí distingue mayúsculas, como en la vida real.');
  t.write('Contraseña: ');
  const p = (yield t.leer(4)) ?? '';
  t.def('contraseña', 'string', p);
  const ok = un === 'alumno' && p === 'dam2026';
  yield t.en(5, `${un === 'alumno'} && ${p === 'dam2026'} → ${ok}`);
  if (ok) { yield t.en(7); t.writeLine('Acceso permitido'); } else { yield t.en(11); t.writeLine('Acceso denegado'); }
};

const CODIGO_RADIO = `double radio;
Console.Write("Radio positivo: ");
while (!double.TryParse(Console.ReadLine(), out radio) || radio <= 0)
{
    Console.Write("DATO NO VÁLIDO. Radio positivo: ");
}
double area = Math.PI * Math.Pow(radio, 2);
Console.WriteLine($"El área es: {area:F2}");`;
const progRadio: Programa = function* (t) {
  yield t.en(1);
  t.def('radio', 'double', 0);
  yield t.en(2);
  t.write('Radio positivo: ');
  let r = 0;
  for (;;) {
    const s = yield t.leer(3, 'Se repite si NO es un número || es <= 0. Prueba con texto, con −2 y con 3,5.');
    const [ok, v] = tryParse((x) => doubleParse(x), s);
    r = v;
    t.def('radio', 'double', v);
    if (ok && v > 0) break;
    yield t.en(5, !ok ? 'No es un número: la primera parte ya es true y || ni mira la segunda (cortocircuito).' : `Es un número, pero ${csDouble(v)} <= 0.`);
    t.write('DATO NO VÁLIDO. Radio positivo: ');
  }
  yield t.en(7, 'Con un radio válido: π · r².');
  const a = Math.PI * r ** 2;
  t.def('area', 'double', a);
  yield t.en(8);
  t.writeLine(`El área es: ${csDouble(a, 'F2')}`);
};

const CODIGO_DIV = `try
{
    Console.Write("Número 1: ");
    int numero1 = int.Parse(Console.ReadLine());
    Console.Write("Número 2: ");
    int numero2 = int.Parse(Console.ReadLine());
    int resultado = numero1 / numero2;
    Console.WriteLine($"El resultado es {resultado}");
}
catch (Exception)
{
    Console.WriteLine("No se pudo realizar la operación con esos datos");
}
Console.WriteLine("El programa sigue vivo");`;
const progDiv: Programa = function* (t) {
  yield t.en(1, 'try: «intenta esto». Si cualquier línea de dentro lanza una excepción, se salta al catch.');
  try {
    yield t.en(3);
    t.write('Número 1: ');
    const a = intParse((yield t.leer(4)));
    t.def('numero1', 'int', a);
    yield t.en(5);
    t.write('Número 2: ');
    const b = intParse((yield t.leer(6, 'Prueba con 0 o con una letra.')));
    t.def('numero2', 'int', b);
    yield t.en(7);
    const r = intDiv(a, b);
    t.def('resultado', 'int', r);
    yield t.en(8);
    t.writeLine(`El resultado es ${r}`);
  } catch (e) {
    yield t.en(12, `Se lanzó ${(e as { tipo?: string }).tipo ?? 'una excepción'}. El catch la atrapa: en vez de romperse, el programa muestra un mensaje.`);
    t.writeLine('No se pudo realizar la operación con esos datos');
  }
  yield t.en(14);
  t.writeLine('El programa sigue vivo');
};

// ---------- Ciclo de vida ----------
const ETAPAS = [
  ['Análisis de requisitos', 'Qué hay que hacer. Entrevistas, brainstorming, prototipos, casos de uso, JAD. Es la etapa más importante: produce el documento de requisitos.'],
  ['Diseño', 'Cómo se va a hacer: módulos y estructura. Diseño estructurado (diagramas de flujo, pseudocódigo) u orientado a objetos (UML).'],
  ['Implementación', 'Se escribe el código fuente en el lenguaje elegido.'],
  ['Pruebas de integración', 'Se prueban todos los módulos juntos: ¿cumple el diseño?'],
  ['Pruebas de validación', 'Se comprueba contra el documento de requisitos: ¿cubre lo que necesitaba el usuario?'],
  ['Mantenimiento', 'Corregir, actualizar y adaptar lo que ya está en uso. Vuelve a las etapas anteriores.'],
];

function Ciclo() {
  const [k, setK] = useState(0);
  return (
    <Panel titulo="El ciclo de vida del software">
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {ETAPAS.map(([n], i) => (
          <li key={n}><button type="button" className="opcion" aria-pressed={k === i} onClick={() => setK(i)}>{i + 1}. {n}</button></li>
        ))}
      </ol>
      <p className="resultado" style={{ marginTop: 14 }} aria-live="polite"><strong>{ETAPAS[k][0]}.</strong> {ETAPAS[k][1]}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="cadenas" titulo="Trabajar con texto">
        <p>Un <C>string</C> es una cadena de caracteres, y cada carácter tiene una posición que empieza en 0: en <C>{'string frase = "buenos días";'}</C>, <C>frase[5]</C> es <C>'s'</C>. Los textos que escribe el usuario llegan con mayúsculas inconsistentes y espacios sobrantes, lo que estropea las comparaciones. Por eso se <strong>normalizan</strong>.</p>
        <LabCadenas />
        <p>Otros métodos del temario: <C>Substring(inicio, tamaño)</C> extrae un trozo, <C>Split(' ')</C> parte en piezas, <C>Insert</C>, <C>Remove</C>, <C>CompareTo</C> y <C>ToCharArray()</C>. Y se puede construir un string desde un array de char con <C>new string(letras)</C>.</p>
        <Ojo dice="«SubString()»." realidad={<>En C# es <C>Substring</C>, con s minúscula. Recuerda que C# distingue mayúsculas: <C>SubString</C> no compila.</>} />
      </Bloque>

      <Bloque id="math" titulo="La clase Math">
        <p><C>Math</C> trae funciones matemáticas ya hechas. No hace falta memorizarlas: basta con saber que existen y buscarlas cuando las necesites.</p>
        <LabMath />
        <ParaElReto>
          <p>La cuota de un préstamo necesita una potencia: <C>Math.Pow(1 + i, -n)</C>. Y <C>Math.Round(cuota, 2)</C> la deja en céntimos. El reto pide expresamente usar «métodos de la clase Math cuando sea necesario».</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="validar" titulo="Validar sin romperse">
        <EnClase fecha="04/11">
          <p>«Los programas no deberían romperse por errores comunes del usuario». Los ejemplos de clase fueron pedir una edad y recibir «hola», y dividir entre cero. La sesión practicó primero la normalización, luego la validación y por último try-catch.</p>
        </EnClase>
        <Simulador titulo="Ejercicio 12 de clase · usuario y contraseña" codigo={CODIGO_LOGIN} programa={progLogin} pruebas={['  ALUMNO ', 'alumno', 'dam2026', 'DAM2026']} />
        <Simulador titulo="Ejercicio 13 de clase · radio positivo y área" codigo={CODIGO_RADIO} programa={progRadio} pruebas={['abc', '-2', '0', '3,5']} />
      </Bloque>

      <Bloque id="try-catch" titulo="try-catch">
        <p>Una <T def="Error en tiempo de ejecución que, si nadie lo captura, detiene el programa.">excepción</T> es un error que ocurre mientras el programa se ejecuta. Si nadie la captura, el programa se cierra de golpe. <C>try-catch</C> la atrapa: «intenta esto; si algo falla, haz esto otro en vez de romperte».</p>
        <Simulador titulo="Ejercicio 14 de clase · división con try-catch" codigo={CODIGO_DIV} programa={progDiv} pruebas={['10', '3', '0', 'x']} />
        <p><C>catch (Exception)</C> captura cualquier excepción. Existen tipos concretos (<C>FormatException</C>, <C>DivideByZeroException</C>…) para dar un mensaje distinto en cada caso, pero en clase se trabajó con la general por simplicidad.</p>
        <ParaElReto>
          <p>La solución esperada del reto cita literalmente «controlar posibles errores en la entrada de datos mediante bloques try-catch». Combina las dos herramientas: <C>TryParse</C> en bucle para validar cada dato y un <C>try-catch</C> alrededor de los cálculos como red de seguridad.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="tipos-error" titulo="Tres tipos de error">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Cuándo aparece</th><th>Quién lo detecta</th></tr></thead>
            <tbody>
              <tr><td><strong>Compilación o sintaxis</strong></td><td>Al compilar. El programa ni arranca</td><td>El compilador, con número de error y línea</td></tr>
              <tr><td><strong>Ejecución</strong></td><td>Mientras se ejecuta: dividir entre 0, Parse de un texto, abrir un archivo que no existe</td><td>El CLR lanza una excepción</td></tr>
              <tr><td><strong>Lógico</strong></td><td>Siempre: el programa funciona, pero da un resultado incorrecto</td><td>Solo tú, probando. Son los más difíciles</td></tr>
            </tbody>
          </table>
        </div>
        <p>La lámina interactiva de arriba te entrena a distinguirlos con seis casos.</p>
      </Bloque>

      <Bloque id="depurar" titulo="Depurar">
        <p>El <T def="Herramienta que ejecuta el programa línea a línea y deja ver el valor de las variables.">depurador</T> hace lo mismo que los simuladores de esta guía, pero con tu código real. Los atajos del temario funcionan igual en VS Code:</p>
        <ul>
          <li><Kbd keys="F9" />: pone o quita un <strong>punto de interrupción</strong> en la línea (punto rojo en el margen).</li>
          <li><Kbd keys="F5" />: ejecuta con el depurador. Se para al llegar al punto de interrupción.</li>
          <li><Kbd keys="F10" />: avanza una línea (paso a paso). <Kbd keys="F11" /> entra dentro de los métodos.</li>
        </ul>
        <p>Mientras está parado, el panel de variables muestra cuánto vale cada una, igual que la «Memoria» de los simuladores. Es la herramienta número uno contra los errores lógicos.</p>
      </Bloque>

      <Bloque id="ciclo" titulo="Ciclo de vida y pruebas">
        <p>Un programa profesional no se escribe de golpe: pasa por un <strong>ciclo de vida</strong> de etapas.</p>
        <Ciclo />
        <p>Las <strong>pruebas</strong> buscan defectos de muchos tipos (de algoritmo, de sintaxis, de rendimiento…). Hay dos técnicas:</p>
        <ul>
          <li><strong>Caja blanca</strong>: miras el código por dentro y pruebas sus caminos (cada rama de cada if, cada bucle).</li>
          <li><strong>Caja negra</strong>: no miras el código; solo pruebas entradas y compruebas salidas.</li>
        </ul>
        <p>Cuando en las láminas 09 y 10 probabas los bordes (2 kg, 5 kg, 0 meses) estabas haciendo pruebas de caja negra con valores límite.</p>
        <Ojo dice="El IDE de ejemplo «Visual Code» y que los IDE «son multiplataforma» y «tienen una baja curva de aprendizaje»." realidad="Se llama Visual Studio Code. Y no todos los IDE son multiplataforma (Visual Studio completo es sobre todo de Windows), ni todos son fáciles al principio. Son características deseables, no garantizadas." />
      </Bloque>

      <Bloque id="documentar" titulo="Documentar">
        <p>Al terminar un proyecto se documenta qué se hizo, qué fallos aparecieron y cómo se resolvieron. Dentro del código, C# tiene los <strong>comentarios de documentación</strong> con tres barras y etiquetas XML. VS Code los muestra al pasar el ratón sobre el método:</p>
        <Codigo codigo={`/// <summary>
/// Calcula la cuota mensual de un préstamo (sistema francés).
/// </summary>
static double CalcularCuota(double capital, double interesAnual, int meses)
{
    // …
}`} />
        <p>Herramientas como Sandcastle generan con ellos páginas de documentación. Para el reto basta con comentarios claros en las partes importantes, sobre todo la fórmula de la cuota, como pide el enunciado.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="errores" preguntas={[
          { p: <>¿Qué devuelve <C>{'"  Hola  ".Trim().Length'}</C>?</>, opciones: ['8', '4', '6', '2'], ok: 1, porque: 'Trim quita los espacios de los extremos: "Hola" tiene 4 caracteres.' },
          { p: <>¿Cuánto vale <C>Math.Pow(2, 3)</C>?</>, opciones: ['6', '8', '9', '5'], ok: 1, porque: '2 elevado a 3 es 2 · 2 · 2.' },
          { p: 'Tu programa calcula mal la media pero no da ningún error. ¿Qué tipo de error es?', opciones: ['Compilación', 'Ejecución', 'Lógico', 'Ninguno'], ok: 2, porque: 'Funciona, pero el resultado no es el esperado.' },
          { p: <>Si dentro del <C>try</C> se lanza una excepción en la línea 3 de 5, ¿qué pasa con las líneas 4 y 5?</>, opciones: ['Se ejecutan igualmente', 'Se saltan y se va al catch', 'El programa se cierra', 'Se repite el try'], ok: 1, porque: 'En cuanto salta la excepción, la ejecución pasa al catch.' },
          { p: '¿Qué tecla pone un punto de interrupción?', opciones: ['F5', 'F9', 'F10', 'F12'], ok: 1, porque: 'F9 en la línea donde quieres que se pare. F5 arranca la depuración.' },
        ]} />
      </div>
    </>
  );
}
