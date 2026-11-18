import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';

export const entradilla = (
  <p>La <strong>placa base</strong> es la tarjeta de circuito impreso a la que se conecta todo: procesador, memoria, tarjetas, discos, fuente y los conectores que asoman por detrás de la caja. Su tamaño y la posición de cada cosa siguen un estándar, el <strong>factor de forma</strong>, para que cualquier placa ATX quepa en cualquier caja ATX. Aprender a reconocerla es medio montaje.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Socket de CPU, ranuras de RAM, chipset, ranuras PCIe, M.2, SATA, conector ATX de 24 pines, pila y panel trasero.'],
  ['Se confunde con', 'El socket y el procesador: el socket es el zócalo vacío de la placa.'],
  ['Hábitat', 'Atornillada a la caja sobre separadores, con los conectores traseros hacia fuera.'],
  ['Truco ATX de clase', 'CPU y RAM en paralelo; ranuras de RAM perpendiculares a las de expansión.'],
];

export const secciones = [
  { id: 'caja', titulo: 'La caja' },
  { id: 'forma', titulo: 'Factor de forma' },
  { id: 'componentes', titulo: 'Qué hay en una placa' },
  { id: 'traseros', titulo: 'Conectores traseros y panel frontal' },
  { id: 'refrigeracion', titulo: 'Refrigeración' },
];

// ---------- Destacado: placa clicable ----------
const ZONAS: { id: string; n: string; d: string; x: number; y: number; w: number; h: number }[] = [
  { id: 'io', n: 'Panel trasero (I/O)', d: 'USB, red, vídeo y audio que asoman por detrás de la caja.', x: 6, y: 10, w: 34, h: 120 },
  { id: 'cpu', n: 'Socket de la CPU', d: 'Zócalo donde encaja el procesador; tiene que coincidir con él exactamente.', x: 70, y: 30, w: 70, h: 70 },
  { id: 'cpu8', n: 'Alimentación de CPU (4/8 pines)', d: 'Conector EPS de la fuente que alimenta solo al procesador.', x: 60, y: 6, w: 40, h: 16 },
  { id: 'ram', n: 'Ranuras de RAM (DIMM)', d: 'Cuatro ranuras; para Dual Channel, las del mismo color o las que diga el manual.', x: 160, y: 18, w: 46, h: 110 },
  { id: 'atx', n: 'Conector ATX de 24 pines', d: 'Alimentación principal de la placa desde la fuente.', x: 214, y: 40, w: 16, h: 70 },
  { id: 'm2', n: 'Ranura M.2', d: 'Para SSD NVMe (o SATA M.2) atornillado directamente a la placa.', x: 60, y: 120, w: 90, h: 14 },
  { id: 'pcie16', n: 'PCIe x16', d: 'La ranura larga y rápida para la tarjeta gráfica.', x: 50, y: 150, w: 110, h: 12 },
  { id: 'pcie1', n: 'PCIe x1', d: 'Ranura corta para tarjetas de red, sonido o capturadoras.', x: 50, y: 178, w: 40, h: 10 },
  { id: 'chipset', n: 'Chipset', d: 'Bajo un disipador plano: gestiona USB, SATA, red y PCIe secundarios, y habla con la CPU.', x: 170, y: 150, w: 40, h: 36 },
  { id: 'sata', n: 'Puertos SATA', d: 'Conectores de datos de 7 pines para discos y unidades ópticas.', x: 214, y: 150, w: 16, h: 50 },
  { id: 'pila', n: 'Pila (CMOS)', d: 'Mantiene la hora y la configuración de la BIOS con el equipo desenchufado.', x: 110, y: 196, w: 22, h: 22 },
  { id: 'panel', n: 'Panel frontal (F_PANEL)', d: 'Pines de Power SW, Reset SW, Power LED y HDD LED de la caja.', x: 180, y: 214, w: 50, h: 12 },
];

