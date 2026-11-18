import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { fuente } from '../calc.ts';

export const entradilla = (
  <p>La <strong>fuente de alimentación</strong> convierte los 230 V alternos del enchufe en las tensiones continuas bajas que necesitan los componentes, y los protege por el camino. Las <strong>tarjetas de expansión</strong> añaden o mejoran funciones del equipo: la gráfica es la reina, pero también hay de red, de sonido o capturadoras. Elegir mal la fuente o una tarjeta que no cabe son dos errores clásicos de montaje.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Fuente: caja metálica con ventilador, interruptor y un mazo de cables (ATX 24, CPU 8, PCIe, SATA). Tarjeta: placa pinchada en una ranura PCIe.'],
  ['Se confunde con', 'Potencia y consumo. Una fuente de 750 W no gasta 750 W: es lo máximo que puede dar.'],
  ['Hábitat', 'La fuente, abajo o arriba al fondo de la caja. Las tarjetas, en las ranuras de expansión.'],
  ['Regla de clase', 'Suma de consumos más un 10-15 % de margen.'],
];

export const secciones = [
  { id: 'funciona', titulo: 'Cómo funciona una fuente' },
  { id: 'potencia', titulo: 'Calcular la potencia' },
  { id: 'conectores', titulo: 'Conectores de la fuente' },
  { id: 'grafica', titulo: 'La tarjeta gráfica' },
  { id: 'otras', titulo: 'Otras tarjetas y periféricos' },
];

