import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';

export const entradilla = (
  <p>El hardware no hace nada sin <strong>software</strong>, y de todo el software hay uno que manda: el <strong>sistema operativo</strong>, el intermediario entre los programas y el hardware. En esta lámina, qué tipos de software hay, qué significa de verdad «libre» (no «gratis»), qué partes tiene un sistema operativo y cómo se comparan Windows y Linux, que es la tarea 2 del reto.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Kernel, interfaz de usuario y sistema de archivos. Gestiona procesos, memoria, almacenamiento, E/S, red y seguridad.'],
  ['Se confunde con', 'Libre y gratis. Un programa gratuito puede ser propietario (freeware) y uno libre puede venderse.'],
  ['Hábitat', 'La tarea 2 del reto: comparar arquitectura y licencias de Windows y Linux y justificar cuál conviene para desarrollar.'],
  ['Las cuatro libertades', 'Usar, estudiar y adaptar, distribuir y mejorar y publicar las mejoras.'],
];

export const secciones = [
  { id: 'tipos', titulo: 'Tres tipos de software' },
  { id: 'licencias', titulo: 'Libre frente a propietario' },
  { id: 'so', titulo: 'Qué es un sistema operativo' },
  { id: 'ejemplos', titulo: 'Familias de sistemas operativos' },
  { id: 'comparativa', titulo: 'Windows frente a Linux' },
];

// ---------- Destacado: licencias ----------
const CASOS: [string, boolean, string][] = [
  ['Linux, con licencia GPL: puedes ver el código, cambiarlo y redistribuirlo', true, 'Garantiza las cuatro libertades y además es copyleft: las versiones modificadas también deben ser libres.'],
  ['Un editor gratuito que no deja ver ni modificar su código', false, 'Freeware: gratis, pero no libre.'],
  ['Un programa que puedes probar 30 días y luego se bloquea', false, 'Demoware o trialware: software comercial con limitación.'],
  ['Una distribución Linux de empresa que se vende con soporte', true, 'Libre no significa gratis: se puede cobrar por distribuirlo y dar soporte (Red Hat Enterprise Linux).'],
  ['Windows 11', false, 'Propietario: lo usas según su licencia (EULA), sin acceso al código ni permiso para redistribuirlo.'],
  ['Una aplicación gratuita que muestra anuncios, y pagando se quitan', false, 'Adware: no libre.'],
  ['Un programa que su autor dejó en el dominio público', true, 'Sin protección alguna: cualquiera puede usarlo, modificarlo y redistribuirlo.'],
];

export function Destacado() {
  const [i, setI] = useState(0);
  const [r, setR] = useState<boolean>();
  const [c, libre, porque] = CASOS[i];
  return (
    <Panel titulo="¿Es software libre?">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--t8)' }}>Caso {i + 1} de {CASOS.length}</p>
      <p className="grande" style={{ fontSize: 19, margin: '0 0 16px' }}>{c}</p>
      <div className="opciones" role="group" aria-label="Libre o no">
        <button type="button" className="opcion" aria-pressed={r === true} onClick={() => setR(true)}>Libre</button>
        <button type="button" className="opcion" aria-pressed={r === false} onClick={() => setR(false)}>No libre</button>
      </div>
      {r !== undefined && <p className="resultado" data-ok={r === libre} aria-live="polite"><strong>{r === libre ? 'Bien.' : libre ? 'Es libre.' : 'No es libre.'}</strong> {porque}</p>}
      {r !== undefined && <div style={{ marginTop: 12 }}><Button label="Siguiente" variant="primary" size="sm" onClick={() => { setI((i + 1) % CASOS.length); setR(undefined); }} /></div>}
    </Panel>
  );
}

