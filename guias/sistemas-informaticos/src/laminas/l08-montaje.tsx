import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Montar un ordenador es encajar piezas en un orden que evita sustos: primero lo que va en la placa fuera de la caja, después la placa dentro y al final los cables. Al encenderlo, la placa se examina a sí misma (el POST), te deja entrar en su programa de configuración (la BIOS o UEFI) y busca dónde está el sistema operativo. Si no lo encuentra, toca instalarlo.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Destornillador imantado, pasta térmica, pulsera antiestática y el manual de la placa abierto por la página del panel frontal.'],
  ['Se confunde con', 'BIOS y POST. La BIOS/UEFI es el programa; el POST es la comprobación que hace al arrancar.'],
  ['Hábitat', 'La tarea 1 del reto: montaje en orden, con capturas, y la BIOS/UEFI configurada y justificada.'],
  ['Regla de oro', 'Nada se fuerza: todo conector encaja solo en una posición.'],
];

export const secciones = [
  { id: 'preparar', titulo: 'Antes de empezar' },
  { id: 'orden', titulo: 'El orden del montaje' },
  { id: 'seguridad', titulo: 'Seguridad y EPI' },
  { id: 'post', titulo: 'El POST y los pitidos' },
  { id: 'bios', titulo: 'BIOS y UEFI' },
  { id: 'instalar', titulo: 'Instalar un sistema operativo' },
];

// ---------- Destacado: ordenar el montaje ----------
const PASOS = ['Procesador en el zócalo de la placa', 'Pasta térmica y disipador; ventilador a CPU_FAN', 'Módulos de RAM', 'Placa base dentro de la caja, sobre los separadores', 'Fuente de alimentación', 'Tarjetas de expansión (gráfica en PCIe x16)', 'Unidades de almacenamiento', 'Cables del panel frontal (Power, Reset, LED, USB)', 'Alimentación ATX y CPU, SATA y resto de cables', 'Cerrar la caja y conectar periféricos'];
const BARAJADO = [3, 7, 0, 9, 2, 5, 1, 8, 4, 6];

export function Destacado() {
  const [o, setO] = useState<number[]>([]);
  const lleno = o.length === PASOS.length;
  const errores = o.filter((p, i) => p !== i).length;
  return (
    <Panel titulo="Ordena el montaje de los apuntes">
      <div className="opciones" role="group" aria-label="Pasos desordenados">
        {BARAJADO.map((p) => <button key={p} type="button" className="opcion" disabled={o.includes(p)} style={{ opacity: o.includes(p) ? 0.35 : 1, textAlign: 'left', borderRadius: 12 }} onClick={() => setO([...o, p])}>{PASOS[p]}</button>)}
      </div>
      <ol style={{ margin: '0 0 12px', paddingLeft: 22, display: 'grid', gap: 4, fontSize: 15 }}>
        {o.map((p, i) => <li key={p} style={{ color: lleno && p !== i ? 'var(--rojo)' : 'var(--t10)' }}>{PASOS[p]}</li>)}
      </ol>
      <p className="resultado" data-ok={lleno ? errores === 0 : undefined} aria-live="polite">
        {!lleno ? `Llevas ${o.length} de ${PASOS.length}.` : errores === 0 ? <><strong>Es el orden de los apuntes.</strong> CPU, disipador y RAM se ponen con la placa fuera de la caja: hay sitio y no doblas nada.</> : <><strong>{errores} pasos fuera de sitio</strong> (en rojo). Pista: lo que va pinchado en la placa, antes de meterla en la caja; los cables, al final.</>}
      </p>
      {o.length > 0 && <div style={{ marginTop: 10 }}><Button label="Volver a empezar" variant="ghost" size="sm" onClick={() => setO([])} /></div>}
    </Panel>
  );
}

// ---------- Pitidos ----------
const PITIDOS: [string, string, boolean][] = [
  ['1 corto', 'El POST ha terminado bien.', true],
  ['Continuo', 'Fallo en la fuente de alimentación.', false],
  ['Cortos y seguidos', 'Fallo en la placa base.', false],
  ['1 largo', 'La memoria RAM está defectuosa o no está instalada.', false],
  ['1 largo y 2 cortos', 'La tarjeta gráfica está defectuosa o no está instalada.', false],
];

