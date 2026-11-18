import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { CheckboxInput } from '@astryxdesign/core/CheckboxInput';
import { Slider } from '@astryxdesign/core/Slider';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, guardar, leer } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Una empresa de desarrollo de software renueva sus estaciones de trabajo. Te toca <strong>montar los equipos</strong> (de verdad o en un simulador), <strong>configurar la BIOS/UEFI</strong>, <strong>comparar Windows y Linux</strong> para programar y <strong>crear máquinas virtuales</strong> con varios sistemas operativos. Lo que entregas son dos documentos en uno: el inventario de hardware y el manual de instalación. Aquí tienes cada pieza preparada para rellenarla tú, sin solución para copiar.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Entrega', <>La plataforma marca el <strong>viernes 20 de noviembre de 2026, 23:59</strong>. El profesor pide subir ese día lo que tengas y <strong>avisar por correo</strong> cuando sea tu versión final: hasta entonces no lo corrige.</>],
  ['Peso', '25 % de la nota de retos; todos los retos del módulo pesan igual. Los retos son el 70 % del módulo, así que este reto vale 17,5 puntos de cada 100 de la nota final.'],
  ['Evalúa', 'RA1 (hardware y puesta en marcha) y RA2 (sistemas operativos y virtualización).'],
  ['Entregable', 'Inventario de hardware y manual de instalación documentado de los sistemas operativos, libres y propietarios.'],
];

export const secciones = [
  { id: 'enunciado', titulo: 'Qué piden exactamente' },
  { id: 'plan', titulo: 'Plan y estrategia de entrega' },
  { id: 'tarea1', titulo: 'Tarea 1 · Inventario y montaje' },
  { id: 'bios', titulo: 'Tarea 1 · La BIOS/UEFI justificada' },
  { id: 'tarea2', titulo: 'Tarea 2 · Windows frente a Linux' },
  { id: 'tarea3', titulo: 'Tarea 3 · El manual de virtualización' },
  { id: 'documento', titulo: 'Cómo montar el documento' },
  { id: 'entrega', titulo: 'Lista de entrega' },
];

// ---------- Destacado: plantilla de corrección ----------
const CRITERIOS = [
  { n: 'Hardware y puesta en marcha (RA1)', max: 3.5, ev: [['Identifica cada componente y su función', 1], ['Montaje en el orden correcto, con capturas', 1], ['BIOS/UEFI con parámetros justificados', 1], ['Inventario de hardware completo', 0.5]] },
  { n: 'Arquitectura y licencias de S.O. (RA2)', max: 2.5, ev: [['Compara la arquitectura de Windows y Linux', 1], ['Compara sus modelos de licencia', 0.75], ['Justifica cuál elegir para desarrollar', 0.75]] },
  { n: 'Virtualización (RA2)', max: 4, ev: [['Hipervisor instalado', 0.75], ['Virtualización activada en el firmware, con captura', 0.75], ['Varias VM funcionales con distintos S.O.', 1.5], ['Manual reproducible paso a paso', 1]] },
] as const;

export function Destacado() {
  const [h, setH] = useState<string[]>(() => leer('rubrica', []));
  const t = (k: string, v: boolean) => { const x = v ? [...h, k] : h.filter((y) => y !== k); setH(x); guardar('rubrica', x); };
  const nota = CRITERIOS.reduce((s, c, i) => s + c.ev.reduce((a, [, p], j) => a + (h.includes(`${i}-${j}`) ? p : 0), 0), 0);
  return (
    <Panel titulo="¿Cuánto sacarías hoy?">
      <div style={{ display: 'grid', gap: 16 }}>
        {CRITERIOS.map((c, i) => (
          <fieldset key={c.n} style={{ border: 0, margin: 0, padding: 0 }}>
            <legend style={{ font: '700 15px var(--f-titulo)', marginBottom: 6 }}>{c.n} · {c.max} pt</legend>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
              {c.ev.map(([e, p], j) => <li key={e}><CheckboxInput label={`${e} (${String(p).replace('.', ',')})`} value={h.includes(`${i}-${j}`)} onChange={(v: boolean) => t(`${i}-${j}`, v)} /></li>)}
            </ul>
          </fieldset>
        ))}
      </div>
      <p className="resultado" style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }} aria-live="polite">
        <span className="grande" style={{ fontSize: 30, color: nota >= 5 ? 'var(--verde)' : 'var(--rojo)' }}>{String(nota).replace('.', ',')}/10</span>
        <span>Los máximos (3,5 · 2,5 · 4) son los de la plantilla oficial; el reparto dentro de cada bloque es orientativo. La virtualización es lo que más pesa.</span>
      </p>
    </Panel>
  );
}

