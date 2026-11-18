import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { ddr, latenciaNs } from '../calc.ts';

export const entradilla = (
  <p>La <strong>memoria RAM</strong> guarda los programas y datos que se están usando ahora mismo, para que el procesador los tenga a mano. Es rápida y se puede leer y escribir, pero es <strong>volátil</strong>: al apagar se pierde todo. La <strong>ROM</strong> es lo contrario: conserva su contenido sin corriente, y por eso guarda el firmware. Para el inventario necesitas saber leer una etiqueta como «DDR4-3200 CL16».</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Módulo alargado con chips negros y una muesca en los contactos que delata su generación.'],
  ['Se confunde con', 'El almacenamiento. 16 GB de RAM no son 16 GB de disco: la RAM se vacía al apagar.'],
  ['Hábitat', 'Las ranuras DIMM de la placa (SO-DIMM en portátiles) o soldada en equipos finos.'],
  ['Regla de compra', 'Misma generación, capacidad y frecuencia, en pareja para Dual Channel.'],
];

export const secciones = [
  { id: 'ram', titulo: 'Qué es la RAM' },
  { id: 'parametros', titulo: 'Frecuencia, latencia y transferencia' },
  { id: 'ddr', titulo: 'Generaciones DDR' },
  { id: 'instalar', titulo: 'Instalación y Dual Channel' },
  { id: 'rom', titulo: 'La memoria ROM' },
];

// ---------- Destacado: descifrar la etiqueta ----------
const VEL: Record<number, number[]> = { 3: [800, 1066, 1333, 1600, 1866, 2133], 4: [1600, 2133, 2400, 2666, 3000, 3200, 3600, 4000], 5: [4800, 5200, 5600, 6000, 6400, 7200, 8000] };

