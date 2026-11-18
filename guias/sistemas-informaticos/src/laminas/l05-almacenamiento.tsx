import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>El <strong>almacenamiento secundario</strong> guarda la información de forma permanente: el sistema operativo, tus programas y tus archivos siguen ahí al apagar. Lo que cambia entre un disco y otro es la tecnología (magnética, óptica, flash), la interfaz por la que se conecta y, sobre todo, la velocidad. En un equipo que «va lento», el disco suele ser el culpable.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Capacidad (GB/TB), tecnología (HDD, SSD), interfaz (SATA, M.2 NVMe, USB) y velocidad (MB/s).'],
  ['Se confunde con', 'La forma y el protocolo. Un SSD M.2 puede ser SATA (lento) o NVMe (rápido): mismo hueco, distinta velocidad.'],
  ['Hábitat', 'Bahías de la caja (3,5″ y 2,5″), ranuras M.2 de la placa o fuera del equipo (USB, red, nube).'],
  ['Mejora de clase', 'Pasar de HDD a SSD es el mayor salto de rendimiento que puedes dar a un equipo viejo.'],
];

export const secciones = [
  { id: 'tecnologias', titulo: 'Tecnologías' },
  { id: 'internas', titulo: 'Interfaces internas' },
  { id: 'externas', titulo: 'Interfaces externas y en red' },
  { id: 'particiones', titulo: 'Particiones y sistemas de archivos' },
];

// ---------- Destacado: tiempo de copia ----------
const DISP: [string, number, string][] = [
  ['HDD 7200 rpm', 150, 'Mecánico: platos girando y un cabezal que se mueve.'],
  ['USB 2.0 (pendrive)', 35, 'El cable limita: 480 Mbit/s teóricos, unos 35 MB/s reales.'],
  ['USB 3.0 (pendrive rápido)', 300, '5 Gbit/s teóricos; el propio pendrive suele limitar antes.'],
  ['SSD SATA', 550, 'Flash sin piezas móviles, frenado por los 6 Gbit/s del SATA III.'],
  ['SSD M.2 NVMe PCIe 3.0', 3500, 'Habla directamente por PCI Express, sin el cuello del SATA.'],
  ['SSD M.2 NVMe PCIe 4.0', 7000, 'El doble de ancho por línea que PCIe 3.0.'],
];

