import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, guardar, leer } from '../ui/guia.tsx';
import { C, Codigo } from '../ui/Codigo.tsx';
import { Simulador } from '../ui/Simulador.tsx';
import type { Programa } from '../sim/traza.ts';
import { csDouble, doubleParse, intParse, tryParse } from '../sim/cs.ts';
import { enlace } from './index.ts';

export const entradilla = (
  <p>El Reto 1 te pide el «motor» de una aplicación financiera en C#: calcular impuestos, validar usuarios y generar la tabla de amortización de un préstamo. Todo lo de las once láminas anteriores, junto. Aquí tienes qué piden exactamente, cómo se puntúa, un ensayo general resuelto en clase y las piezas para construir lo demás tú. Sin solución para copiar.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Entrega', <>Hasta el <strong>20 de noviembre de 2026</strong>, inclusive. Proyecto C# completo comprimido en .zip.</>],
  ['Peso', '33,33 % de la nota de retos. Los retos son el 70 % del módulo, así que este reto vale unos 23 puntos de cada 100 de la nota final.'],
  ['Evalúa', 'RA1 sintaxis y tipos · RA2 entrada y librerías · RA3 control de flujo.'],
  ['Clave', 'Que funcione, que se entienda y que no se rompa con datos incorrectos.'],
];

export const secciones = [
  { id: 'enunciado', titulo: 'Qué piden exactamente' },
  { id: 'rubrica', titulo: 'Cómo se puntúa' },
  { id: 'plan', titulo: 'Plan de trabajo' },
  { id: 'ensayo', titulo: 'Ensayo general: el IVA' },
  { id: 'amortizacion', titulo: 'La tabla de amortización' },
  { id: 'esqueleto', titulo: 'Esqueleto para empezar' },
  { id: 'entrega', titulo: 'Lista de entrega' },
];

// ---------- Destacado: autoevaluación con la rúbrica ----------
const CRITERIOS = [
  { n: 'Sintaxis, variables y tipos', ra: 'RA1', peso: 30, niveles: ['Errores de sintaxis o tipos que impiden el funcionamiento correcto.', 'Usa los elementos básicos, aunque con errores o conversiones poco adecuadas.', 'Usa correctamente variables y tipos, con pequeños errores no significativos.', 'Uso correcto y consistente de tipos, constantes y conversiones. Código limpio y bien organizado.'] },
  { n: 'Lógica y control de flujo', ra: 'RA3', peso: 40, niveles: ['La lógica es incorrecta o el programa no resuelve el problema.', 'La lógica principal funciona, aunque con errores o redundancias.', 'Usa correctamente las estructuras de control, con pequeños fallos.', 'Condicionales y bucles bien planteados, cálculos correctos y solución eficiente.'] },
  { n: 'Entrada, cálculos y librerías', ra: 'RA2', peso: 20, niveles: ['No consigue obtener o procesar correctamente los datos.', 'Consigue la funcionalidad básica con algunas dificultades.', 'Entrada y cálculos correctos con pequeños errores.', 'Gestiona bien la entrada de datos y usa adecuadamente Console, Math y lo necesario.'] },
  { n: 'Calidad del código y errores', ra: '—', peso: 10, niveles: ['Desorganizado o con errores que provocan fallos frecuentes.', 'Funcional, pero poco organizado o con escaso control de errores.', 'Organizado y con tratamiento básico de errores.', 'Claro, bien estructurado, con comentarios útiles y tratamiento adecuado de entradas incorrectas.'] },
];
const NIVEL = ['Insuficiente', 'Suficiente', 'Bien', 'Excelente'];
const NOTA = [2, 5.5, 7.5, 9.5];

export function Destacado() {
  const [n, setN] = useState<number[]>(() => leer('rubrica', [1, 1, 1, 1]));
  const fijar = (i: number, v: number) => { const x = n.map((y, j) => (j === i ? v : y)); setN(x); guardar('rubrica', x); };
  const nota = CRITERIOS.reduce((s, c, i) => s + (NOTA[n[i]] * c.peso) / 100, 0);
  return (
    <Panel titulo="¿Cuánto sacaría hoy?">
      <div style={{ display: 'grid', gap: 18 }}>
        {CRITERIOS.map((c, i) => (
          <div key={c.n}>
            <Slider label={`${c.n} · ${c.peso} %`} value={n[i]} onChange={(v: number) => fijar(i, v)} min={0} max={3} step={1} valueDisplay="none" marks={NIVEL.map((_, k) => ({ value: k }))} />
            <p style={{ margin: '6px 0 0', fontSize: 14, color: 'var(--t9)' }}><strong>{NIVEL[n[i]]}:</strong> {c.niveles[n[i]]}</p>
          </div>
        ))}
      </div>
      <p className="resultado" style={{ marginTop: 18, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }} aria-live="polite">
        <span className="grande" style={{ fontSize: 30, color: nota >= 5 ? 'var(--verde)' : 'var(--rojo)' }}>{csDouble(nota, 'F1')}</span>
        <span>nota orientativa, con el centro de cada franja de la rúbrica. Lo que más pesa es la lógica (40 %).</span>
      </p>
    </Panel>
  );
}

