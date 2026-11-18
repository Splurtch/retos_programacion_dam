import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { planVM } from '../calc.ts';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Una <strong>máquina virtual</strong> es un ordenador entero simulado dentro del tuyo: tiene su CPU, su RAM y su disco, pero todos prestados por el equipo real. Dentro instalas el sistema operativo que quieras y lo rompes sin miedo: tu Windows de siempre ni se entera. El programa que reparte el hardware entre las máquinas es el <strong>hipervisor</strong>. Esta lámina no sale del temario de la Unidad 1, que no trata el tema: es lo que necesitas para la tarea 3 del reto.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Una ventana con otro sistema operativo arrancando dentro de tu escritorio, con su propia BIOS/UEFI virtual.'],
  ['Vocabulario', 'Anfitrión (host): tu equipo real. Invitado (guest): el sistema de la VM. Hipervisor: el que reparte.'],
  ['Se confunde con', 'El arranque dual. Con dual boot eliges un sistema al encender; con una VM usas los dos a la vez.'],
  ['Requisito', 'Virtualización por hardware activada en la BIOS/UEFI: Intel VT-x o AMD-V (SVM).'],
];

export const secciones = [
  { id: 'que-es', titulo: 'Hipervisores de tipo 1 y tipo 2' },
  { id: 'activar', titulo: 'Activar la virtualización' },
  { id: 'recursos', titulo: 'Repartir el equipo' },
  { id: 'virtualbox', titulo: 'Paso a paso en VirtualBox' },
  { id: 'problemas', titulo: 'Problemas típicos' },
];

// ---------- Destacado: tipo 1 o tipo 2 ----------
const CASOS: [string, 1 | 2, string][] = [
  ['VirtualBox en tu Windows 11', 2, 'Es un programa más de tu sistema operativo: hipervisor alojado, tipo 2.'],
  ['VMware ESXi instalado directamente en un servidor', 1, 'Se instala sobre el hierro, sin sistema operativo debajo: nativo, tipo 1.'],
  ['VMware Workstation en Linux', 2, 'Programa sobre un sistema anfitrión: tipo 2.'],
  ['Proxmox VE en el servidor de una empresa', 1, 'Se instala en la máquina física y gestiona las VM directamente.'],
  ['Hyper-V en Windows Server', 1, 'Aunque lo actives desde Windows, Hyper-V se coloca por debajo del sistema: se considera tipo 1.'],
  ['UTM en un Mac', 2, 'Aplicación sobre macOS: tipo 2.'],
];

export function Destacado() {
  const [i, setI] = useState(0);
  const [r, setR] = useState<1 | 2>();
  const [c, t, porque] = CASOS[i];
  return (
    <Panel titulo="¿Hipervisor de tipo 1 o de tipo 2?">
      <svg viewBox="0 0 300 150" style={{ width: '100%', maxWidth: 320, display: 'block', margin: '0 auto 16px' }} role="img" aria-label="Capas: hardware abajo, hipervisor tipo 1 directamente encima; o sistema anfitrión y luego hipervisor tipo 2">
        {[['Hardware', 120, 0], ['Hipervisor tipo 1', 90, 0], ['VM · VM', 60, 0], ['Hardware', 120, 1], ['Sistema anfitrión', 90, 1], ['Hipervisor tipo 2', 60, 1], ['VM · VM', 30, 1]].map(([n, y, col], k) => (
          <g key={k}>
            <rect x={col ? 158 : 8} y={y as number} width="134" height="26" rx="6" fill={String(n).includes('Hipervisor') ? 'color-mix(in srgb, var(--familia-solido) 30%, var(--t2))' : 'var(--t1)'} stroke="var(--t5)" />
            <text x={col ? 225 : 75} y={(y as number) + 17} textAnchor="middle" style={{ font: '600 12px var(--f-texto)' }} fill="var(--t10)">{n}</text>
          </g>
        ))}
      </svg>
      <p className="grande" style={{ fontSize: 19, margin: '0 0 14px' }}>{c}</p>
      <div className="opciones" role="group" aria-label="Tipo de hipervisor">
        {([1, 2] as const).map((k) => <button key={k} type="button" className="opcion" aria-pressed={r === k} onClick={() => setR(k)}>Tipo {k}</button>)}
      </div>
      {r && <p className="resultado" data-ok={r === t} aria-live="polite"><strong>{r === t ? 'Bien.' : `Tipo ${t}.`}</strong> {porque}</p>}
      {r && <div style={{ marginTop: 12 }}><Button label="Siguiente" variant="primary" size="sm" onClick={() => { setI((i + 1) % CASOS.length); setR(undefined); }} /></div>}
    </Panel>
  );
}

