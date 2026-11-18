import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Panel, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Cualquier ordenador, del móvil al servidor, sigue un mismo plano de 1945: un procesador que ejecuta instrucciones, una memoria donde viven a la vez los datos y el programa, y unos «cables» comunes, los buses, por los que todo viaja. Es la <strong>arquitectura de Von Neumann</strong>. Entenderla es saber qué pasa de verdad cuando tu programa lee una variable.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'CPU, memoria principal, unidad de entrada/salida y tres buses: datos, direcciones y control.'],
  ['Se confunde con', 'Hardware, software y firmware. El firmware es software grabado en el hardware para arrancarlo: la BIOS.'],
  ['Hábitat', 'Todos los ordenadores actuales. En el reto, la base para explicar la función de cada componente.'],
  ['Idea clave', 'Programa almacenado: datos y código en la misma memoria.'],
];

export const secciones = [
  { id: 'microprogramable', titulo: 'Un sistema microprogramable' },
  { id: 'von-neumann', titulo: 'La arquitectura de Von Neumann' },
  { id: 'buses', titulo: 'Los tres buses' },
  { id: 'lenguajes', titulo: 'Lenguajes: de la máquina a ti' },
  { id: 'historia', titulo: 'Generaciones de ordenadores' },
];

// ---------- Destacado: leer y escribir en memoria ----------
const PASOS = {
  leer: [
    ['La CPU envía la dirección por el bus de direcciones', 'dir'],
    ['La dirección queda en el MAR (registro de dirección de memoria)', 'mar'],
    ['El selector de memoria localiza la celda', 'celda'],
    ['El dato viaja por el bus de datos hasta el MDR (registro de datos)', 'mdr'],
  ],
  escribir: [
    ['La CPU envía la dirección por el bus de direcciones y el dato por el bus de datos', 'dir'],
    ['La dirección queda en el MAR y el dato en el MDR', 'mar'],
    ['El selector de memoria localiza la celda', 'celda'],
    ['El dato del MDR se graba en la celda', 'mdr'],
  ],
} as const;

export function Destacado() {
  const [modo, setModo] = useState<keyof typeof PASOS>('leer');
  const [n, setN] = useState(0);
  const activo = n > 0 ? PASOS[modo][n - 1][1] : '';
  const on = (k: string) => (activo === k ? 'color-mix(in srgb, var(--familia-solido) 35%, var(--t2))' : 'var(--t1)');
  const celdaValor = modo === 'leer' ? '42' : n >= 4 ? '7' : '42';
  return (
    <Panel titulo="Qué pasa al leer o escribir en memoria">
      <SegmentedControl label="Operación" value={modo} onChange={(v) => { setModo(v as keyof typeof PASOS); setN(0); }}>
        <SegmentedControlItem value="leer" label="Leer la celda 0x3A" />
        <SegmentedControlItem value="escribir" label="Escribir 7 en 0x3A" />
      </SegmentedControl>
      <svg viewBox="0 0 320 170" style={{ width: '100%', display: 'block', margin: '14px 0' }} role="img" aria-label="CPU con registros MAR y MDR, buses y memoria">
        <rect x="6" y="20" width="110" height="130" rx="10" fill="var(--t1)" stroke="var(--t5)" />
        <text x="61" y="40" textAnchor="middle" style={{ font: '800 13px var(--f-titulo)' }} fill="var(--t10)">CPU</text>
        <rect x="20" y="55" width="82" height="32" rx="6" fill={on('mar')} stroke="var(--t5)" />
        <text x="61" y="76" textAnchor="middle" style={{ font: '600 12px var(--f-texto)' }} fill="var(--t10)">MAR {n >= 2 ? '0x3A' : ''}</text>
        <rect x="20" y="100" width="82" height="32" rx="6" fill={on('mdr')} stroke="var(--t5)" />
        <text x="61" y="121" textAnchor="middle" style={{ font: '600 12px var(--f-texto)' }} fill="var(--t10)">MDR {modo === 'leer' ? (n >= 4 ? '42' : '') : n >= 2 ? '7' : ''}</text>
        <line x1="116" y1="70" x2="206" y2="70" stroke={activo === 'dir' ? 'var(--familia)' : 'var(--t6)'} strokeWidth={activo === 'dir' ? 3 : 1.5} />
        <text x="161" y="62" textAnchor="middle" style={{ font: '500 10.5px var(--f-texto)' }} fill="var(--t8)">bus de direcciones</text>
        <line x1="116" y1="116" x2="206" y2="116" stroke={activo === 'mdr' || (modo === 'escribir' && activo === 'dir') ? 'var(--familia)' : 'var(--t6)'} strokeWidth={activo === 'mdr' ? 3 : 1.5} />
        <text x="161" y="132" textAnchor="middle" style={{ font: '500 10.5px var(--f-texto)' }} fill="var(--t8)">bus de datos</text>
        <rect x="206" y="20" width="108" height="130" rx="10" fill="var(--t1)" stroke="var(--t5)" />
        <text x="260" y="40" textAnchor="middle" style={{ font: '800 13px var(--f-titulo)' }} fill="var(--t10)">Memoria</text>
        {['0x39', '0x3A', '0x3B'].map((d, k) => (
          <g key={d}>
            <rect x="218" y={52 + k * 30} width="84" height="24" rx="4" fill={d === '0x3A' && (activo === 'celda' || activo === 'mdr') ? 'color-mix(in srgb, var(--familia-solido) 35%, var(--t2))' : 'var(--t2)'} stroke="var(--t5)" />
            <text x="226" y={68 + k * 30} style={{ font: '500 11px var(--f-codigo)' }} fill="var(--t8)">{d}</text>
            <text x="294" y={68 + k * 30} textAnchor="end" style={{ font: '700 12px var(--f-codigo)' }} fill="var(--t10)">{d === '0x3A' ? celdaValor : k === 0 ? '13' : '99'}</text>
          </g>
        ))}
      </svg>
      <p className="resultado" aria-live="polite">{n === 0 ? 'Pulsa «Paso».' : <><strong>Paso {n}.</strong> {PASOS[modo][n - 1][0]}.</>}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button label="Paso" variant="primary" size="sm" isDisabled={n === 4} onClick={() => setN(n + 1)} />
        <Button label="Reiniciar" variant="ghost" size="sm" onClick={() => setN(0)} />
      </div>
    </Panel>
  );
}