// ---------- Ensayo general: ejercicio 15 ----------
const CODIGO_IVA = `const double IVA_GENERAL = 0.21;
const double IVA_REDUCIDO = 0.10;
const double IVA_SUPERREDUCIDO = 0.04;
double precio;
Console.Write("Introduce el precio sin IVA: ");
while (!double.TryParse(Console.ReadLine(), out precio) || precio <= 0)
{
    Console.Write("Precio no válido. Inténtalo: ");
}
Console.WriteLine("1. General (21%)  2. Reducido (10%)  3. Superreducido (4%)");
int opcion;
Console.Write("Opción: ");
while (!int.TryParse(Console.ReadLine(), out opcion) || opcion < 1 || opcion > 3)
{
    Console.Write("Opción incorrecta. Inténtalo: ");
}
double tipoIVA;
if (opcion == 1) { tipoIVA = IVA_GENERAL; }
else if (opcion == 2) { tipoIVA = IVA_REDUCIDO; }
else { tipoIVA = IVA_SUPERREDUCIDO; }
double importeIVA = Math.Round(precio * tipoIVA, 2);
double precioFinal = Math.Round(precio + importeIVA, 2);
Console.WriteLine($"Precio sin IVA: {precio:F2} €");
Console.WriteLine($"Importe del IVA: {importeIVA:F2} €");
Console.WriteLine($"Precio final: {precioFinal:F2} €");`;

const progIVA: Programa = function* (t) {
  yield t.en(1, 'Constantes para los tipos de IVA: lo pide el enunciado del reto.');
  t.def('IVA_GENERAL', 'const double', 0.21); t.def('IVA_REDUCIDO', 'const double', 0.1); t.def('IVA_SUPERREDUCIDO', 'const double', 0.04);
  yield t.en(4);
  t.def('precio', 'double', 0);
  yield t.en(5);
  t.write('Introduce el precio sin IVA: ');
  let precio = 0;
  for (;;) {
    const [ok, v] = tryParse((x) => doubleParse(x), (yield t.leer(6, 'Validación: repite si no es número o si es <= 0. Prueba con texto o con −5.')));
    precio = v; t.def('precio', 'double', v);
    if (ok && v > 0) break;
    yield t.en(8); t.write('Precio no válido. Inténtalo: ');
  }
  yield t.en(10);
  t.writeLine('1. General (21%)  2. Reducido (10%)  3. Superreducido (4%)');
  yield t.en(11); t.def('opcion', 'int', 0);
  yield t.en(12); t.write('Opción: ');
  let op = 0;
  for (;;) {
    const [ok, v] = tryParse(intParse, (yield t.leer(13, 'Tres condiciones unidas con ||: no es número, es menor que 1 o es mayor que 3.')));
    op = v; t.def('opcion', 'int', v);
    if (ok && v >= 1 && v <= 3) break;
    yield t.en(15); t.write('Opción incorrecta. Inténtalo: ');
  }
  yield t.en(17); t.def('tipoIVA', 'double', '(sin asignar)');
  const tipo = op === 1 ? 0.21 : op === 2 ? 0.1 : 0.04;
  yield t.en(op === 1 ? 18 : op === 2 ? 19 : 20, 'Se elige la constante según la opción.');
  t.def('tipoIVA', 'double', tipo);
  const imp = Math.round(precio * tipo * 100) / 100;
  yield t.en(21, 'Math.Round(…, 2) redondea a céntimos.');
  t.def('importeIVA', 'double', imp);
  const fin = Math.round((precio + imp) * 100) / 100;
  yield t.en(22); t.def('precioFinal', 'double', fin);
  yield t.en(23); t.writeLine(`Precio sin IVA: ${csDouble(precio, 'F2')} €`);
  yield t.en(24); t.writeLine(`Importe del IVA: ${csDouble(imp, 'F2')} €`);
  yield t.en(25); t.writeLine(`Precio final: ${csDouble(fin, 'F2')} €`);
};