export function Destacado() {
  const [sel, setSel] = useState<string>();
  const [reto, setReto] = useState<string>();
  const [res, setRes] = useState<boolean>();
  const z = ZONAS.find((x) => x.id === sel);
  const objetivo = ZONAS.find((x) => x.id === reto);
  const pulsar = (id: string) => { setSel(id); if (reto) setRes(id === reto); };
  const nuevoReto = () => { const otros = ZONAS.filter((x) => x.id !== reto); setReto(otros[Math.floor(Math.random() * otros.length)].id); setRes(undefined); setSel(undefined); };
  return (
    <Panel titulo={objetivo ? `¿Dónde está: ${objetivo.n}?` : 'Toca cada zona de la placa'}>
      <svg viewBox="0 0 240 232" style={{ width: '100%', maxWidth: 380, display: 'block', margin: '0 auto' }} role="group" aria-label="Esquema de placa base ATX">
        <rect x="2" y="2" width="236" height="228" rx="8" fill="color-mix(in srgb, var(--verde) 12%, var(--t2))" stroke="var(--t6)" />
        {ZONAS.map((x) => (
          <g key={x.id} role="button" tabIndex={0} aria-label={x.n} style={{ cursor: 'pointer' }} onClick={() => pulsar(x.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pulsar(x.id); } }}>
            <rect x={x.x} y={x.y} width={x.w} height={x.h} rx="3" fill={sel === x.id ? 'color-mix(in srgb, var(--familia-solido) 55%, var(--t2))' : 'var(--t3)'} stroke={sel === x.id ? 'var(--familia)' : 'var(--t6)'} strokeWidth={sel === x.id ? 2 : 1} />
            {x.id === 'ram' && [0, 1, 2, 3].map((k) => <line key={k} x1={x.x + 7 + k * 11} y1={x.y + 4} x2={x.x + 7 + k * 11} y2={x.y + x.h - 4} stroke="var(--t6)" strokeWidth="3" />)}
          </g>
        ))}
      </svg>
      <p className="resultado" data-ok={res} aria-live="polite" style={{ marginTop: 12 }}>
        {objetivo && res !== undefined ? (res ? <><strong>Eso es.</strong> {objetivo.d}</> : <><strong>No, eso es: {z?.n}.</strong> Busca otra vez.</>) : z ? <><strong>{z.n}.</strong> {z.d}</> : 'Esquema simplificado de una placa ATX. Toca una zona para ver qué es.'}
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <Button label={reto ? 'Otra pieza' : 'Ponme a prueba'} variant="primary" size="sm" onClick={nuevoReto} />
        {reto && <Button label="Volver a explorar" variant="ghost" size="sm" onClick={() => { setReto(undefined); setRes(undefined); }} />}
      </div>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="caja" titulo="La caja">
        <p>Tipos que recogen los apuntes: <strong>minitorre y semitorre</strong> (las habituales en casa y en la oficina; se distinguen por la altura y el número de bahías), <strong>torre</strong> (la más grande, para servidores o equipos con mucho hardware), <strong>sobremesa</strong> (horizontal, con el monitor encima), <strong>barebone y slim</strong> (muy pequeñas) y <strong>rack</strong> (se atornillan a un armario de servidores).</p>
      </Bloque>

      <Bloque id="forma" titulo="Factor de forma">
        <p>El <T def="Estándar que fija las medidas de la placa, la posición de los anclajes y componentes y los conectores de alimentación.">factor de forma</T> fija las medidas de la placa, dónde van los tornillos, dónde quedan el zócalo y las ranuras y qué conectores de alimentación lleva. La placa y la caja tienen que ser compatibles.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Formato</th><th>Medidas</th><th>Ranuras de expansión</th><th>Para qué</th></tr></thead>
            <tbody>
              <tr><td><strong>ATX</strong></td><td>305 × 244 mm</td><td>Hasta 7</td><td>El estándar de sobremesa</td></tr>
              <tr><td><strong>Micro-ATX</strong></td><td>244 × 244 mm</td><td>Hasta 4</td><td>Equipos de oficina, más baratos</td></tr>
              <tr><td><strong>Mini-ITX</strong></td><td>170 × 170 mm</td><td>1</td><td>Equipos compactos; ojo con las gráficas grandes</td></tr>
            </tbody>
          </table>
        </div>
        <EnClase fecha="11/11">
          <p>«Nada de comprar a lo loco»: antes de una tarjeta de expansión, mira que haya ranura libre del tipo adecuado y que quepa en la caja. Una caja ITX puede no admitir una gráfica pensada para ATX.</p>
        </EnClase>
      </Bloque>

      <Bloque id="componentes" titulo="Qué hay en una placa">
        <ul>
          <li><strong>Socket</strong> del procesador (lámina 02).</li>
          <li><strong>Ranuras de memoria</strong>: DIMM de 168 pines (SDRAM), 184 (DDR), 240 (DDR2 y DDR3), 288 (DDR4 y DDR5). Las muescas impiden poner una generación en la ranura de otra.</li>
          <li><strong>Chipset</strong>: el conjunto de chips que conecta el procesador con el resto (USB, SATA, red, PCIe secundario).</li>
          <li><strong>Ranuras de expansión</strong>: PCI (blancas, antiguas), AGP (marrón, solo gráficas, obsoleta) y <strong>PCI Express</strong> x1, x4, x8 y x16; la x16, para la gráfica. Dos x16 permitían SLI o CrossFire.</li>
          <li><strong>Almacenamiento</strong>: SATA (7 pines), M.2 y, en placas viejas, IDE (40 pines).</li>
          <li><strong>Alimentación</strong>: ATX de 24 pines y conector de CPU de 4 u 8 pines.</li>
          <li><strong>Internos</strong>: ventiladores (CPU_FAN, SYS_FAN), USB frontales, audio frontal, panel frontal y speaker.</li>
          <li><strong>BIOS/UEFI</strong> en un chip de memoria flash, y la <strong>pila</strong> que conserva la configuración.</li>
        </ul>
      </Bloque>

      <Bloque id="traseros" titulo="Conectores traseros y panel frontal">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Conector</th><th>Para qué</th><th>Estado</th></tr></thead>
            <tbody>
              <tr><td>PS/2 (morado teclado, verde ratón)</td><td>Teclado y ratón</td><td>Sustituido por USB</td></tr>
              <tr><td>VGA (azul, 15 pines en 3 filas)</td><td>Vídeo analógico</td><td>Antiguo</td></tr>
              <tr><td>DVI</td><td>Primer vídeo digital</td><td>En retirada</td></tr>
              <tr><td>HDMI y DisplayPort</td><td>Vídeo y audio digitales</td><td>Actuales</td></tr>
              <tr><td>USB (A, C)</td><td>Casi todo</td><td>Actual</td></tr>
              <tr><td>RJ-45</td><td>Red Ethernet</td><td>Actual</td></tr>
              <tr><td>Jack de audio (rosa micro, verde salida, azul entrada) y S/PDIF</td><td>Audio analógico y digital</td><td>Actuales</td></tr>
              <tr><td>Paralelo, serie (DB9), FireWire</td><td>Impresoras, equipos de red, vídeo</td><td>Obsoletos</td></tr>
            </tbody>
          </table>
        </div>
        <p>El <strong>panel frontal</strong> de la caja llega a la placa por pines: <strong>Power SW</strong>, <strong>Reset SW</strong>, <strong>Power LED</strong> y <strong>HDD LED</strong>, más el speaker para los pitidos del POST. El manual de la placa dice dónde va cada uno.</p>
        <ParaElReto>
          <p>En el inventario, la placa lleva: modelo, factor de forma, chipset, socket, número y tipo de ranuras de RAM y de expansión y ranuras M.2.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="refrigeracion" titulo="Refrigeración">
        <p>Por <strong>aire</strong> (disipador y ventilador; lo normal), <strong>líquida</strong> (bloque, tubos y radiador), con <strong>metal líquido</strong> como pasta térmica de alto rendimiento y, para récords de overclocking, <strong>criogenización</strong> con nitrógeno líquido. Igual de importante es el flujo de aire de la caja: aire frío por delante, caliente por detrás y por arriba.</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="placa" preguntas={[
          { p: '¿Qué ranura usa una tarjeta gráfica actual?', opciones: ['PCI', 'AGP', 'PCIe x16', 'PCIe x1'], ok: 2, porque: 'La más ancha y rápida.' },
          { p: 'La pila de la placa sirve para…', opciones: ['Alimentar la CPU', 'Conservar hora y configuración de la BIOS', 'Arrancar el disco', 'Cargar el portátil'], ok: 1, porque: 'Mantiene la CMOS con el equipo desenchufado.' },
          { p: 'La memoria DDR4 usa módulos de…', opciones: ['184 pines', '240 pines', '288 pines', '168 pines'], ok: 2, porque: 'DDR4 y DDR5, 288 pines (con muescas distintas).' },
          { p: 'El conector PS/2 morado es para…', opciones: ['Ratón', 'Teclado', 'Monitor', 'Red'], ok: 1, porque: 'Morado teclado, verde ratón.' },
        ]} />
      </div>
    </>
  );
}