export function Destacado() {
  const [g, setG] = useState<3 | 4 | 5>(4);
  const [k, setK] = useState(5);
  const [cl, setCl] = useState(16);
  const lista = VEL[g];
  const mts = lista[Math.min(k, lista.length - 1)];
  const d = ddr(g, mts);
  return (
    <Panel titulo="Descifra la etiqueta de un módulo">
      <div className="opciones" role="group" aria-label="Generación">
        {([3, 4, 5] as const).map((x) => <button key={x} type="button" className="opcion" aria-pressed={g === x} onClick={() => { setG(x); setK(3); }}>DDR{x}</button>)}
      </div>
      <Slider label={`Velocidad: ${mts} MT/s`} value={Math.min(k, lista.length - 1)} onChange={(v: number) => setK(v)} min={0} max={lista.length - 1} step={1} valueDisplay="none" />
      <Slider label={`Latencia: CL${cl}`} value={cl} onChange={(v: number) => setCl(v)} min={9} max={46} step={1} valueDisplay="none" />
      <dl className="ficha" style={{ marginTop: 14 }}>
        <div className="ficha-fila"><dt>Chip</dt><dd><strong>{d.chip}</strong>: {mts} millones de transferencias por segundo</dd></div>
        <div className="ficha-fila"><dt>Módulo</dt><dd><strong>{d.modulo}</strong>: {d.mbs.toLocaleString('es-ES')} MB/s de pico (MT/s × 8 bytes)</dd></div>
        <div className="ficha-fila"><dt>Reloj real</dt><dd>{d.relojMHz.toLocaleString('es-ES')} MHz: DDR transfiere dos veces por ciclo</dd></div>
        <div className="ficha-fila"><dt>Latencia real</dt><dd>{latenciaNs(cl, mts).toLocaleString('es-ES', { maximumFractionDigits: 2 })} ns (CL × 2000 ÷ MT/s)</dd></div>
      </dl>
      <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--t8)' }}>Fíjate: un CL más alto en una memoria más rápida puede dar la misma latencia en nanosegundos. Por eso el CL solo no basta para comparar.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="ram" titulo="Qué es la RAM">
        <p>La <T def="Random Access Memory: memoria principal de lectura y escritura, volátil, a la que se accede directamente a cualquier posición.">RAM</T> es la memoria principal: de lectura y escritura, de acceso aleatorio (cualquier celda se lee igual de rápido) y volátil. Lógicamente es una tabla de celdas, cada una con su <strong>dirección</strong> y su <strong>contenido</strong>; físicamente, un módulo con chips soldados que suman la capacidad.</p>
        <ul>
          <li><strong>SRAM</strong> (estática): no necesita refresco, es muy rápida y cara. Se usa en la caché.</li>
          <li><strong>DRAM</strong> (dinámica): cada bit es un condensador que hay que <strong>refrescar</strong> continuamente. Más barata y densa: es la RAM del PC.</li>
        </ul>
      </Bloque>

      <Bloque id="parametros" titulo="Frecuencia, latencia y transferencia">
        <ul>
          <li><strong>Tiempo de acceso</strong>: lo que tarda en llegar a la celda pedida, en nanosegundos.</li>
          <li><strong>Frecuencia</strong>: a más MHz (o MT/s), menos tiempo por operación.</li>
          <li><strong>Latencia CAS (CL)</strong>: ciclos de reloj entre la petición de la CPU y la respuesta. Menos es mejor, a igual frecuencia.</li>
          <li><strong>Tasa de transferencia</strong>: cuántos datos entrega por segundo una vez localizados.</li>
        </ul>
        <p>Lo importante es el equilibrio: una CPU rápida con una RAM lenta crea un cuello de botella.</p>
      </Bloque>

      <Bloque id="ddr" titulo="Generaciones DDR">
        <p><strong>DDR</strong> (Double Data Rate) transfiere dos veces por ciclo de reloj, frente a una de la antigua SDR. Cada generación sube la frecuencia y la capacidad y baja el voltaje, y cambia la muesca para que no se puedan mezclar.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Pines (DIMM)</th><th>Voltaje</th><th>Velocidades típicas</th></tr></thead>
            <tbody>
              <tr><td>DDR</td><td>184</td><td>2,5 V</td><td>200-400 MT/s (PC1600-PC3200)</td></tr>
              <tr><td>DDR2</td><td>240</td><td>1,8 V</td><td>400-1066 MT/s</td></tr>
              <tr><td>DDR3</td><td>240</td><td>1,5 V</td><td>800-2133 MT/s</td></tr>
              <tr><td>DDR4</td><td>288</td><td>1,2 V</td><td>1600-3200 MT/s y más con XMP</td></tr>
              <tr><td>DDR5</td><td>288</td><td>1,1 V</td><td>4800-8000 MT/s y más</td></tr>
            </tbody>
          </table>
        </div>
        <Ojo dice="La lista de tipos de RAM termina en DDR4." realidad="DDR5 es la memoria de los equipos nuevos desde 2021 (Intel 12.ª generación y Ryzen 7000 en adelante; AM5 solo admite DDR5). Si montas o inventarías un equipo actual, probablemente sea DDR5." />
        <EnClase fecha="28/10">
          <p>El profesor relativizó el «índice PC» (PC4-25600): es útil saber de dónde sale, pero confunde; en tiendas y fichas se habla de DDR4-3200. Y para portátiles y móviles: <strong>SO-DIMM</strong> (módulo pequeño, extraíble) y <strong>LPDDR</strong> (bajo consumo, normalmente soldada).</p>
        </EnClase>
      </Bloque>

      <Bloque id="instalar" titulo="Instalación y Dual Channel">
        <p>Abre las pestañas laterales, alinea la muesca y aprieta los dos extremos hasta el «clac»; si las pestañas no se cierran solas, no ha entrado. Coge los módulos por los bordes, sin tocar los contactos.</p>
        <p>Con <strong>Dual Channel</strong>, dos módulos trabajan en paralelo y doblan el ancho de banda. Van en las ranuras del mismo color o en las que diga el manual (a menudo la 2.ª y la 4.ª). Mejor iguales: mismo tipo, capacidad y frecuencia. Si mezclas frecuencias, todo funciona a la más baja.</p>
        <ParaElReto>
          <p>En el inventario: tipo, capacidad total, número de módulos, velocidad (MT/s), latencia y si trabaja en Dual Channel (CPU-Z, pestaña Memory, campo «Channel»). En la BIOS, el perfil <strong>XMP</strong> (Intel) o <strong>EXPO</strong> (AMD) la pone a la velocidad anunciada: buen parámetro para justificar.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="rom" titulo="La memoria ROM">
        <ul>
          <li><strong>Mask ROM</strong>: grabada en fábrica, no se puede cambiar.</li>
          <li><strong>PROM</strong>: se programa una sola vez.</li>
          <li><strong>EPROM</strong>: se borra con luz ultravioleta y se vuelve a grabar.</li>
          <li><strong>EEPROM</strong> y su variante <strong>flash</strong>: se borran y reescriben eléctricamente. Ahí vive hoy la BIOS/UEFI, y por eso se puede actualizar.</li>
        </ul>
        <Ojo dice="«EPROM significa Electrically Programmable ROM»." realidad="Es Erasable Programmable ROM: ROM programable y borrable, y se borra con luz ultravioleta, como dice la propia frase del tema. La que se borra eléctricamente es la EEPROM (Electrically Erasable)." />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="memoria" preguntas={[
          { p: 'Al apagar el ordenador, la RAM…', opciones: ['Conserva los datos', 'Pierde su contenido', 'Los pasa a la caché', 'Se formatea'], ok: 1, porque: 'Es volátil.' },
          { p: 'La caché del procesador es de tipo…', opciones: ['DRAM', 'SRAM', 'EPROM', 'Flash'], ok: 1, porque: 'Estática: no necesita refresco y es muy rápida.' },
          { p: 'Pones un módulo DDR4-3200 y otro DDR4-2666. ¿A qué velocidad irán?', opciones: ['3200', '2666', '5866', 'No arranca'], ok: 1, porque: 'Todos los módulos funcionan a la velocidad del más lento.' },
          { p: 'DDR4-3200 equivale a…', opciones: ['PC4-3200', 'PC4-25600', 'PC4-1600', 'PC3-25600'], ok: 1, porque: '3200 × 8 = 25.600 MB/s.' },
          { p: '¿En qué memoria está hoy la BIOS/UEFI?', opciones: ['RAM', 'Mask ROM', 'Flash (EEPROM)', 'Caché'], ok: 2, porque: 'Se puede actualizar sin cambiar el chip.' },
        ]} />
      </div>
    </>
  );
}