// ---------- Calculadora de amortización ----------
function Amortizacion() {
  const [capital, setCapital] = useState(6000);
  const [interes, setInteres] = useState(6);
  const [meses, setMeses] = useState(12);
  const i = interes / 12 / 100;
  const cuota = i === 0 ? capital / meses : (capital * i) / (1 - Math.pow(1 + i, -meses));
  const filas: { mes: number; intereses: number; amort: number; pend: number }[] = [];
  let pend = capital;
  for (let m = 1; m <= meses; m++) {
    const intereses = pend * i;
    const amort = cuota - intereses;
    pend -= amort;
    filas.push({ mes: m, intereses, amort, pend: Math.abs(pend) < 0.005 ? 0 : pend });
  }
  const totalIntereses = cuota * meses - capital;
  return (
    <Panel titulo="Un préstamo mes a mes (sistema francés)" ancho>
      <div className="fila-controles">
        <Slider label={`Capital: ${capital.toLocaleString('es-ES')} €`} value={capital} onChange={(v: number) => setCapital(v)} min={500} max={30000} step={500} valueDisplay="none" />
        <Slider label={`Interés anual: ${csDouble(interes)} %`} value={interes} onChange={(v: number) => setInteres(v)} min={0} max={15} step={0.5} valueDisplay="none" />
        <Slider label={`Meses: ${meses}`} value={meses} onChange={(v: number) => setMeses(v)} min={1} max={60} valueDisplay="none" />
      </div>
      <p style={{ margin: '0 0 12px' }}>Cuota fija: <span className="grande" style={{ fontSize: 20, color: 'var(--cian)' }}>{csDouble(cuota, 'F2')} €</span> · intereses totales: <strong>{csDouble(totalIntereses, 'F2')} €</strong></p>
      <div className="tabla-scroll" style={{ maxHeight: 360, overflowY: 'auto' }}>
        <table className="tabla">
          <thead><tr><th>Mes</th><th>Cuota</th><th>Intereses</th><th>Amortizado</th><th>Pendiente</th></tr></thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.mes}><td>{f.mes}</td><td>{csDouble(cuota, 'F2')}</td><td>{csDouble(f.intereses, 'F2')}</td><td>{csDouble(f.amort, 'F2')}</td><td>{csDouble(f.pend, 'F2')}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--t8)' }}>Fíjate: la cuota no cambia, pero cada mes se pagan menos intereses y se amortiza más capital. Con interés 0 la fórmula dividiría entre cero; se usa capital / meses, como en la bicicleta.</p>
    </Panel>
  );
}

// ---------- Lista de entrega ----------
const LISTA = [
  'Un proyecto, un solo método Main como punto de entrada',
  'Variables de varios tipos (double, int, string) bien elegidos',
  'Constantes para los tipos de IVA, sin números mágicos repetidos',
  'Al menos una conversión de tipos (casting o Parse/TryParse) con sentido',
  'if / else if / else o switch para elegir el cálculo',
  'Un bucle for o while que genera el desglose de cuotas mes a mes',
  'Console para pedir y mostrar, y Math donde haga falta (Pow, Round)',
  'Ninguna entrada incorrecta rompe el programa (TryParse + while, try-catch)',
  'Comentarios en las partes principales, sobre todo la fórmula de la cuota',
  'Probado con datos normales, límites (0, negativos) y texto',
  'Proyecto copiado a una carpeta y comprimido en .zip',
];