function Pitidos() {
  const [i, setI] = useState<number>();
  return (
    <Panel titulo="¿Qué te dice la placa?">
      <div className="opciones" role="group" aria-label="Secuencia de pitidos">
        {PITIDOS.map(([p], k) => <button key={p} type="button" className="opcion" aria-pressed={i === k} onClick={() => setI(k)}>{p}</button>)}
      </div>
      {i !== undefined && <p className="resultado" data-ok={PITIDOS[i][2]} aria-live="polite"><strong>{PITIDOS[i][0]}:</strong> {PITIDOS[i][1]}</p>}
      <p style={{ margin: '12px 0 0', fontSize: 14, color: 'var(--t8)' }}>Tabla de los apuntes. Los códigos cambian según el fabricante de la BIOS (AMI, Award, Phoenix): ante la duda, el manual de la placa. Y para oírlos hace falta el altavoz interno (speaker), que hoy muchas cajas no traen.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="preparar" titulo="Antes de empezar">
        <p>Los apuntes piden cuatro cosas: un sitio <strong>amplio, ordenado y bien iluminado</strong>; la <strong>documentación</strong> de cada componente a mano (y comprobar que son compatibles entre sí); trabajar <strong>sin corriente</strong> y descargando la electricidad estática, y un <strong>plan de trabajo</strong> en el que vayas apuntando cada conexión.</p>
        <p>Herramientas: destornillador de estrella (mejor imantado), pasta térmica, alcohol isopropílico para limpiar la pasta vieja, bridas, alicates, pinzas, guantes, pulsera antiestática y el manual de la placa, sobre todo para los pines del panel frontal.</p>
      </Bloque>

      <Bloque id="orden" titulo="El orden del montaje">
        <ol>
          <li><strong>Procesador</strong>: levanta la palanca del zócalo, haz coincidir las muescas (o el triángulo de la esquina) y déjalo caer. Sin presionar.</li>
          <li><strong>Disipador</strong>: una gota de pasta térmica en el centro del procesador; el disipador la extiende al apretarlo. Su cable, a <code>CPU_FAN</code>.</li>
          <li><strong>RAM</strong>: abre las pestañas, alinea la muesca y aprieta hasta el «clac». Para Dual Channel, en las ranuras que indique el manual.</li>
          <li><strong>Placa en la caja</strong>: sobre los separadores, con los conectores traseros asomando por la plantilla.</li>
          <li><strong>Fuente</strong>: atornillada por detrás (en algunas cajas se pone al final).</li>
          <li><strong>Tarjetas de expansión</strong>: la gráfica en el PCIe x16, hasta que salte la pestaña.</li>
          <li><strong>Almacenamiento</strong>: discos en sus bahías; un SSD M.2 va directamente en su ranura de la placa (mejor en el paso 3, con la placa fuera).</li>
          <li><strong>Panel frontal</strong>: Power SW, Reset SW, Power LED y HDD LED según la serigrafía; los LED tienen polaridad: si no se encienden, dale la vuelta al conector. USB frontales y audio.</li>
          <li><strong>Resto de cables</strong>: ATX de 24 pines, el de 4/8 pines de CPU, alimentación de la gráfica, SATA de datos y alimentación.</li>
          <li><strong>Cerrar</strong> y conectar teclado, ratón, monitor y corriente.</li>
        </ol>
        <ParaElReto>
          <p>En PC Building Simulator o BuildCores sigue este mismo orden y haz una captura por paso. Lo que se evalúa es «los monta en el orden correcto» y que identifiques qué es cada pieza.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="seguridad" titulo="Seguridad y EPI">
        <p>Riesgo laboral es «la posibilidad de que un trabajador sufra un determinado daño derivado de su trabajo» (Ley 31/1995). En informática, los habituales son <strong>ambientales</strong> (temperatura, polvo, humedad, iluminación, ruido) y <strong>eléctricos</strong>: picos de tensión, ruidos y distorsiones en la onda y fluctuaciones fuera del voltaje nominal (230 V en Europa). Contra los cortes y las fluctuaciones, un <strong>SAI</strong> (sistema de alimentación ininterrumpida).</p>
        <p>Equipos de protección individual (Real Decreto 773/1997): gafas, tapones si hay ruido prolongado (por ejemplo, al limpiar con compresor), guantes resistentes a cortes, calzado de protección y bata o faja si se cargan equipos pesados.</p>
      </Bloque>

      <Bloque id="post" titulo="El POST y los pitidos">
        <p>El <T def="Power On Self-Test: autocomprobación del hardware que hace la placa al encender.">POST</T> es la autocomprobación del arranque: memoria, gráfica, fuente, placa… Si algo falla, avisa con un mensaje o con una secuencia de pitidos.</p>
        <Pitidos />
        <EnClase fecha="14/10">
          <p>El profesor distinguió tres cosas que se mezclan: la <strong>BIOS</strong> es el programa; la «memoria BIOS», el chip donde vive, y el <strong>POST</strong>, el proceso que va desde que pulsas el botón hasta que el sistema operativo está cargado.</p>
        </EnClase>
      </Bloque>

      <Bloque id="bios" titulo="BIOS y UEFI">
        <p>La <T def="Basic Input/Output System: firmware de la placa que comprueba el hardware, guarda la configuración y arranca el sistema operativo.">BIOS</T> es el firmware de la placa. Su programa de configuración, el <strong>Setup</strong>, guarda los ajustes en memoria flash o en una CMOS alimentada por la <strong>pila</strong> de la placa. Se entra pulsando una tecla nada más encender: <kbd>Supr</kbd> en sobremesas, <kbd>F2</kbd> en portátiles, o <kbd>F1</kbd>, <kbd>F10</kbd>, <kbd>Esc</kbd> según el fabricante.</p>
        <p>Menús habituales: configuración básica (fecha, hora, discos), avanzada (CPU, virtualización, orden de arranque), chipset, periféricos integrados, energía y seguridad (contraseñas de supervisor y de usuario). <strong>UEFI</strong> es su sucesora: interfaz gráfica con ratón, arranque más rápido, discos GPT de más de 2 TB y <strong>Secure Boot</strong>.</p>
        <EnClase fecha="04/11">
          <p>Caso práctico: el instalador de Windows dice que no encuentra ningún disco. Causa típica: el modo SATA de la BIOS está en IDE; hay que ponerlo en <strong>AHCI</strong>.</p>
        </EnClase>
        <ParaElReto>
          <p>Los parámetros que conviene tocar y justificar en el reto (virtualización, orden de arranque, AHCI, Secure Boot, TPM, XMP…) están en la <a href={enlace('reto1', 'bios')}>lámina 10</a>.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="instalar" titulo="Instalar un sistema operativo">
        <p>Tras el POST, el firmware busca el arranque en el orden configurado. En el esquema clásico lee el <strong>MBR</strong>, los primeros 512 bytes del disco, con la tabla de particiones y un pequeño programa que llama al gestor de arranque del sistema (NTLDR o Windows Boot Manager en Windows, GRUB en Linux). Los pasos de la instalación:</p>
        <ol>
          <li>Comprobar los <strong>requisitos</strong> mínimos (obligatorios) y recomendados.</li>
          <li>Poner primero en el <strong>orden de arranque</strong> el USB o DVD de instalación.</li>
          <li>Preparar el disco: <strong>particiones</strong> y formato (sistema de archivos).</li>
          <li>Ejecutar el instalador.</li>
          <li>Crear los usuarios.</li>
          <li>Configurar la red.</li>
          <li>Reiniciar, quitar el medio de instalación, actualizar e instalar los drivers que falten.</li>
        </ol>
        <p>Particiones en MBR: como máximo <strong>cuatro primarias</strong>, o tres más una <strong>extendida</strong> que contiene particiones <strong>lógicas</strong>. La que arranca es la <strong>activa</strong>. Para arranque dual, primero Windows y después Linux: GRUB se instala encima y te deja elegir.</p>
        <Ojo dice="El tema solo explica el MBR y el límite de cuatro particiones primarias." realidad="Los equipos actuales con UEFI usan GPT: hasta 128 particiones, sin primarias ni extendidas, y discos de más de 2 TB. Windows 11 exige UEFI y, por tanto, GPT. El MBR sigue en equipos antiguos o en modo «Legacy/CSM»." />
        <Ojo dice="Requisitos mínimos: Windows 10, 1 GHz, 2 GB y 32 GB; Ubuntu, 700 MHz, 512 MB y 5 GB. Y en Linux «el usuario administrador siempre tendrá el nombre de root»." realidad="Esa tabla es antigua y no incluye Windows 11 (4 GB de RAM, 64 GB de disco, TPM 2.0 y Secure Boot). Ubuntu Desktop actual recomienda 4 GB y unos 25 GB. Y Ubuntu no te pide contraseña para root: crea tu usuario con permisos de administrador mediante sudo." />
        <Ojo dice="Tras instalar, instalar plugins del navegador «Java, Flash Player»." realidad="Flash dejó de existir en 2021 y los navegadores ya no admiten plugins de Java. Hoy el paso es: actualizar el sistema, instalar los drivers y el software que vayas a usar." />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="montaje" preguntas={[
          { p: '¿Qué va antes?', opciones: ['Meter la placa en la caja', 'Poner el procesador en la placa', 'Conectar el panel frontal', 'Conectar el ATX de 24 pines'], ok: 1, porque: 'CPU, disipador y RAM se montan con la placa fuera de la caja.' },
          { p: 'Un pitido corto al encender significa…', opciones: ['Fallo de RAM', 'POST correcto', 'Fallo de fuente', 'Fallo de gráfica'], ok: 1, porque: 'El POST ha terminado sin problemas.' },
          { p: 'El LED de encendido no se ilumina tras montar. ¿Qué pruebas primero?', opciones: ['Cambiar la fuente', 'Dar la vuelta al conector del Power LED', 'Reinstalar Windows', 'Cambiar la RAM'], ok: 1, porque: 'Los LED tienen polaridad.' },
          { p: '¿Qué conserva la configuración de la BIOS con el equipo desenchufado?', opciones: ['La RAM', 'La pila de la placa (CMOS) o la flash', 'El disco duro', 'La caché'], ok: 1, porque: 'Los ajustes se guardan en flash o en CMOS alimentada por la pila.' },
          { p: 'Para un arranque dual Windows y Linux, ¿qué instalas primero?', opciones: ['Linux', 'Windows', 'Da igual', 'GRUB'], ok: 1, porque: 'Después Linux instala GRUB, que ofrece elegir entre los dos.' },
        ]} />
      </div>
    </>
  );
}