// ---------- Inventario ----------
const CAMPOS: [string, string, string][] = [
  ['cpu', 'Procesador', 'Modelo, socket, núcleos/hilos, frecuencia base y turbo, caché, TDP'],
  ['placa', 'Placa base', 'Modelo, factor de forma, chipset, socket, ranuras RAM y de expansión, M.2'],
  ['ram', 'Memoria RAM', 'Tipo (DDR4/DDR5), capacidad total, módulos, frecuencia, latencia CL, Dual Channel'],
  ['disco', 'Almacenamiento', 'Tipo (SSD NVMe, SATA, HDD), interfaz, capacidad'],
  ['gpu', 'Gráfica', 'Integrada o dedicada; modelo, VRAM, conectores'],
  ['psu', 'Fuente', 'Potencia (W), certificación, conectores'],
  ['caja', 'Caja y refrigeración', 'Formato, disipador de CPU, ventiladores'],
  ['red', 'Red y periféricos', 'Ethernet/Wi-Fi, monitor, teclado, ratón'],
];

function Inventario() {
  const [d, setD] = useState<Record<string, string>>(() => leer('inventario', {}));
  const [copiado, setCopiado] = useState(false);
  const fijar = (k: string, v: string) => { const x = { ...d, [k]: v }; setD(x); guardar('inventario', x); setCopiado(false); };
  const faltan = CAMPOS.filter(([k]) => !d[k]?.trim()).map(([, n]) => n);
  const tabla = ['| Componente | Características |', '|---|---|', ...CAMPOS.map(([k, n]) => `| ${n} | ${d[k]?.trim() || '—'} |`)].join('\n');
  const copiar = async () => { try { await navigator.clipboard.writeText(tabla); setCopiado(true); } catch { setCopiado(false); } };
  return (
    <Panel titulo="Tu inventario de hardware" ancho>
      <p style={{ margin: '0 0 14px', color: 'var(--t9)' }}>Rellénalo con <strong>tu</strong> equipo (real o el del simulador). Cada línea te dice qué datos espera un inventario completo. Se guarda en este navegador.</p>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {CAMPOS.map(([k, n, ayuda]) => <TextInput key={k} label={n} description={ayuda} value={d[k] ?? ''} onChange={(v: string) => fijar(k, v)} />)}
      </div>
      <p className="resultado" data-ok={faltan.length === 0} style={{ marginTop: 16 }} aria-live="polite">
        {faltan.length ? <>Faltan: <strong>{faltan.join(', ')}</strong>. «El inventario de hardware está completo» es parte del apto.</> : <><strong>Inventario completo.</strong> Cópialo como tabla y pégalo en tu documento; añade una columna «Función» con tus palabras.</>}
      </p>
      <div style={{ marginTop: 12 }}><Button label={copiado ? 'Copiado' : 'Copiar como tabla'} variant="primary" size="sm" onClick={copiar} /></div>
    </Panel>
  );
}

// ---------- BIOS ----------
const PARAMS: [string, string][] = [
  ['Fecha y hora', 'Los registros, certificados y compilaciones dependen de una hora correcta.'],
  ['Orden de arranque', 'Primero el USB/DVD de instalación y después el disco; al terminar, el disco primero.'],
  ['Modo SATA: AHCI', 'Los instaladores modernos detectan el disco y se aprovecha el SSD (en clase: el error «no se encuentra unidad»).'],
  ['Virtualización (Intel VT-x / AMD SVM)', 'Imprescindible para la tarea 3: sin ella el hipervisor no arranca máquinas de 64 bits.'],
  ['Arranque UEFI y Secure Boot', 'Windows 11 exige UEFI con Secure Boot; para algunas distribuciones Linux puede hacer falta desactivarlo.'],
  ['TPM 2.0 (Intel PTT / AMD fTPM)', 'Requisito de Windows 11.'],
  ['Perfil de memoria (XMP / EXPO)', 'Sin él, la RAM funciona a su velocidad básica y no a la que pagaste.'],
  ['Contraseña de supervisor', 'Evita que cualquiera cambie el arranque de un equipo de empresa.'],
  ['Curva de ventiladores', 'Silencio en el puesto de trabajo sin sobrecalentar la CPU al compilar.'],
];

