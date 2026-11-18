import { LAMINAS, enlace } from '../laminas/index.ts';

interface Sesion { fecha: string; dia: string; titulo: string; puntos: string[]; ejercicios?: string; laminas: string[] }

const SESIONES: Sesion[] = [
  { fecha: '30/09', dia: 'Miércoles', titulo: 'Bienvenida a Sistemas y Entornos', puntos: ['Evaluación: retos, cuestionarios de plataforma y examen. Ordinaria el 22-23 de mayo; extraordinaria el 19-20 de junio.', 'El módulo en cuatro bloques: hardware, sistemas operativos, redes (la parte que «suele costar») y aplicaciones, todos conectados.', 'Se trabajará con máquinas virtuales para probar Linux sin tocar el sistema anfitrión, y con la línea de comandos.', 'Clases extra por la tarde y todo grabado.'], laminas: ['arquitectura', 'virtualizacion'] },
  { fecha: '07/10', dia: 'Miércoles', titulo: 'Clase sin grabación', puntos: ['Un fallo de la plataforma dejó la sesión sin grabar; el profesor anunció que la grabaría aparte.'], laminas: [] },
  { fecha: '14/10', dia: 'Miércoles', titulo: 'Funcionamiento interno y el procesador', puntos: ['Unidad de control (reloj, decodificador, secuenciador), registro de instrucción y contador de programa.', 'ALU, FPU y acumulador; buses de direcciones, datos y control.', 'Lectura y escritura en memoria: MAR, selector y MDR. Caché L1, L2 y L3; hit y miss.', 'ROM, BIOS y POST. Frecuencia = base × multiplicador (CPU-Z), overclocking, núcleos, TDP, Ley de Moore, tick-tock.'], laminas: ['arquitectura', 'procesador', 'montaje'] },
  { fecha: '21/10', dia: 'Miércoles', titulo: 'Intel, AMD e inicio de la placa base', puntos: ['Generaciones Intel por el nombre, Turbo Boost frente a overclocking, Hyper-Threading, Smart Cache.', 'El procesador absorbe el puente norte; chipset por DMI; SoC. Nanómetros y ordenadores cuánticos.', 'AMD: Zen/Ryzen, Infinity Fabric, Threadripper. ¿Intel o AMD? «Depende», sobre todo del precio. Apple M, cerrado.', 'Cuestionario de 12 preguntas (multiplicador, ZIF/LGA, SoC…). Factor de forma ATX.'], ejercicios: 'Cuestionario del procesador', laminas: ['procesador', 'placa'] },
  { fecha: '26/10', dia: 'Lunes', titulo: 'Webinar 1.º DAM + 1.º DAW', puntos: ['Evaluación: 70 % retos profesionales, 20 % tests de las unidades (dos intentos, cuenta la nota más alta) y 10 % examen presencial.'], laminas: ['reto1'] },
  { fecha: '28/10', dia: 'Miércoles', titulo: 'Placa base, fuente y memoria RAM', puntos: ['Socket, ranuras de RAM y de expansión (PCI, AGP, PCIe x1/x16), pila, POST y acceso a la BIOS; de BIOS a UEFI.', 'Conectores internos y traseros, panel frontal y speaker.', 'Fuente: de 220 V a 5-12 V; potencia = consumos + 10-15 %; conectores ATX, CPU, PCIe, SATA, Molex.', 'RAM: volatilidad, refresco, tiempo de acceso, frecuencia, latencia CL, DDR2 a DDR5, Dual Channel, SO-DIMM y LPDDR.', '«El reto de hardware es muy extenso»: opción de simulador para quien no tenga equipo. Tests 20 %, retos 70 %, examen 10 %; simulacros de examen más adelante.'], laminas: ['placa', 'fuente', 'memoria', 'reto1'] },
  { fecha: '04/11', dia: 'Miércoles', titulo: 'Almacenamiento y particiones', puntos: ['Velocidad punta frente a media real. Tecnologías magnética, óptica, flash y cinta.', 'IDE (40 pines, maestro y esclavo con jumper), SATA (7 pines), eSATA, SCSI, SAS; USB y Thunderbolt; NAS, SAN y nube.', 'El disco como cuello de botella: de HDD a SSD. Modo AHCI en la BIOS si el instalador no ve el disco.', 'Particiones en Administración de discos; sistema de archivos; arranque dual: primero Windows, luego Linux con GRUB.'], ejercicios: 'Cuestionarios de RAM, procesador y almacenamiento', laminas: ['almacenamiento', 'montaje'] },
  { fecha: '11/11', dia: 'Miércoles', titulo: 'Tarjetas de expansión y fechas de los retos', puntos: ['Retos de Sistemas: 20/11, 22/01, 05/03 y 23/04. El 20/11, subir lo que se tenga; se corrige cuando se avise por correo de que es la versión final.', 'Tarjetas de expansión: función, ranura, tamaño y consumo; drivers.', 'Tarjeta gráfica: GPU, VRAM (GDDR), RAMDAC, conectores, DirectX y OpenGL, SLI y CrossFire, GPU-Z.', 'Se anuncia una clase de tarde para la virtualización del reto.'], ejercicios: 'Cuestionario de tarjetas de expansión', laminas: ['fuente', 'virtualizacion', 'reto1'] },
];

export function Clases() {
  return (
    <div className="pagina">
      <h1>Diario de clases</h1>
      <p>Lo que se vio en cada clase grabada del módulo, en una lista, con enlace a las láminas donde está explicado a fondo. Las grabaciones completas y los PDF del profesor están en «3 Clases grabadas»; el profesor pide estudiar sobre todo por sus PDF.</p>
      {SESIONES.map((s) => (
        <section key={s.fecha} className="sesion" aria-labelledby={`s-${s.fecha}`}>
          <div className="sesion-fecha">{s.fecha}<small>{s.dia} · 2026</small></div>
          <div>
            <h2 id={`s-${s.fecha}`}>{s.titulo}</h2>
            <ul>{s.puntos.map((p) => <li key={p}>{p}</li>)}</ul>
            {s.ejercicios && <p style={{ margin: '0 0 10px', fontSize: 15, color: 'var(--t8)' }}>Material: {s.ejercicios}</p>}
            {s.laminas.length > 0 && (
              <div className="enlaces-lam">
                {s.laminas.map((id) => {
                  const m = LAMINAS.find((l) => l.id === id)!;
                  return <a key={id} href={enlace(id)} data-familia={m.familia}>{m.num} {m.corto}</a>;
                })}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