export function Destacado() {
  const [gb, setGb] = useState(20);
  const [i, setI] = useState(0);
  const [nombre, mbs, nota] = DISP[i];
  const seg = (gb * 1024) / mbs;
  const t = seg >= 60 ? `${Math.floor(seg / 60)} min ${Math.round(seg % 60)} s` : `${seg.toLocaleString('es-ES', { maximumFractionDigits: 1 })} s`;
  return (
    <Panel titulo="¿Cuánto tarda en copiarse?">
      <Slider label={`Tamaño: ${gb} GB (una ISO de Windows son unos 6 GB)`} value={gb} onChange={(v: number) => setGb(v)} min={1} max={200} step={1} valueDisplay="none" />
      <div className="opciones" role="group" aria-label="Dispositivo" style={{ marginTop: 12 }}>
        {DISP.map(([n], k) => <button key={n} type="button" className="opcion" aria-pressed={i === k} onClick={() => setI(k)}>{n}</button>)}
      </div>
      <p className="grande" style={{ fontSize: 30, margin: '6px 0' }}>{t}</p>
      <p style={{ margin: 0, color: 'var(--t9)' }}>{nombre}, unos {mbs.toLocaleString('es-ES')} MB/s en secuencial. {nota}</p>
      <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--t8)' }}>Son velocidades punta. La media real baja con muchos archivos pequeños, con el equipo ocupado o con poca RAM libre: lo que el profesor llamó una «verdad parcial» de los fabricantes.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="tecnologias" titulo="Tecnologías">
        <ul>
          <li><strong>Magnética</strong>: discos duros (HDD) y disquetes. Platos que giran y un cabezal que lee y escribe. Su superficie se organiza en <strong>caras/cabezas</strong>, <strong>pistas</strong> (anillos), <strong>cilindros</strong> (las pistas alineadas de todos los platos) y <strong>sectores</strong> (trozos de pista).</li>
          <li><strong>Óptica</strong>: CD, DVD y Blu-ray, leídos con láser. Cada vez menos usados.</li>
          <li><strong>Flash o estado sólido</strong>: SSD, pendrives y tarjetas SD. Sin piezas móviles: más rápidos, silenciosos, resistentes a golpes y con menos consumo y calor.</li>
          <li><strong>Cinta</strong>: lenta pero barata y duradera; se sigue usando en empresas para copias de seguridad.</li>
        </ul>
      </Bloque>

      <Bloque id="internas" titulo="Interfaces internas">
        <p>Una <T def="Medio físico y lógico (conector y protocolo) por el que un dispositivo se conecta al equipo.">interfaz</T> es el conector más el protocolo con que el dispositivo habla con el equipo.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Interfaz</th><th>Cómo es</th><th>Hoy</th></tr></thead>
            <tbody>
              <tr><td><strong>IDE / PATA</strong></td><td>Paralela, cable plano de 40 pines con dos dispositivos: <strong>maestro</strong> y <strong>esclavo</strong>, elegidos con un <strong>jumper</strong> (o Cable Select). Alimentación Molex.</td><td>Obsoleta</td></tr>
              <tr><td><strong>SATA</strong></td><td>Serie, cable fino de datos de 7 pines y conector de alimentación propio. SATA III, 6 Gbit/s.</td><td>HDD y SSD de 2,5″</td></tr>
              <tr><td><strong>M.2</strong></td><td>Tarjeta atornillada en la placa. Puede ir por <strong>SATA</strong> o por <strong>NVMe</strong> sobre PCI Express, mucho más rápido.</td><td>Lo habitual en equipos nuevos</td></tr>
              <tr><td><strong>SCSI y SAS</strong></td><td>Ámbito profesional: muchos discos por controladora, servidores y cabinas de discos.</td><td>Servidores</td></tr>
            </tbody>
          </table>
        </div>
        <EnClase fecha="04/11">
          <p>Con IDE, el disco del sistema iba como <strong>maestro</strong>: la BIOS detecta primero el maestro y luego el esclavo, y si el jumper estaba mal, no detectaba la unidad. Y el consejo práctico: si un equipo va lento, cambia el HDD por un SSD SATA; si la placa admite M.2 NVMe, mejor aún.</p>
        </EnClase>
      </Bloque>

      <Bloque id="externas" titulo="Interfaces externas y en red">
        <ul>
          <li><strong>USB</strong>: tipo A (el rectangular de siempre), B (impresoras), mini y micro (dispositivos antiguos) y <strong>C</strong> (reversible, el actual). La versión decide la velocidad: 2.0 (480 Mbit/s), 3.x «SuperSpeed» (5-20 Gbit/s), USB4. El color azul suele indicar 3.0, pero no es una garantía.</li>
          <li><strong>Thunderbolt</strong>: por conector USB-C; muy rápido, lleva vídeo, datos (PCI Express) y carga. Habitual en Mac.</li>
          <li><strong>eSATA</strong>: SATA externo; no confundir con USB.</li>
          <li><strong>NAS</strong>: una caja con discos conectada al router; una «nube personal» para toda la red.</li>
          <li><strong>SAN</strong>: una red dedicada solo al almacenamiento, en empresas.</li>
          <li><strong>Nube</strong>: discos de otro, por suscripción, con redundancia frente a robos o inundaciones.</li>
        </ul>
      </Bloque>

      <Bloque id="particiones" titulo="Particiones y sistemas de archivos">
        <p>Una <T def="División lógica (no física) de un disco, que el sistema trata como una unidad independiente.">partición</T> es una división lógica del disco: no se corta con una sierra, se apunta en una tabla. Para instalar un sistema operativo el disco tiene que estar particionado, y cada partición necesita un <strong>sistema de archivos</strong> (NTFS, exFAT, ext4), que es su organización interna: eso es formatear.</p>
        <p>En Windows se gestionan en <em>Administración de discos</em> (clic derecho en Inicio): <strong>Reducir volumen</strong> de C deja espacio no asignado, y ahí se crea un <strong>Nuevo volumen simple</strong>. Separar el sistema (C:) de los datos (D:) permite formatear el sistema sin perder tus archivos, salvo que se rompa el disco entero.</p>
        <p>Los tipos (primaria, extendida, lógica, activa) y la diferencia entre MBR y GPT están en la <a href={enlace('montaje', 'instalar')}>lámina 08</a>.</p>
        <ParaElReto>
          <p>En el inventario: tipo (SSD NVMe, SSD SATA, HDD), interfaz y capacidad. En una máquina virtual, el disco es un archivo (.vdi) en tu disco real: si tu disco real es un HDD, las VM irán lentas.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="almacenamiento" preguntas={[
          { p: 'Con IDE, ¿qué decidía si un disco era maestro o esclavo?', opciones: ['El color del cable', 'Un jumper', 'La BIOS', 'El sistema operativo'], ok: 1, porque: 'El jumper del disco (o Cable Select).' },
          { p: '¿Cuántos pines tiene el conector de datos SATA?', opciones: ['7', '15', '40', '24'], ok: 0, porque: '7 pines de datos; la alimentación SATA va aparte.' },
          { p: 'Un SSD M.2…', opciones: ['Siempre es NVMe', 'Puede ser SATA o NVMe', 'Es magnético', 'Usa cable IDE'], ok: 1, porque: 'M.2 es la forma; SATA o NVMe, el protocolo.' },
          { p: '¿Para qué separar sistema y datos en particiones?', opciones: ['Para que el disco vaya más rápido', 'Para formatear el sistema sin perder los datos', 'Porque Windows lo exige', 'Para usar USB'], ok: 1, porque: 'Si se estropea Windows, D: sigue intacta.' },
        ]} />
      </div>
    </>
  );
}