function Bios() {
  const [h, setH] = useState<number[]>(() => leer('bios', []));
  const t = (i: number, v: boolean) => { const x = v ? [...h, i] : h.filter((y) => y !== i); setH(x); guardar('bios', x); };
  return (
    <Panel titulo={`Parámetros que vas a configurar y justificar: ${h.length} elegidos`} ancho>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead><tr><th></th><th>Parámetro</th><th>Por qué en una estación de desarrollo</th></tr></thead>
          <tbody>{PARAMS.map(([p, j], i) => <tr key={p}><td><CheckboxInput label={p} isLabelHidden value={h.includes(i)} onChange={(v: boolean) => t(i, v)} /></td><td><strong>{p}</strong></td><td>{j}</td></tr>)}</tbody>
        </table>
      </div>
      <p className="resultado" data-ok={h.includes(3) ? true : undefined} style={{ margin: 0 }}>
        {h.includes(3) ? <>Para cada uno que marques: captura del menú, valor que eliges y tu justificación con tus palabras. La de la virtualización la vuelves a usar en la tarea 3.</> : <>La virtualización no es opcional: la plantilla puntúa «activa la virtualización en el firmware».</>}
      </p>
    </Panel>
  );
}

// ---------- Comparativa ----------
const CRIT = ['Licencia y coste', 'Arquitectura del núcleo', 'Terminal y herramientas de desarrollo', 'Compatibilidad con el software del curso', 'Requisitos y consumo de recursos', 'Seguridad y permisos', 'Actualizaciones y soporte', 'Drivers y hardware'];