// ---------- Planificador de recursos ----------
function Planificador() {
  const [ram, setRam] = useState(16);
  const [hilos, setHilos] = useState(8);
  const [vw, setVw] = useState(4);
  const [vu, setVu] = useState(4);
  const [cw, setCw] = useState(2);
  const r = planVM({ ramGB: ram, hilos, discoGB: 200 }, [{ nombre: 'Windows 11', ramGB: vw, cpus: cw, discoGB: 64 }, { nombre: 'Ubuntu', ramGB: vu, cpus: 2, discoGB: 25 }]);
  return (
    <Panel titulo="Dos máquinas encendidas a la vez en tu equipo" ancho>
      <div className="fila-controles">
        <Slider label={`RAM del anfitrión: ${ram} GB`} value={ram} onChange={(v: number) => setRam(v)} min={8} max={64} step={4} valueDisplay="none" />
        <Slider label={`Hilos del anfitrión: ${hilos}`} value={hilos} onChange={(v: number) => setHilos(v)} min={4} max={32} step={2} valueDisplay="none" />
      </div>
      <div className="fila-controles">
        <Slider label={`RAM de Windows 11: ${vw} GB`} value={vw} onChange={(v: number) => setVw(v)} min={2} max={16} step={1} valueDisplay="none" />
        <Slider label={`CPU de Windows 11: ${cw}`} value={cw} onChange={(v: number) => setCw(v)} min={1} max={12} step={1} valueDisplay="none" />
        <Slider label={`RAM de Ubuntu: ${vu} GB`} value={vu} onChange={(v: number) => setVu(v)} min={1} max={16} step={1} valueDisplay="none" />
      </div>
      <div style={{ height: 14, borderRadius: 999, background: 'var(--t3)', overflow: 'hidden', display: 'flex', margin: '6px 0 10px' }} aria-hidden="true">
        <div style={{ width: `${(Math.min(4, ram) / ram) * 100}%`, background: 'var(--t6)' }} />
        <div style={{ width: `${(vw / ram) * 100}%`, background: 'var(--azul-solido)' }} />
        <div style={{ width: `${(vu / ram) * 100}%`, background: 'var(--lila-solido)' }} />
      </div>
      <p style={{ margin: '0 0 10px', fontSize: 14, color: 'var(--t8)' }}>Gris: 4 GB reservados para el anfitrión. Azul: Windows 11. Lila: Ubuntu.</p>
      <p className="resultado" data-ok={r.avisos.length === 0 && vw >= 4} aria-live="polite">
        {r.avisos.length ? r.avisos.join(' ') : vw < 4 ? 'Cabe, pero Windows 11 pide al menos 4 GB: con menos, el instalador se niega o va a pedales.' : <><strong>Cabe.</strong> Las dos máquinas suman {r.ram} GB y tu equipo sigue respirando.</>}
      </p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="que-es" titulo="Hipervisores de tipo 1 y tipo 2">
        <p>El <T def="Software que crea y ejecuta máquinas virtuales repartiendo el hardware real entre ellas.">hipervisor</T> reparte CPU, memoria, disco y red entre las máquinas virtuales y las mantiene aisladas entre sí. Hay dos familias:</p>
        <ul>
          <li><strong>Tipo 1 o nativo</strong> (<em>bare metal</em>): se instala directamente sobre el hardware. Es lo que se usa en servidores y centros de datos: VMware ESXi, Proxmox, Hyper-V, Xen.</li>
          <li><strong>Tipo 2 o alojado</strong>: es una aplicación más sobre tu sistema operativo. Es lo que usarás en el reto: <strong>VirtualBox</strong> (gratuito y libre), VMware Workstation, UTM en Mac.</li>
        </ul>
        <p>Para qué sirve, según el enunciado: «probar diferentes versiones de sistemas operativos sin comprometer el hardware físico». Y además: <strong>instantáneas</strong> (guardar el estado y volver atrás si rompes algo), entornos de pruebas idénticos para todo un equipo y servidores que se mueven de una máquina física a otra.</p>
        <EnClase fecha="30/09">
          <p>En la presentación del módulo: «haremos máquinas virtuales», para probar otros sistemas, como Linux, y experimentar con la configuración sin tocar el sistema anfitrión. La mayoría del grupo usa Windows.</p>
        </EnClase>
      </Bloque>

      <Bloque id="activar" titulo="Activar la virtualización">
        <p>Los procesadores modernos tienen instrucciones para virtualizar: <strong>Intel VT-x</strong> y <strong>AMD-V</strong> (en la BIOS de AMD suele llamarse <strong>SVM Mode</strong>). Vienen a menudo desactivadas de fábrica. Para comprobarlo:</p>
        <ul>
          <li><strong>Windows</strong>: <em>Administrador de tareas › Rendimiento › CPU</em>, línea «Virtualización: Habilitado».</li>
          <li><strong>Linux</strong>: <code>grep -E -c 'vmx|svm' /proc/cpuinfo</code> (si da más de 0, la CPU la soporta).</li>
        </ul>
        <p>Si pone «Deshabilitado», entra en la BIOS/UEFI (<a href={enlace('montaje', 'bios')}>lámina 08</a>), busca en <em>Advanced › CPU Configuration</em> la opción <strong>Intel Virtualization Technology</strong> o <strong>SVM Mode</strong>, actívala, guarda con F10 y reinicia. Haz captura: la plantilla puntúa «activa la virtualización en el firmware».</p>
        <EnClase fecha="14/10">
          <p>Al presentar la BIOS: «un programa sencillo de menús donde puedes configurar fecha y hora, overclocking si se pudiera, <strong>activar la virtualización</strong>, el orden de arranque…». Y entre las mejoras de cada generación de Intel citó «una nueva forma de virtualizar».</p>
        </EnClase>
      </Bloque>

      <Bloque id="recursos" titulo="Repartir el equipo">
        <p>La RAM y los núcleos que das a una VM se los quitas al anfitrión mientras está encendida. Regla práctica: deja al menos 4 GB para tu sistema y no des a una sola VM más de la mitad de los hilos. Requisitos orientativos: <strong>Windows 11</strong>, 4 GB de RAM, 2 núcleos, 64 GB de disco, UEFI con Secure Boot y TPM 2.0; <strong>Ubuntu Desktop</strong>, 4 GB recomendados y unos 25 GB de disco.</p>
        <Planificador />
        <p>Con 8 GB de RAM en el anfitrión, enciende las máquinas de una en una. El disco virtual «reservado dinámicamente» solo ocupa lo que se usa, así que 64 GB no se gastan de golpe.</p>
      </Bloque>

      <Bloque id="virtualbox" titulo="Paso a paso en VirtualBox">
        <ol>
          <li><strong>Instalar</strong>: descarga VirtualBox de virtualbox.org (paquete para Windows o Linux) e instálalo con las opciones por defecto. Anota la versión para el manual.</li>
          <li><strong>Nueva máquina</strong>: <em>Máquina › Nueva</em>. Nombre, carpeta, ISO (la que da el profesor), tipo y versión. <strong>Marca «Omitir instalación desatendida»</strong>: así haces tú cada paso y lo puedes documentar.</li>
          <li><strong>Hardware</strong>: memoria y procesadores según el panel de arriba. Para Windows 11, activa EFI; VirtualBox 7 añade el TPM 2.0 al elegir esa versión.</li>
          <li><strong>Disco duro virtual</strong>: crear uno nuevo, formato VDI, reservado dinámicamente, del tamaño que pide el sistema.</li>
          <li><strong>Arrancar</strong>: la VM arranca desde la ISO como un PC desde un USB. Sigue el instalador: idioma, teclado, disco (en una VM puedes usar el disco entero), usuario y contraseña.</li>
          <li><strong>Guest Additions</strong>: con la VM en marcha, <em>Dispositivos › Insertar imagen de CD de las Guest Additions</em> e instálalas. Dan resolución adaptable, portapapeles compartido y mejor rendimiento.</li>
          <li><strong>Instantánea</strong>: con el sistema recién instalado y actualizado, <em>Máquina › Tomar instantánea</em>. Es tu punto de restauración.</li>
        </ol>
        <p>Red: por defecto, <strong>NAT</strong>; la VM sale a Internet a través del anfitrión y no hace falta tocar nada. Para el manual, haz una captura de cada pantalla de configuración con los valores que elegiste.</p>
        <ParaElReto>
          <p>«Varias máquinas virtuales funcionales con distintos S.O.» y «manual de los sistemas operativos libres y propietarios»: lo mínimo coherente es una VM con Linux (libre) y otra con Windows (propietario). Windows se puede instalar sin clave de producto («No tengo clave de producto»); queda sin activar, con la personalización limitada, pero funciona para el reto.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="problemas" titulo="Problemas típicos">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Síntoma</th><th>Causa probable</th><th>Solución</th></tr></thead>
            <tbody>
              <tr><td>«VT-x is disabled in the BIOS» o solo deja crear VM de 32 bits</td><td>Virtualización desactivada en el firmware</td><td>Actívala en la BIOS/UEFI</td></tr>
              <tr><td>La VM va lentísima y aparece una tortuga verde en la barra</td><td>Hyper-V o WSL 2 activos en Windows; VirtualBox va por encima de ellos</td><td>Acepta la lentitud o desactiva Hyper-V en <em>Características de Windows</em> si no lo usas</td></tr>
              <tr><td>«Este PC no cumple los requisitos de Windows 11»</td><td>Falta EFI, Secure Boot, TPM o memoria</td><td>Activa EFI, da 4 GB o más y usa VirtualBox 7 o posterior</td></tr>
              <tr><td>La pantalla de la VM es diminuta y no se adapta</td><td>Faltan las Guest Additions</td><td>Instálalas y reinicia la VM</td></tr>
              <tr><td>Al reiniciar vuelve a salir el instalador</td><td>La ISO sigue montada</td><td>Quita la ISO en <em>Dispositivos › Unidades ópticas</em></td></tr>
            </tbody>
          </table>
        </div>
        <EnClase fecha="11/11">
          <p>El profesor anunció una clase de tarde dedicada a la virtualización «para que podamos cubrir la parte del reto», creando «una o dos máquinas», como adelanto de la Unidad 2. Si se graba, compara sus pasos con estos.</p>
        </EnClase>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="virtualizacion" preguntas={[
          { p: 'VirtualBox es un hipervisor…', opciones: ['De tipo 1', 'De tipo 2', 'De arranque dual', 'De red'], ok: 1, porque: 'Se instala como aplicación sobre tu sistema operativo.' },
          { p: 'En un equipo AMD, la opción de la BIOS que activa la virtualización suele llamarse…', opciones: ['XMP', 'SVM Mode', 'AHCI', 'CSM'], ok: 1, porque: 'AMD-V aparece como SVM Mode.' },
          { p: 'Tu PC tiene 8 GB de RAM. ¿Qué es razonable?', opciones: ['Dos VM de 4 GB a la vez', 'Una VM de 4 GB cada vez', 'Una VM de 8 GB', 'No se puede virtualizar'], ok: 1, porque: 'Deja al menos 4 GB para el anfitrión.' },
          { p: '¿Para qué sirve una instantánea?', opciones: ['Para hacer capturas de pantalla', 'Para volver al estado guardado si algo se rompe', 'Para clonar el hardware real', 'Para activar Windows'], ok: 1, porque: 'Guarda el estado de la VM y permite restaurarlo.' },
        ]} />
      </div>
    </>
  );
}
