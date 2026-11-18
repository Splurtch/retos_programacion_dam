import { useState } from 'react';
import { Slider } from '@astryxdesign/core/Slider';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { frecuencia, leerCPU } from '../calc.ts';

export const entradilla = (
  <p>El <strong>microprocesador</strong> (CPU) es el componente que ejecuta las instrucciones y gobierna a los demás. Por fuera es un chip con contactos que encaja en el zócalo de la placa; por dentro, una unidad de control que dirige, una unidad aritmético-lógica que calcula, registros y caché para no esperar a la RAM. Saber leer sus características es lo primero del inventario del reto.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Frecuencia (GHz), núcleos e hilos, caché L1/L2/L3, nanómetros, TDP (W) y socket.'],
  ['Se confunde con', 'Turbo Boost y overclocking. Turbo sube la frecuencia dentro de los límites de fábrica; el overclocking los supera.'],
  ['Hábitat', 'El zócalo de la placa base, bajo el disipador. En el reto, la primera fila del inventario.'],
  ['Fórmula de clase', 'Frecuencia = reloj base × multiplicador.'],
];

export const secciones = [
  { id: 'dentro', titulo: 'Por dentro: control, ALU y registros' },
  { id: 'cache', titulo: 'La caché' },
  { id: 'frecuencia', titulo: 'Frecuencia, Turbo y overclocking' },
  { id: 'nucleos', titulo: 'Núcleos, hilos y nanómetros' },
  { id: 'socket', titulo: 'Socket, chipset e Intel frente a AMD' },
];

// ---------- Destacado: leer el nombre ----------
const EJ = ['Core i7-14700K', 'Core i5-12400F', 'Core i3-10100', 'Ryzen 7 7800X3D', 'Ryzen 5 5600G', 'Core i7-13700H'];

export function Destacado() {
  const [n, setN] = useState('Core i7-14700K');
  const r = leerCPU(n);
  return (
    <Panel titulo="Lee el nombre de un procesador">
      <TextInput label="Nombre comercial" value={n} onChange={setN} placeholder="Core i5-13400F, Ryzen 5 7600X…" />
      <div className="opciones" style={{ marginTop: 10 }}>
        {EJ.map((e) => <button key={e} type="button" className="chip" onClick={() => setN(e)}>{e}</button>)}
      </div>
      {r ? (
        <dl className="ficha" style={{ marginTop: 8 }}>
          <div className="ficha-fila"><dt>Marca y gama</dt><dd>{r.marca} {r.gama} {r.marca === 'Intel' ? '(i3 básica, i5 media, i7 alta, i9 tope)' : '(3 básica, 5 media, 7 alta, 9 tope)'}</dd></div>
          <div className="ficha-fila"><dt>Generación</dt><dd>{r.generacion}.ª {r.marca === 'Intel' ? '(las cifras antes de las tres últimas)' : '(la primera cifra: la serie)'}</dd></div>
          <div className="ficha-fila"><dt>Modelo</dt><dd>{r.modelo}: dentro de la generación, más alto suele ser más potente</dd></div>
          <div className="ficha-fila"><dt>Sufijo</dt><dd>{r.sufijo || '(ninguno)'}: {r.significa}</dd></div>
        </dl>
      ) : <p className="resultado" data-ok="false" style={{ marginTop: 12 }}>No reconozco ese formato. Prueba con «Core i5-12400F» o «Ryzen 5 7600X». Los Intel Core Ultra usan otra nomenclatura.</p>}
    </Panel>
  );
}