function Comparativa() {
  const [p, setP] = useState<number[]>(() => leer('cmp-peso', CRIT.map(() => 2)));
  const [w, setW] = useState<number[]>(() => leer('cmp-win', CRIT.map(() => 3)));
  const [l, setL] = useState<number[]>(() => leer('cmp-lin', CRIT.map(() => 3)));
  const set = (arr: number[], f: (x: number[]) => void, k: string, i: number, v: number) => { const x = arr.map((y, j) => (j === i ? v : y)); f(x); guardar(k, x); };
  const tot = (a: number[]) => a.reduce((s, v, i) => s + v * p[i], 0);
  const tw = tot(w), tl = tot(l);
  return (
    <Panel titulo="Tu matriz de decisión" ancho>
      <p style={{ margin: '0 0 14px', color: 'var(--t9)' }}>Da a cada criterio un peso (lo que importa en <em>esta</em> empresa) y puntúa cada sistema de 1 a 5. Las notas las decides tú con lo que has investigado: la matriz solo hace la cuenta.</p>
      <div className="tabla-scroll">
        <table className="tabla">
          <thead><tr><th>Criterio</th><th>Peso (0-3)</th><th>Windows (1-5)</th><th>Linux (1-5)</th></tr></thead>
          <tbody>
            {CRIT.map((c, i) => (
              <tr key={c}>
                <td><strong>{c}</strong></td>
                <td style={{ minWidth: 120 }}><Slider label={`Peso de ${c}: ${p[i]}`} isLabelHidden value={p[i]} onChange={(v: number) => set(p, setP, 'cmp-peso', i, v)} min={0} max={3} step={1} valueDisplay="text" /></td>
                <td style={{ minWidth: 130 }}><Slider label={`Windows en ${c}: ${w[i]}`} isLabelHidden value={w[i]} onChange={(v: number) => set(w, setW, 'cmp-win', i, v)} min={1} max={5} step={1} valueDisplay="text" /></td>
                <td style={{ minWidth: 130 }}><Slider label={`Linux en ${c}: ${l[i]}`} isLabelHidden value={l[i]} onChange={(v: number) => set(l, setL, 'cmp-lin', i, v)} min={1} max={5} step={1} valueDisplay="text" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="resultado" aria-live="polite" style={{ margin: 0 }}>
        Windows <strong>{tw}</strong> · Linux <strong>{tl}</strong>. {tw === tl ? 'Empate: tu justificación tiene que inclinar la balanza.' : `Con tus pesos gana ${tw > tl ? 'Windows' : 'Linux'}.`} La nota no se la llevan los números, sino la frase que explique cada uno.
      </p>
    </Panel>
  );
}

// ---------- Lista de entrega ----------
const LISTA = [
  'Portada con tu nombre, módulo y «Reto 1 · The Build»',
  'Inventario completo, con la función de cada componente',
  'Montaje en orden (real o simulador), con capturas de cada paso',
  'BIOS/UEFI: capturas, valores y justificación de cada parámetro',
  'Virtualización activada en el firmware, con captura',
  'Comparativa Windows/Linux: arquitectura, licencias y elección justificada',
  'Hipervisor instalado, con versión',
  'Al menos dos VM con S.O. distintos (uno libre y uno propietario) arrancando',
  'Manual de instalación paso a paso, que otra persona podría repetir',
  'Primera versión subida a la plataforma antes del 20/11 a las 23:59',
  'Correo al profesor indicando que es tu versión final, cuando lo sea',
];

function ListaEntrega() {
  const [h, setH] = useState<number[]>(() => leer('lista-reto', []));
  const t = (i: number, v: boolean) => { const x = v ? [...h, i] : h.filter((y) => y !== i); setH(x); guardar('lista-reto', x); };
  return (
    <Panel titulo={`Lista de entrega: ${h.length} de ${LISTA.length}`}>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
        {LISTA.map((l, i) => <li key={l}><CheckboxInput label={l} value={h.includes(i)} onChange={(v: boolean) => t(i, v)} /></li>)}
      </ul>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="enunciado" titulo="Qué piden exactamente">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tarea</th><th>Qué hacer</th><th>Puntos</th><th>Láminas</th></tr></thead>
            <tbody>
              <tr><td><strong>1 · Hardware y check-up</strong> (RA1)</td><td>Identificar y ensamblar CPU, RAM y almacenamiento; ponerlo en marcha y configurar la BIOS/UEFI. Montaje real o virtual.</td><td>3,5</td><td><a href={enlace('procesador')}>02</a>–<a href={enlace('fuente')}>06</a> · <a href={enlace('montaje')}>08</a></td></tr>
              <tr><td><strong>2 · Arquitectura de S.O.</strong> (RA2)</td><td>Comparar arquitectura y licencias de Windows y Linux y justificar cuál es más eficiente para desarrollar.</td><td>2,5</td><td><a href={enlace('software')}>07</a></td></tr>
              <tr><td><strong>3 · Virtualización</strong> (RA2)</td><td>Instalar un hipervisor (VirtualBox, VMware…), activar la virtualización en la BIOS/UEFI y crear varias VM con distintos S.O. Las ISO las da el profesor.</td><td>4</td><td><a href={enlace('virtualizacion')}>09</a></td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>Montaje real o virtual:</strong> si tienes un equipo para desmontar, úsalo; si no, un simulador: <strong>PC Building Simulator</strong> (videojuego) o <strong>BuildCores</strong> (buildcores.com, en el navegador). <strong>Entregable:</strong> inventario de hardware y manual de instalación de los sistemas operativos, libres y propietarios.</p>
        <p><strong>Rúbrica global:</strong> excelente (9-10) con montaje y BIOS impecables, comparativa rigurosa y entorno virtual completo; bien (7-8) si todo funciona y la documentación es mejorable; suficiente (5-6) si arranca y las VM funcionan pero confundes componentes o el manual está incompleto; insuficiente si no identificas lo básico, no instalas un S.O. o no entregas inventario y manual.</p>
        <Ojo dice="El reto de la Unidad 1 pide comparar sistemas operativos y crear máquinas virtuales." realidad="El temario de la Unidad 1 solo dedica unas páginas a los sistemas operativos (§5 y §8) y no trata la virtualización en ningún apartado. El propio profesor lo reconoció: «los alumnos y el profesor no han llegado a la parte de sistemas operativos». La lámina 09 cubre ese hueco con lo que el reto necesita." />
      </Bloque>

      <Bloque id="plan" titulo="Plan y estrategia de entrega">
        <ol>
          <li><strong>Hoy:</strong> activa la virtualización en tu BIOS/UEFI e instala VirtualBox. Es lo que más puntúa y lo único que puede atascarse.</li>
          <li><strong>Inventario:</strong> saca los datos de tu equipo o de la configuración del simulador y rellena el panel de la tarea 1.</li>
          <li><strong>Montaje:</strong> en el simulador, haz una captura por paso siguiendo el orden de la <a href={enlace('montaje', 'orden')}>lámina 08</a>.</li>
          <li><strong>Máquinas virtuales:</strong> una Linux (Ubuntu) y una Windows, apuntando cada paso mientras instalas: el manual se escribe a la vez, no después.</li>
          <li><strong>Comparativa:</strong> la matriz de la tarea 2 y un párrafo de conclusión.</li>
          <li><strong>Viernes 20:</strong> sube lo que tengas. Cuando esté terminado, correo al profesor: «esta es mi versión final del Reto 1».</li>
        </ol>
        <EnClase fecha="11/11">
          <p>Sobre las fechas: «para el 20 […] entregadme lo que hayáis hecho. Eso yo no lo voy a corregir a no ser que alguien me escriba un correo y me diga: oye, lo que te subí ya es mi versión final». Prometió explicar la virtualización en una clase de tarde, «una o dos máquinas, como un adelanto de la unidad 2». Pide no dejarlo todo para final de curso.</p>
        </EnClase>
        <EnClase fecha="28/10">
          <p>«El reto de hardware es muy extenso.» Como no todo el mundo tiene un equipo viejo que desmontar, puso la opción del simulador; si alguien prefiere montaje físico, «no hay problema». Compartió PC Building Simulator por Drive.</p>
        </EnClase>
      </Bloque>

      <Bloque id="tarea1" titulo="Tarea 1 · Inventario y montaje">
        <p>Para sacar los datos de un equipo real: en Windows, <strong>CPU-Z</strong> y <strong>GPU-Z</strong> (las usó el profesor en clase), <em>Administrador de tareas › Rendimiento</em> o <code>msinfo32</code>; en Linux, <code>lscpu</code>, <code>free -h</code> y <code>lsblk</code>. En el simulador, la ficha de cada pieza que eliges.</p>
        <Inventario />
        <ParaElReto>
          <p>«Identifica cada componente <em>y su función</em>.» No basta con el modelo: añade una frase por pieza (qué hace y por qué la elegiste para un programador). Los criterios de elección están en las láminas <a href={enlace('procesador')}>02</a> a <a href={enlace('fuente')}>06</a>; el cálculo de la fuente, en la <a href={enlace('fuente', 'potencia')}>06</a>.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="bios" titulo="Tarea 1 · La BIOS/UEFI justificada">
        <p>«Configura la BIOS/UEFI con <strong>parámetros justificados</strong>.» Elige los que vas a tocar; para cada uno, el documento necesita captura, valor y motivo. Entras pulsando <kbd>Supr</kbd>, <kbd>F2</kbd> u otra tecla al encender (la <a href={enlace('montaje', 'bios')}>lámina 08</a> lo explica). En Windows 11 también llegas por <em>Configuración › Recuperación › Inicio avanzado › Configuración de firmware UEFI</em>.</p>
        <Bios />
      </Bloque>

      <Bloque id="tarea2" titulo="Tarea 2 · Windows frente a Linux">
        <p>Dos ejes que la plantilla nombra: <strong>arquitectura</strong> (núcleo, sistema de archivos, interfaz, gestión de permisos) y <strong>licencia</strong> (propietario frente a libre y GPL). La teoría está en la <a href={enlace('software', 'comparativa')}>lámina 07</a>. Aquí decides tú:</p>
        <Comparativa />
        <p>Para «justificar la elección para un entorno de desarrollo» no vale «Linux es mejor»: di para qué desarrollo. En DAM programarás en C#, Java y Android, y más adelante servidores y bases de datos. Una conclusión honesta puede ser mixta (por ejemplo, un sistema en el equipo y el otro en máquina virtual), siempre que la argumentes.</p>
      </Bloque>

      <Bloque id="tarea3" titulo="Tarea 3 · El manual de virtualización">
        <p>«El manual de instalación es <strong>reproducible paso a paso</strong>»: alguien que no te conoce tiene que poder repetirlo. Para cada máquina virtual, el mismo esquema:</p>
        <ol>
          <li><strong>Requisitos</strong> del sistema y del anfitrión (RAM, CPU, disco libre).</li>
          <li><strong>ISO</strong>: cuál, versión y de dónde sale (la da el profesor).</li>
          <li><strong>Crear la VM</strong>: nombre, tipo, memoria, CPU, disco (tamaño y tipo), EFI y TPM si es Windows 11.</li>
          <li><strong>Instalación</strong>: idioma, particionado, usuario y contraseña (sin escribir contraseñas reales en el documento).</li>
          <li><strong>Después</strong>: Guest Additions, actualizaciones y una instantánea.</li>
          <li><strong>Prueba</strong>: captura de las dos máquinas arrancadas.</li>
        </ol>
        <p>Cómo se hace cada paso y cuánta RAM dar a cada máquina sin ahogar tu PC: <a href={enlace('virtualizacion')}>lámina 09</a>.</p>
      </Bloque>

      <Bloque id="documento" titulo="Cómo montar el documento">
        <ol>
          <li><strong>Portada</strong> e índice.</li>
          <li><strong>Inventario de hardware</strong>: la tabla, con la función de cada componente.</li>
          <li><strong>Montaje</strong>: los pasos en orden, con capturas, y las medidas de seguridad.</li>
          <li><strong>BIOS/UEFI</strong>: parámetro, captura, valor y justificación.</li>
          <li><strong>Comparativa de sistemas operativos</strong>: arquitectura, licencias, tu matriz y la conclusión.</li>
          <li><strong>Manual de virtualización</strong>: hipervisor y una sección por cada VM.</li>
          <li><strong>Conclusiones</strong>: problemas que encontraste y cómo los resolviste.</li>
        </ol>
        <p>El enunciado no fija formato; un PDF con las capturas integradas es lo más seguro. Revisa que las capturas se lean y que no aparezcan datos personales ni contraseñas.</p>
      </Bloque>

      <Bloque id="entrega" titulo="Lista de entrega">
        <ListaEntrega />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="reto1" preguntas={[
          { p: '¿Qué bloque de la plantilla pesa más?', opciones: ['Hardware', 'Comparativa de S.O.', 'Virtualización', 'Todos igual'], ok: 2, porque: 'Virtualización: 4 de 10 puntos.' },
          { p: '¿Qué tienes que hacer el 20/11 si aún no has terminado?', opciones: ['Nada, ya lo entregaré', 'Subir lo que tengas y avisar por correo cuando sea la versión final', 'Pedir otra fecha', 'Entregar solo el inventario'], ok: 1, porque: 'Es lo que pidió el profesor en la clase del 11/11.' },
          { p: '¿Sin qué ajuste de la BIOS/UEFI no podrás hacer la tarea 3?', opciones: ['XMP', 'Intel VT-x / AMD SVM', 'Curva de ventiladores', 'Contraseña de supervisor'], ok: 1, porque: 'Sin virtualización por hardware el hipervisor no arranca VM de 64 bits.' },
          { p: 'Un manual «reproducible» es aquel que…', opciones: ['Tiene muchas capturas', 'Otra persona puede seguir y obtener lo mismo', 'Ocupa más de 10 páginas', 'Copia la documentación oficial'], ok: 1, porque: 'Pasos completos y en orden, con los valores que elegiste.' },
        ]} />
      </div>
    </>
  );
}