const COMP: [string, string, string][] = [
  ['Núcleo', 'Kernel híbrido Windows NT', 'Kernel Linux monolítico y modular (carga drivers como módulos)'],
  ['Licencia', 'Propietaria (EULA); se paga la licencia, normalmente incluida al comprar el equipo', 'Libre, GPL v2 para el kernel; la mayoría de distribuciones son gratuitas'],
  ['Código fuente', 'Cerrado', 'Abierto: se puede estudiar y modificar'],
  ['Sistema de archivos', 'NTFS (y exFAT para memorias)', 'ext4 habitualmente; también Btrfs o XFS'],
  ['Interfaz', 'Escritorio único integrado en el sistema', 'Entornos intercambiables (GNOME, KDE, XFCE…) o solo terminal'],
  ['Usuarios y permisos', 'Cuentas de administrador y estándar; Control de cuentas de usuario', 'root y usuarios; permisos rwx por usuario, grupo y otros; sudo'],
  ['Instalar software', 'Instaladores .exe/.msi, Microsoft Store, winget', 'Gestor de paquetes desde repositorios (apt, dnf), Snap, Flatpak'],
  ['Terminal', 'PowerShell, cmd', 'Bash y las herramientas Unix'],
  ['Para desarrollar', 'Visual Studio y .NET nativos; Office y mucho software comercial; WSL para tener Linux dentro', 'Servidores, Docker y la nube son Linux; herramientas libres; menos software comercial'],
];