// ---------- Destacado: calculadora ----------
export function Destacado() {
  const [cpu, setCpu] = useState(125);
  const [gpu, setGpu] = useState(200);
  const [discos, setDiscos] = useState(2);
  const [margen, setMargen] = useState(15);
  const base = 60;
  const r = fuente([cpu, gpu, base, discos * 8], margen / 100);
  return (
    <Panel titulo="¿Qué fuente necesita este equipo?">
      <div style={{ display: 'grid', gap: 10 }}>
        <Slider label={`Procesador (TDP): ${cpu} W`} value={cpu} onChange={(v: number) => setCpu(v)} min={35} max={253} step={1} valueDisplay="none" />
        <Slider label={`Gráfica: ${gpu === 0 ? 'integrada, 0 W' : `${gpu} W`}`} value={gpu} onChange={(v: number) => setGpu(v)} min={0} max={450} step={5} valueDisplay="none" />
        <Slider label={`Discos y unidades: ${discos} (unos 8 W cada uno)`} value={discos} onChange={(v: number) => setDiscos(v)} min={1} max={6} step={1} valueDisplay="none" />
        <Slider label={`Margen: ${margen} %`} value={margen} onChange={(v: number) => setMargen(v)} min={0} max={30} step={5} valueDisplay="none" />
      </div>
      <p style={{ margin: '14px 0 4px', color: 'var(--t9)' }}>Consumo estimado: {r.total} W (incluye {base} W de placa, RAM y ventiladores) · con margen: {r.minimo} W</p>
      <p className="grande" style={{ fontSize: 30, margin: 0 }}>Fuente de {r.comercial} W</p>
      <p className="resultado" data-ok={margen >= 10} style={{ marginTop: 12 }}>{margen < 10 ? 'Sin margen, la fuente trabaja al límite en los picos de carga: más calor, más ruido y menos vida.' : 'El margen cubre los picos de consumo y deja la fuente en su zona más eficiente.'}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="funciona" titulo="Cómo funciona una fuente">
        <p>La fuente recibe corriente <strong>alterna</strong> de la red (230 V en Europa) y entrega corriente <strong>continua</strong> a +12 V, +5 V y +3,3 V. Lo hace en cuatro pasos:</p>
        <ol>
          <li><strong>Transformación</strong>: baja el voltaje.</li>
          <li><strong>Rectificación</strong>: convierte la alterna en continua (pulsante).</li>
          <li><strong>Filtrado</strong>: alisa la señal.</li>
          <li><strong>Estabilización</strong>: la mantiene constante aunque cambie la carga.</li>
        </ol>
        <p>Por detrás tiene el conector de corriente, el interruptor y, en fuentes antiguas, un selector de 115/230 V; las actuales se adaptan solas. La etiqueta <strong>80 PLUS</strong> (Bronze, Gold, Platinum…) indica su eficiencia: cuánta energía se pierde en calor.</p>
      </Bloque>

      <Bloque id="potencia" titulo="Calcular la potencia">
        <p>Suma lo que consumen los componentes (el TDP de la CPU, el consumo de la gráfica, unos vatios por cada disco, placa y ventiladores) y añade un margen. La lámina de arriba hace la cuenta y redondea al tamaño comercial siguiente.</p>
        <EnClase fecha="28/10">
          <p>La fuente «no solo da energía: transforma el voltaje para proteger los componentes», de unos 220 V a 5-12 V. Para dimensionarla: sumar consumos y añadir un 10-15 % de margen.</p>
        </EnClase>
        <ParaElReto>
          <p>En el inventario, la fuente lleva potencia, certificación y conectores. Justificar los vatios con esta cuenta es una forma clara de demostrar que «identificas cada componente y su función».</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="conectores" titulo="Conectores de la fuente">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Conector</th><th>Alimenta a</th></tr></thead>
            <tbody>
              <tr><td><strong>ATX 20+4 pines</strong></td><td>La placa base</td></tr>
              <tr><td><strong>EPS 4+4 pines</strong> (ATX12V, «CPU»)</td><td>El procesador</td></tr>
              <tr><td><strong>PCIe 6+2 pines</strong> (o 12VHPWR en gráficas nuevas)</td><td>Tarjetas gráficas que consumen más de lo que da la ranura</td></tr>
              <tr><td><strong>SATA</strong></td><td>Discos y unidades SATA</td></tr>
              <tr><td><strong>Molex</strong></td><td>Dispositivos IDE antiguos y algunos ventiladores</td></tr>
              <tr><td><strong>Berg</strong></td><td>Disqueteras (histórico)</td></tr>
            </tbody>
          </table>
        </div>
        <p>Contra cortes y fluctuaciones de la red eléctrica, un <strong>SAI</strong> (sistema de alimentación ininterrumpida) da tiempo a guardar y apagar.</p>
      </Bloque>

      <Bloque id="grafica" titulo="La tarjeta gráfica">
        <p>Una <T def="Placa que se inserta en una ranura de expansión para añadir o mejorar funciones del ordenador.">tarjeta de expansión</T> añade o mejora funciones. Antes de comprar una, el profesor pide comprobar: qué función aporta, qué <strong>ranura</strong> necesita y si está libre, si <strong>cabe</strong> en la caja (las gráficas grandes ocupan dos o tres ranuras) y qué <strong>consumo y conectores</strong> pide a la fuente. Y después, instalar sus <strong>drivers</strong>.</p>
        <p>La <strong>tarjeta gráfica</strong> tiene:</p>
        <ul>
          <li><strong>GPU</strong>: procesador especializado en gráficos, con miles de núcleos en paralelo. Libera a la CPU y también acelera cálculo e IA.</li>
          <li><strong>VRAM</strong>: memoria propia, de tipo GDDR (GDDR6, GDDR7). Una imagen ocupa resolución × bytes por píxel.</li>
          <li><strong>RAMDAC</strong>: convertía la imagen digital a analógica para monitores VGA; con salidas digitales ya no hace falta.</li>
          <li><strong>Conectores</strong>: VGA (analógico), DVI, HDMI y DisplayPort (digitales).</li>
          <li><strong>Librerías gráficas</strong>: DirectX (Windows) y OpenGL/Vulkan (multiplataforma), que la tarjeta y sus drivers deben soportar.</li>
        </ul>
        <p>Dos gráficas trabajando juntas: <strong>SLI</strong> (NVIDIA) o <strong>CrossFire</strong> (AMD), hoy casi abandonadas. Para ver todos los datos de la tuya, <strong>GPU-Z</strong>.</p>
        <EnClase fecha="11/11">
          <p>La gráfica como «tarjeta de expansión por antonomasia»: GPU, VRAM, RAMDAC y conectores, y cómo una gráfica dedicada descarga a la CPU. Se dejó un cuestionario de tarjetas de expansión en los adjuntos de la clase.</p>
        </EnClase>
      </Bloque>

      <Bloque id="otras" titulo="Otras tarjetas y periféricos">
        <p><strong>Tarjeta de sonido</strong>: convierte audio entre analógico y digital (circuitos ADC y DAC) y lo procesa (DSP). Colores estándar: rosa micrófono, azul entrada de línea, verde salida principal, negro altavoces traseros, plateado laterales y naranja salida digital S/PDIF. <strong>Tarjeta de red</strong>: prepara, envía y controla los paquetes de datos con otros equipos; hoy suele venir integrada.</p>
        <p><strong>Periféricos</strong>, según su función: de <strong>entrada</strong> (teclado, ratón, escáner, micrófono, cámara), de <strong>salida</strong> (monitor, impresora, altavoces), de <strong>entrada/salida</strong> (pantalla táctil, módem) y de <strong>almacenamiento</strong>. Del monitor importan el tamaño (diagonal en pulgadas), la resolución y la tecnología (los CRT de tubo dieron paso a LCD y LED).</p>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="fuente" preguntas={[
          { p: 'CPU de 125 W, gráfica de 200 W y 75 W del resto. Con un 15 % de margen, ¿qué fuente?', opciones: ['400 W', '450 W', '500 W', '1.000 W'], ok: 2, porque: '400 W × 1,15 = 460 W; el tamaño comercial siguiente es 500 W.' },
          { p: '¿Qué paso de la fuente convierte la alterna en continua?', opciones: ['Transformación', 'Rectificación', 'Filtrado', 'Estabilización'], ok: 1, porque: 'Rectificar es pasar de alterna a continua.' },
          { p: 'El conector EPS de 4+4 pines alimenta…', opciones: ['La gráfica', 'El procesador', 'Los discos', 'Los ventiladores'], ok: 1, porque: 'Es la alimentación dedicada de la CPU.' },
          { p: 'La memoria propia de la gráfica se llama…', opciones: ['VRAM', 'ROM', 'Caché L3', 'SO-DIMM'], ok: 0, porque: 'Video RAM, de tipo GDDR.' },
          { p: 'El conector de audio rosa es…', opciones: ['Salida de altavoces', 'Micrófono', 'Entrada de línea', 'S/PDIF'], ok: 1, porque: 'Rosa micrófono, verde salida, azul entrada.' },
        ]} />
      </div>
    </>
  );
}