function AnchoBus() {
  const [b, setB] = useState(16);
  const pos = 2 ** b;
  const bonito = pos >= 2 ** 30 ? `${(pos / 2 ** 30).toLocaleString('es-ES')} Gi` : pos >= 2 ** 20 ? `${(pos / 2 ** 20).toLocaleString('es-ES')} Mi` : pos >= 1024 ? `${(pos / 1024).toLocaleString('es-ES')} Ki` : String(pos);
  return (
    <Panel titulo="¿Cuánta memoria puede direccionar un bus?">
      <Slider label={`Líneas del bus de direcciones: ${b}`} value={b} onChange={(v: number) => setB(v)} min={8} max={40} step={1} valueDisplay="none" />
      <p className="grande" style={{ margin: '14px 0 6px' }}>2<sup>{b}</sup> = {pos.toLocaleString('es-ES')} direcciones ({bonito}B si cada celda es un byte)</p>
      <p style={{ margin: 0, color: 'var(--t8)', fontSize: 15 }}>Por eso un sistema de 32 bits no podía usar más de 4 GiB de RAM: 2<sup>32</sup> bytes.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="microprogramable" titulo="Un sistema microprogramable">
        <p>Un <T def="Sistema digital de uno o varios chips capaz de leer, interpretar y ejecutar en secuencia las instrucciones de un programa.">sistema microprogramable</T> lee, interpreta y ejecuta instrucciones de un programa, a gran velocidad. Tiene tres partes:</p>
        <ul>
          <li><strong>Hardware</strong>: los circuitos y el cableado, lo que se toca.</li>
          <li><strong>Software</strong>: la parte lógica, las instrucciones que le dicen qué hacer.</li>
          <li><strong>Firmware</strong>: un pequeño software grabado en el propio hardware para arrancarlo. En un PC, la <strong>BIOS</strong>.</li>
        </ul>
        <p>Y sus elementos: el <strong>reloj</strong>, que marca el ritmo con impulsos a intervalos constantes (se mide en hercios: a más frecuencia, más instrucciones por segundo); la <strong>CPU</strong>, que interpreta y ejecuta; la <strong>memoria principal</strong>, con datos y programas; la <strong>unidad de E/S</strong>, que adapta velocidades y códigos con el exterior, y los <strong>periféricos</strong>, de entrada, de salida o de ambas.</p>
      </Bloque>

      <Bloque id="von-neumann" titulo="La arquitectura de Von Neumann">
        <p>En 1945, Alan Turing y John Von Neumann plantearon por separado un ordenador más flexible. La idea de Von Neumann es el <strong>programa almacenado</strong>: el código vive en la memoria junto a los datos, así que cambiar de programa es cargar otro, no recablear la máquina. Casi todos los ordenadores actuales siguen este diseño.</p>
        <p>Dentro de la CPU, la <strong>unidad de control</strong> dirige (con el reloj, el decodificador y el secuenciador) y la <strong>unidad aritmético-lógica</strong> calcula. La <a href={enlace('procesador')}>lámina 02</a> las abre por dentro.</p>
        <EnClase fecha="14/10">
          <p>El ejemplo integrado de clase: <em>leer A</em> de una dirección, <em>leer B</em> de otra, la unidad de control ordena a la ALU <em>sumar</em> y el resultado se <em>guarda</em> en una dirección nueva (dirección al MAR, dato al MDR). La memoria se explicó como un panal, un hotel o una hoja de Excel: celdas con su dirección.</p>
        </EnClase>
      </Bloque>

      <Bloque id="buses" titulo="Los tres buses">
        <p>Un <T def="Conjunto de líneas eléctricas que transportan información del mismo tipo entre componentes.">bus</T> es un conjunto de líneas que llevan información del mismo tipo. Su <strong>ancho</strong> es el número de líneas: un bus de datos de 32 bits mueve 32 bits a la vez.</p>
        <ul>
          <li><strong>Bus de datos</strong>: bidireccional; transporta los datos entre componentes.</li>
          <li><strong>Bus de direcciones</strong>: unidireccional, lo controla la CPU; dice a qué celda de memoria se va.</li>
          <li><strong>Bus de control</strong>: gobierna a los otros dos con órdenes y temporizaciones para que la información no choque.</li>
        </ul>
        <AnchoBus />
      </Bloque>

      <Bloque id="lenguajes" titulo="Lenguajes: de la máquina a ti">
        <ul>
          <li><strong>Lenguaje máquina</strong>: ceros y unos que el procesador ejecuta directamente. El más difícil para una persona.</li>
          <li><strong>Ensamblador</strong>: las mismas instrucciones con abreviaturas (MOV, ADD). Sigue dependiendo del procesador.</li>
          <li><strong>Alto nivel</strong>: C#, Java, Python. Cercano al lenguaje humano; un compilador o intérprete lo traduce.</li>
        </ul>
      </Bloque>

      <Bloque id="historia" titulo="Generaciones de ordenadores">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Generación</th><th>Tecnología</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>Precursores</td><td>Máquinas mecánicas: ábaco, calculadora de Schickard, máquina de Babbage</td><td>Programa con tarjetas perforadas</td></tr>
              <tr><td>1.ª</td><td>Válvulas de vacío: enormes, calientes, averías constantes</td><td>ENIAC, unas 5.000 sumas por segundo</td></tr>
              <tr><td>2.ª</td><td>Transistores: más pequeños y con menos consumo</td><td></td></tr>
              <tr><td>3.ª</td><td>Circuitos integrados</td><td>Miniordenadores</td></tr>
              <tr><td>4.ª</td><td>Microprocesador</td><td>Ordenador personal (Apple, IBM PC)</td></tr>
              <tr><td>5.ª y siguientes</td><td>Procesamiento paralelo, portátiles, multimedia, Internet</td><td></td></tr>
            </tbody>
          </table>
        </div>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="arquitectura" preguntas={[
          { p: 'La BIOS es…', opciones: ['Hardware', 'Software de aplicación', 'Firmware', 'Un bus'], ok: 2, porque: 'Software grabado en un chip de la placa para arrancar el sistema.' },
          { p: '¿Qué bus es unidireccional y lo controla la CPU?', opciones: ['Datos', 'Direcciones', 'Control', 'Ninguno'], ok: 1, porque: 'La CPU dice a qué dirección ir; la memoria no responde por ese bus.' },
          { p: 'La idea central de Von Neumann es…', opciones: ['Usar transistores', 'El programa almacenado en memoria', 'Tener dos procesadores', 'Separar datos y código en memorias distintas'], ok: 1, porque: 'Datos y programa comparten la memoria principal.' },
          { p: 'Al leer de memoria, ¿dónde queda el dato que llega a la CPU?', opciones: ['En el MAR', 'En el MDR', 'En el contador de programa', 'En la caché L3'], ok: 1, porque: 'MAR guarda la dirección; MDR, el dato.' },
        ]} />
      </div>
    </>
  );
}