export default function Cuerpo() {
  return (
    <>
      <Bloque id="tipos" titulo="Tres tipos de software">
        <ul>
          <li><strong>De sistema o de base</strong>: hace funcionar el hardware y lo oculta al usuario. Sistemas operativos, controladores (drivers), herramientas de diagnóstico.</li>
          <li><strong>De programación</strong>: para crear otros programas. Compiladores, intérpretes, enlazadores, depuradores, IDE.</li>
          <li><strong>De aplicación</strong>: para tareas concretas del usuario. Ofimática, bases de datos, videojuegos, CAD.</li>
        </ul>
        <p>Un <T def="Pequeño programa que permite al sistema operativo comunicarse con un dispositivo de hardware.">driver</T> o controlador es software de sistema: traduce entre el sistema operativo y un dispositivo concreto. Windows trae muchos genéricos, pero para el mejor rendimiento (sobre todo la gráfica) hay que instalar los del fabricante.</p>
      </Bloque>

      <Bloque id="licencias" titulo="Libre frente a propietario">
        <p>La confusión viene de traducir <em>free</em> como «gratis». Para el movimiento del software libre (Richard Stallman) significa <strong>libertad</strong>. Un programa es libre si garantiza cuatro libertades:</p>
        <ol start={0}>
          <li>Usarlo con cualquier propósito.</li>
          <li>Estudiar cómo funciona y adaptarlo (requiere el código fuente).</li>
          <li>Distribuir copias.</li>
          <li>Mejorarlo y publicar las mejoras.</li>
        </ol>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Libre</th><th>No libre (privativo)</th></tr></thead>
            <tbody>
              <tr><td><strong>Código abierto</strong>: se usa, copia y distribuye, original o modificado</td><td><strong>Freeware</strong>: gratis, pero sin código ni permiso para modificarlo</td></tr>
              <tr><td><strong>Dominio público</strong>: sin protección</td><td><strong>Shareware</strong>: se redistribuye, pero usarlo exige pagar licencia</td></tr>
              <tr><td><strong>Copyleft</strong> (GPL): las copias y modificaciones deben seguir siendo libres</td><td><strong>Adware</strong>, <strong>demo o trial</strong>, <strong>comercial</strong> y <strong>privado</strong> (uso interno de una empresa)</td></tr>
            </tbody>
          </table>
        </div>
      </Bloque>

      <Bloque id="so" titulo="Qué es un sistema operativo">
        <p>El <T def="Software que gestiona los recursos de hardware y da servicios a los demás programas; intermediario entre usuario y hardware.">sistema operativo</T> gestiona el hardware y da servicio a los programas: decide quién usa la CPU, cuánta memoria recibe cada uno y quién puede leer qué archivo. Tres componentes esenciales:</p>
        <ul>
          <li><strong>Kernel o núcleo</strong>: se ejecuta en modo privilegiado, arranca el sistema y controla el hardware.</li>
          <li><strong>Interfaz de usuario</strong>: gráfica (escritorio y ventanas) o textual (línea de comandos).</li>
          <li><strong>Sistema de archivos</strong>: organiza el espacio de una partición. FAT32, NTFS, ext4.</li>
        </ul>
        <p>Además se ocupa de la entrada y salida, la protección, los procesos, la memoria principal, el almacenamiento secundario, las comunicaciones y los recursos en general. Se clasifica por tareas (<strong>monotarea</strong> o <strong>multitarea</strong>), por usuarios (<strong>monousuario</strong> o <strong>multiusuario</strong>) y por recursos (<strong>centralizado</strong> o <strong>distribuido</strong>).</p>
      </Bloque>

      <Bloque id="ejemplos" titulo="Familias de sistemas operativos">
        <ul>
          <li><strong>MS-DOS</strong>: solo línea de comandos, monousuario y monotarea.</li>
          <li><strong>Windows</strong>: desde 1985; desde XP (2001), todas las versiones se basan en el núcleo NT.</li>
          <li><strong>GNU/Linux</strong>: el kernel Linux con las herramientas del proyecto GNU. Distribuciones: Ubuntu (facilidad), Debian (estabilidad), Fedora (derivada de Red Hat).</li>
          <li><strong>macOS</strong>: de Apple, basado en Unix.</li>
          <li><strong>ChromeOS</strong> y <strong>Android</strong>: de Google, ambos sobre el kernel Linux.</li>
        </ul>
        <Ojo dice="GNU/Linux es «un sistema operativo libre creado por Richard Stallman»." realidad="Stallman fundó el proyecto GNU (1983) y la licencia GPL; el kernel Linux lo creó Linus Torvalds en 1991. El sistema completo junta las dos piezas, de ahí el nombre GNU/Linux." />
        <Ojo dice="Las versiones de Windows basadas en «NT (Network Technology)» y macOS «usa HFS+»." realidad="NT significa New Technology. Y macOS usa APFS desde 2017 (macOS High Sierra); HFS+ era el sistema anterior." />
      </Bloque>

      <Bloque id="comparativa" titulo="Windows frente a Linux">
        <p>Los criterios técnicos que puedes usar en la tarea 2, con lo que hay en cada lado. Los datos son la base; la conclusión la sacas tú:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Criterio</th><th>Windows</th><th>Linux</th></tr></thead>
            <tbody>{COMP.map(([c, w, l]) => <tr key={c}><td><strong>{c}</strong></td><td>{w}</td><td>{l}</td></tr>)}</tbody>
          </table>
        </div>
        <ParaElReto>
          <p>La plantilla pide comparar «<strong>arquitectura</strong> y <strong>modelo de licencia</strong> con criterios técnicos» y «justificar la elección para un entorno de desarrollo». Las primeras filas de la tabla son la arquitectura; la segunda y la tercera, la licencia. En la lámina del reto tienes una matriz para pesar los criterios.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="software" preguntas={[
          { p: 'Un compilador es software…', opciones: ['De sistema', 'De programación', 'De aplicación', 'Firmware'], ok: 1, porque: 'Sirve para crear otros programas.' },
          { p: '¿Qué libertad exige tener el código fuente?', opciones: ['La 0, usarlo', 'La 1, estudiarlo y adaptarlo', 'La 2, distribuirlo', 'Ninguna'], ok: 1, porque: 'No puedes estudiar ni adaptar lo que no puedes leer.' },
          { p: 'Un programa gratuito sin acceso al código es…', opciones: ['Software libre', 'Freeware', 'Copyleft', 'Dominio público'], ok: 1, porque: 'Gratis no es libre.' },
          { p: '¿Quién creó el kernel Linux?', opciones: ['Richard Stallman', 'Linus Torvalds', 'Microsoft', 'Canonical'], ok: 1, porque: 'Torvalds, en 1991. Stallman creó el proyecto GNU.' },
          { p: 'El sistema de archivos habitual de Linux es…', opciones: ['NTFS', 'ext4', 'FAT32', 'APFS'], ok: 1, porque: 'ext4; NTFS es el de Windows y APFS, el de macOS.' },
        ]} />
      </div>
    </>
  );
}