function Frecuencia() {
  const [m, setM] = useState(36);
  const [turbo, setTurbo] = useState(false);
  const efectivo = turbo ? Math.min(m + 12, 52) : m;
  return (
    <Panel titulo="Reloj base × multiplicador">
      <Slider label={`Multiplicador: ${m}`} value={m} onChange={(v: number) => setM(v)} min={8} max={50} step={1} valueDisplay="none" />
      <div className="opciones" style={{ marginTop: 10 }}>
        <button type="button" className="opcion" aria-pressed={turbo} onClick={() => setTurbo(!turbo)}>Carga alta: Turbo Boost</button>
      </div>
      <p className="grande" style={{ margin: '6px 0' }}>100 MHz × {efectivo} = {frecuencia(100, efectivo).toLocaleString('es-ES')} GHz</p>
      <p style={{ margin: 0, fontSize: 15, color: 'var(--t8)' }}>{turbo ? 'Turbo sube el multiplicador solo, mientras la temperatura y el consumo lo permitan, y sin salir de lo que el fabricante garantiza.' : 'En reposo el multiplicador baja para gastar menos; por eso en CPU-Z la frecuencia «baila» constantemente.'}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="dentro" titulo="Por dentro: control, ALU y registros">
        <ul>
          <li><strong>Unidad de control</strong>: dirige la ejecución. Su <strong>reloj</strong> marca el ritmo; el <strong>decodificador</strong> traduce la instrucción y el <strong>secuenciador</strong> la parte en microtareas.</li>
          <li><strong>Registros</strong>: memorias diminutas y rapidísimas dentro de la CPU. El <strong>registro de instrucción</strong> guarda la que va a decodificarse; el <strong>contador de programa</strong>, la dirección de la siguiente, para irla preparando.</li>
          <li><strong>ALU</strong> (unidad aritmético-lógica): suma, resta, multiplica, divide, compara y desplaza bits con enteros. El <strong>acumulador</strong> guarda el último resultado para reutilizarlo.</li>
          <li><strong>FPU</strong>: la unidad de coma flotante, para operar con decimales.</li>
        </ul>
      </Bloque>

      <Bloque id="cache" titulo="La caché">
        <p>La RAM es lenta comparada con la CPU. La <T def="Memoria pequeña y muy rápida, dentro del procesador, que guarda copias de los datos usados recientemente.">caché</T> guarda cerca lo que se usa a menudo, en niveles: <strong>L1</strong> dentro de cada núcleo, la más rápida y pequeña; <strong>L2</strong> y <strong>L3</strong>, mayores, a menudo compartidas entre núcleos (Smart Cache de Intel). Cuanto más cerca del núcleo, más rápida, más cara y más pequeña.</p>
        <p>Si el dato está en caché es un <strong>acierto</strong> (hit); si no, un <strong>fallo</strong> (miss) y hay que ir a la RAM. La jerarquía completa: registros, caché, RAM y disco; bajando, crece la capacidad, baja el coste por bit y empeora el tiempo de acceso.</p>
      </Bloque>

      <Bloque id="frecuencia" titulo="Frecuencia, Turbo y overclocking">
        <p>La frecuencia es cuántos ciclos por segundo da el reloj (GHz). Sale de multiplicar un reloj base, en torno a 100 MHz, por un <strong>multiplicador</strong> que cambia según la carga.</p>
        <Frecuencia />
        <p><strong>Turbo Boost</strong> (Intel; en AMD, Precision Boost) sube el multiplicador dentro de los márgenes de fábrica. El <strong>overclocking</strong> lo fuerza más allá a mano: más calor y riesgo, y solo en modelos desbloqueados (la K de Intel). El <T def="Thermal Design Power: calor que debe disipar la refrigeración, en vatios; orienta también el consumo.">TDP</T>, en vatios, dice cuánto calor hay que disipar.</p>
        <EnClase fecha="21/10">
          <p>En el cuestionario de clase: «2,4 GHz a partir de 800 MHz → multiplicador 3». También: Turbo Boost frente a overclocking, y que la sensación de hacer muchas cosas a la vez es una ilusión: el procesador alterna tareas en fracciones de tiempo.</p>
        </EnClase>
      </Bloque>

      <Bloque id="nucleos" titulo="Núcleos, hilos y nanómetros">
        <p>Un <strong>núcleo</strong> (core) es un procesador completo dentro del chip: su control, su ALU, sus registros. Con <strong>Hyper-Threading</strong> (Intel) o SMT (AMD), cada núcleo atiende <strong>dos hilos</strong>, aprovechando los huecos de uno para avanzar el otro: «8 núcleos y 16 hilos».</p>
        <p>Los <strong>nanómetros</strong> miden la escala de fabricación (la litografía): menos nanómetros, transistores más juntos, más transistores en el mismo espacio y menos consumo. La <strong>Ley de Moore</strong> lo resume: el número de transistores se duplica cada año y medio o dos. Intel avanzaba con el modelo <strong>tick-tock</strong>: un paso reducía nanómetros y el siguiente mejoraba la arquitectura.</p>
      </Bloque>

      <Bloque id="socket" titulo="Socket, chipset e Intel frente a AMD">
        <p>El <strong>socket</strong> o zócalo es donde encaja la CPU, y tiene que coincidir exactamente con el procesador. Dos estilos: <strong>ZIF/PGA</strong>, con los pines en el procesador y una palanca que lo libera sin fuerza, y <strong>LGA</strong>, con los pines en el zócalo y contactos planos en la CPU.</p>
        <p>Antes, la placa tenía un <strong>puente norte</strong> (RAM, gráfica) y un <strong>puente sur</strong> (lo lento). Hoy el procesador ha absorbido el puente norte: gestiona la RAM, el PCIe de la gráfica y la salida de vídeo integrada, y habla por un enlace (DMI en Intel) con el <strong>chipset</strong>, que lleva USB, SATA, red y el resto de PCIe. Llevado al extremo es un <strong>SoC</strong>, todo el sistema en un chip.</p>
        <p>En clase: AMD arrastró fama de calentarse más, a cambio de buena relación precio/rendimiento; con <strong>Zen</strong> (Ryzen) y su bus <strong>Infinity Fabric</strong> se puso a la altura. ¿Cuál elegir? «Depende» del uso, de la placa y la RAM que ya tengas y, sobre todo, del precio. Los Apple M son SoC cerrados: no se pueden montar en un PC.</p>
        <Ojo dice="La tabla de zócalos Intel termina en LGA 1151 (Core de 6.ª a 9.ª generación)." realidad="Después llegaron LGA 1200, LGA 1700 (12.ª a 14.ª generación) y LGA 1851 (Core Ultra). En AMD, AM4 para Ryzen 1000-5000 y AM5 para Ryzen 7000 en adelante. Para tu inventario, busca el socket exacto en la ficha de tu CPU." />
        <ParaElReto>
          <p>En el inventario, la CPU debería llevar: modelo, socket, núcleos e hilos, frecuencia base y turbo, caché L3 y TDP. CPU-Z te los da todos en la pestaña CPU.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="procesador" preguntas={[
          { p: 'Reloj base 100 MHz y multiplicador 45. ¿Frecuencia?', opciones: ['145 MHz', '4,5 GHz', '45 GHz', '450 MHz'], ok: 1, porque: '100 × 45 = 4.500 MHz = 4,5 GHz.' },
          { p: 'La unidad que opera con números decimales es…', opciones: ['La ALU', 'La FPU', 'El secuenciador', 'El acumulador'], ok: 1, porque: 'Floating Point Unit.' },
          { p: '¿Qué caché suele estar dentro de cada núcleo?', opciones: ['L1', 'L3', 'La RAM', 'Ninguna'], ok: 0, porque: 'L1 es por núcleo; L2 y L3 suelen ser mayores y compartidas.' },
          { p: 'En un Core i5-12400F, la F significa…', opciones: ['Overclock', 'Sin gráfica integrada', 'Portátil', 'Alta frecuencia'], ok: 1, porque: 'Necesita tarjeta gráfica dedicada.' },
          { p: 'En un socket LGA, los pines están…', opciones: ['En el procesador', 'En el zócalo de la placa', 'En el disipador', 'No hay pines'], ok: 1, porque: 'Land Grid Array: contactos planos en la CPU, pines en el zócalo.' },
        ]} />
      </div>
    </>
  );
}