function ListaEntrega() {
  const [h, setH] = useState<number[]>(() => leer('lista-reto', []));
  const t = (i: number, v: boolean) => { const x = v ? [...h, i] : h.filter((y) => y !== i); setH(x); guardar('lista-reto', x); };
  return (
    <Panel titulo={`Lista de entrega: ${h.length} de ${LISTA.length}`}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {LISTA.map((l, i) => (
          <li key={l}><CheckboxInput label={l} value={h.includes(i)} onChange={(v: boolean) => t(i, v)} /></li>
        ))}
      </ul>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="enunciado" titulo="Qué piden exactamente">
        <p><strong>El terreno:</strong> el núcleo lógico de una aplicación financiera que <em>calcule impuestos, valide usuarios y genere tablas de amortización de préstamos</em>. Se trabaja en tres bloques:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Bloque</th><th>Qué hacer</th><th>Láminas</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Sintaxis y tipos</strong> (RA1)</td><td>Configurar el IDE y crear un proyecto con variables de distintos tipos, <strong>constantes para los tipos de IVA</strong> y conversiones (casting)</td><td><a href={enlace('entorno')}>04</a> · <a href={enlace('variables')}>05</a> · <a href={enlace('constantes')}>06</a> · <a href={enlace('conversiones')}>08</a></td></tr>
              <tr><td><strong>2. Control de flujo</strong> (RA3)</td><td>if / else if / else o switch para aplicar los cálculos según los datos, y bucles for o while para el <strong>desglose de las cuotas mensuales</strong></td><td><a href={enlace('decisiones')}>09</a> · <a href={enlace('bucles')}>10</a></td></tr>
              <tr><td><strong>3. Entrada y librerías</strong> (RA2)</td><td>Console y Math para pedir datos, procesarlos y calcular</td><td><a href={enlace('conversiones')}>08</a> · <a href={enlace('errores')}>11</a></td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>Entregable:</strong> proyecto completo en C# con todos los archivos necesarios para ejecutarlo, organizado y comentado donde haga falta. Debe pedir los datos por consola, calcular y mostrar los resultados con claridad, y <strong>controlar los errores de entrada sin terminar de forma inesperada</strong>.</p>
        <p><strong>Solución esperada</strong> (según el propio documento del reto): estructura clara con <C>Main</C> como punto de entrada; variables <C>double</C>, <C>int</C> y <C>string</C>; constantes para el IVA; if-else o switch; for o while para las cuotas; Console y Math; <strong>try-catch</strong> para errores de entrada, y comentarios que expliquen sobre todo <strong>el cálculo de las cuotas de amortización</strong>.</p>
      </Bloque>

      <Bloque id="rubrica" titulo="Cómo se puntúa">
        <p>La lámina interactiva de arriba usa la rúbrica oficial. Muévela con sinceridad cuando tengas una versión: te dice dónde está el margen. Pesos: <strong>lógica y control de flujo 40 %</strong>, sintaxis y tipos 30 %, entrada y librerías 20 %, calidad y errores 10 %.</p>
        <EnClase fecha="28/10">
          <p>Fechas de los cuatro retos: <strong>20 de noviembre</strong>, 22 de enero, 5 de marzo y 23 de abril. Los dos primeros en C#, los dos últimos en Java. Reparto de la nota del módulo: 70 % retos, 20 % tests de la plataforma (se pueden hacer en cualquier momento) y 10 % examen presencial.</p>
        </EnClase>
        <EnClase fecha="04/11">
          <p>Para entregar: «copiar el proyecto a una carpeta y comprimir en .zip». Puedes organizarlo en varios archivos o en uno solo, y si quieres modular, con métodos <C>static</C>. Plazo hasta el día 20, inclusive.</p>
        </EnClase>
      </Bloque>

      <Bloque id="plan" titulo="Plan de trabajo">
        <p>El reto se diseñó para 7 sesiones de 2 horas. Este es el recorrido, con la lámina de esta guía que corresponde a cada una:</p>
        <ol>
          <li><strong>Entorno y primer programa</strong>: VS Code, C# Dev Kit, .NET SDK, Hola mundo → <a href={enlace('entorno')}>lámina 04</a></li>
          <li><strong>Algoritmos, variables, tipos, constantes, operadores y conversiones</strong> → <a href={enlace('algoritmos')}>01</a>–<a href={enlace('conversiones')}>08</a></li>
          <li><strong>Decisiones</strong>: bool, if, switch, entrada por consola → <a href={enlace('decisiones')}>09</a></li>
          <li><strong>Repeticiones</strong>: for, while, do → <a href={enlace('bucles')}>10</a></li>
          <li><strong>Librerías y errores</strong>: Math, cadenas, validaciones, try-catch → <a href={enlace('errores')}>11</a></li>
          <li><strong>Integración</strong>: miniproyecto con entrada, cálculos, decisiones y repeticiones → esta lámina</li>
          <li><strong>Simulacro</strong>: resolver, probar, depurar y revisar → la lista de entrega de abajo</li>
        </ol>
      </Bloque>

      <Bloque id="ensayo" titulo="Ensayo general: el IVA">
        <p>El ejercicio 15 de clase resuelve la parte de impuestos del reto: precio validado, menú de IVA validado, constantes, if/else if y Math.Round. Ejecútalo y equivócate a propósito en cada pregunta:</p>
        <Simulador titulo="Ejercicio 15 de clase · precio final con IVA" codigo={CODIGO_IVA} programa={progIVA} pruebas={['cien', '-5', '100', '7', '1', '3']} />
        <ParaElReto>
          <p>Esto es un tercio del reto. Te faltan la validación de usuario (el ejercicio 12 de la <a href={enlace('errores', 'validar')}>lámina 11</a> es el modelo) y la tabla de amortización, la parte de bucles, que es justo lo que más pesa.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="amortizacion" titulo="La tabla de amortización">
        <p><strong>Amortizar</strong> un préstamo es devolverlo poco a poco. El sistema más común en España es el <strong>francés</strong>: pagas siempre la misma cuota, y cada mes una parte son intereses y el resto devuelve capital.</p>
        <p>La cuota fija se calcula con esta fórmula, donde <em>C</em> es el capital prestado, <em>i</em> el interés mensual en tanto por uno (interés anual / 12 / 100) y <em>n</em> el número de meses:</p>
        <p className="grande" style={{ fontSize: 20, textAlign: 'center', margin: '20px 0' }}>cuota = C · i / (1 − (1 + i)<sup>−n</sup>)</p>
        <p>Y cada mes, dentro del bucle:</p>
        <ol>
          <li><strong>intereses</strong> = pendiente · i</li>
          <li><strong>amortizado</strong> = cuota − intereses</li>
          <li><strong>pendiente</strong> = pendiente − amortizado</li>
        </ol>
        <Amortizacion />
        <p>Es el ejercicio de la bicicleta (<a href={enlace('bucles', 'acumular')}>lámina 10</a>) con un paso más dentro del bucle. En la guía de clase se dijo explícitamente «no usamos todavía interés compuesto» en la bicicleta: el reto es donde aparece.</p>
      </Bloque>

      <Bloque id="esqueleto" titulo="Esqueleto para empezar">
        <p>No es la solución: es el orden en que conviene construirla. Cada <C>// TODO</C> es algo que ya has practicado en alguna lámina. Ve rellenando uno, ejecutando y probando antes de pasar al siguiente.</p>
        <Codigo titulo="Program.cs · estructura sugerida" codigo={`using System;

class Program
{
    static void Main(string[] args)
    {
        // ── Constantes ─────────────────────────────────────
        const double IVA_GENERAL = 0.21;
        // TODO: IVA_REDUCIDO e IVA_SUPERREDUCIDO

        // ── 1. Validar usuario (modelo: ejercicio 12) ─────────
        // TODO: pedir usuario y contraseña, normalizar con Trim/ToLower
        // TODO: si no son correctos, avisar (¿cuántos intentos permites?)

        // ── 2. Impuestos (modelo: ejercicio 15) ───────────────
        // TODO: precio validado con TryParse + while
        // TODO: menú de IVA validado y elegir la constante con if/switch
        // TODO: mostrar base, IVA y total con :F2

        // ── 3. Préstamo ────────────────────────────────────
        // TODO: pedir capital (> 0), interés anual (>= 0) y meses (> 0), validados
        double i = 0; // TODO: interés mensual en tanto por uno = anual / 12 / 100
        // TODO: cuota con la fórmula del sistema francés (Math.Pow)
        //       ¡cuidado si i == 0!
        // TODO: for (int mes = 1; mes <= meses; mes++) { intereses, amortizado, pendiente, Console.WriteLine }

        // TODO: try-catch alrededor de lo que pueda fallar
    }
}`} />
      </Bloque>

      <Bloque id="entrega" titulo="Lista de entrega">
        <p>Repásala antes de comprimir. Se guarda en este navegador.</p>
        <ListaEntrega />
        <p>Antes de comprimir puedes borrar las carpetas <C>bin</C> y <C>obj</C>: se regeneran solas al compilar y así el .zip pesa menos. Lo imprescindible es <C>Program.cs</C> (y los .cs que hayas creado) y el <C>.csproj</C>.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="reto1" preguntas={[
          { p: '¿Qué criterio pesa más en la rúbrica del Reto 1?', opciones: ['Sintaxis y tipos', 'Lógica y control de flujo', 'Entrada y librerías', 'Calidad del código'], ok: 1, porque: 'Control de flujo: 40 %.' },
          { p: 'Préstamo de 1200 € al 0 % en 12 meses. ¿Cuota?', opciones: ['120 €', '100 €', 'Error: división entre cero', '1200 €'], ok: 1, porque: 'Sin interés, cuota = capital / meses. Si usas la fórmula a ciegas con i = 0, divides 0 entre 0 (NaN): hay que tratar ese caso aparte.' },
          { p: 'Con interés anual del 6 %, ¿cuánto vale i en la fórmula?', opciones: ['6', '0,06', '0,5', '0,005'], ok: 3, porque: '6 / 12 / 100 = 0,005 mensual en tanto por uno.' },
          { p: 'El usuario escribe «abc» como capital. ¿Qué debe pasar?', opciones: ['Que el programa se cierre', 'Mostrar el error y volver a pedirlo', 'Usar 0 como capital', 'Nada'], ok: 1, porque: 'El enunciado pide no terminar de forma inesperada ante valores no válidos.' },
        ]} />
      </div>
    </>
  );
}
