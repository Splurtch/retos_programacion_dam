import { useMemo, useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';
import { LAMINAS, enlace } from '../laminas/index.ts';
import { IcoLupa } from '../ui/iconos.tsx';

const TERMINOS: [string, string, string][] = [
  ["Sistema microprogramable", "Sistema digital que lee, interpreta y ejecuta en secuencia las instrucciones de un programa.", 'arquitectura'],
  ["Firmware", "Software grabado en el hardware para arrancarlo. En un PC, la BIOS/UEFI.", 'arquitectura'],
  ["Von Neumann", "Arquitectura de programa almacenado: datos y código en la misma memoria.", 'arquitectura'],
  ["Bus", "Conjunto de líneas que llevan información del mismo tipo. Hay de datos, de direcciones y de control.", 'arquitectura'],
  ["Ancho de bus", "Número de líneas del bus; con n líneas de dirección se direccionan 2^n posiciones.", 'arquitectura'],
  ["MAR y MDR", "Registros de dirección y de datos de memoria que usa la CPU para leer y escribir.", 'arquitectura'],
  ["Lenguaje máquina", "Instrucciones en binario que el procesador ejecuta directamente.", 'arquitectura'],
  ["Unidad de control", "Parte de la CPU que dirige la ejecución: reloj, decodificador y secuenciador.", 'procesador'],
  ["ALU", "Unidad aritmético-lógica: opera con enteros y hace comparaciones.", 'procesador'],
  ["FPU", "Unidad de coma flotante: opera con decimales.", 'procesador'],
  ["Registro", "Memoria diminuta y rapidísima dentro de la CPU (contador de programa, registro de instrucción, acumulador).", 'procesador'],
  ["Caché", "Memoria pequeña y muy rápida (SRAM) en el procesador, en niveles L1, L2 y L3.", 'procesador'],
  ["Multiplicador", "Factor por el que se multiplica el reloj base para obtener la frecuencia de la CPU.", 'procesador'],
  ["Turbo Boost", "Subida automática de frecuencia dentro de los márgenes de fábrica.", 'procesador'],
  ["Overclocking", "Forzar la frecuencia por encima de lo que garantiza el fabricante.", 'procesador'],
  ["Núcleo", "Unidad de ejecución completa dentro del procesador.", 'procesador'],
  ["Hyper-Threading", "Tecnología que permite a cada núcleo atender dos hilos.", 'procesador'],
  ["Nanómetros", "Escala de fabricación de los transistores; menos nm, más transistores y menos consumo.", 'procesador'],
  ["TDP", "Thermal Design Power: calor (en vatios) que debe disipar la refrigeración.", 'procesador'],
  ["Socket", "Zócalo de la placa donde encaja la CPU: ZIF/PGA o LGA.", 'procesador'],
  ["Chipset", "Conjunto de chips de la placa que conecta la CPU con USB, SATA, red y PCIe secundarios.", 'procesador'],
  ["SoC", "System on a Chip: casi todo el sistema integrado en un chip.", 'procesador'],
  ["Factor de forma", "Estándar de medidas y distribución de la placa: ATX, micro-ATX, mini-ITX.", 'placa'],
  ["PCI Express", "Bus y ranuras de expansión actuales: x1, x4, x8, x16.", 'placa'],
  ["M.2", "Formato de tarjeta para SSD atornillado a la placa; puede ser SATA o NVMe.", 'placa'],
  ["Panel frontal", "Pines de la placa para Power SW, Reset SW, Power LED y HDD LED.", 'placa'],
  ["Pila CMOS", "Batería de la placa que conserva hora y configuración de la BIOS.", 'placa'],
  ["RAM", "Memoria principal de lectura y escritura, volátil.", 'memoria'],
  ["SRAM / DRAM", "Estática (rápida, sin refresco, para caché) / dinámica (necesita refresco, la del PC).", 'memoria'],
  ["DDR", "Double Data Rate: dos transferencias por ciclo de reloj. Generaciones DDR a DDR5.", 'memoria'],
  ["Latencia CL", "Ciclos entre la petición de la CPU y la respuesta de la RAM.", 'memoria'],
  ["Dual Channel", "Dos módulos trabajando en paralelo para doblar el ancho de banda.", 'memoria'],
  ["SO-DIMM", "Formato pequeño de módulo de RAM para portátiles.", 'memoria'],
  ["ROM", "Memoria no volátil: Mask ROM, PROM, EPROM, EEPROM y flash.", 'memoria'],
  ["HDD", "Disco duro magnético: platos, cabezas, pistas, cilindros y sectores.", 'almacenamiento'],
  ["SSD", "Unidad de estado sólido con memoria flash, sin piezas móviles.", 'almacenamiento'],
  ["IDE / PATA", "Interfaz paralela antigua de 40 pines con maestro y esclavo.", 'almacenamiento'],
  ["SATA", "Interfaz serie de discos; datos de 7 pines.", 'almacenamiento'],
  ["NVMe", "Protocolo de SSD por PCI Express, mucho más rápido que SATA.", 'almacenamiento'],
  ["NAS / SAN", "Almacenamiento en red: una caja de discos / una red dedicada al almacenamiento.", 'almacenamiento'],
  ["Partición", "División lógica de un disco con su propio sistema de archivos.", 'almacenamiento'],
  ["Sistema de archivos", "Organización interna de una partición: NTFS, exFAT, ext4.", 'almacenamiento'],
  ["Fuente de alimentación", "Convierte la alterna de la red en continua de 12, 5 y 3,3 V.", 'fuente'],
  ["80 PLUS", "Certificación de eficiencia de una fuente (Bronze, Gold, Platinum…).", 'fuente'],
  ["SAI", "Sistema de alimentación ininterrumpida: batería contra cortes y fluctuaciones.", 'fuente'],
  ["Tarjeta de expansión", "Placa que se pincha en una ranura para añadir funciones.", 'fuente'],
  ["GPU / VRAM", "Procesador gráfico / su memoria dedicada (GDDR).", 'fuente'],
  ["Driver", "Programa que permite al sistema operativo comunicarse con un dispositivo.", 'software'],
  ["Software libre", "El que garantiza las cuatro libertades: usar, estudiar, distribuir y mejorar.", 'software'],
  ["Copyleft", "Licencia (como la GPL) que obliga a que las versiones modificadas sigan siendo libres.", 'software'],
  ["Freeware", "Software gratuito pero no libre.", 'software'],
  ["Sistema operativo", "Software que gestiona el hardware y da servicio a los programas.", 'software'],
  ["Kernel", "Núcleo del sistema operativo, que se ejecuta en modo privilegiado.", 'software'],
  ["Multitarea / multiusuario", "Ejecuta varios procesos a la vez / atiende a varios usuarios a la vez.", 'software'],
  ["POST", "Power On Self-Test: la autocomprobación del hardware al encender.", 'montaje'],
  ["BIOS / UEFI", "Firmware de la placa y su sucesor moderno, con Secure Boot y discos GPT.", 'montaje'],
  ["Setup", "Programa de configuración de la BIOS/UEFI, al que se entra con Supr o F2.", 'montaje'],
  ["Orden de arranque", "Secuencia de dispositivos donde el firmware busca un sistema operativo.", 'montaje'],
  ["MBR / GPT", "Esquemas de particiones: el clásico (4 primarias, 512 bytes) y el de UEFI (128 particiones).", 'montaje'],
  ["AHCI", "Modo SATA de la BIOS que necesitan los instaladores modernos para ver el disco.", 'montaje'],
  ["GRUB", "Gestor de arranque de Linux; permite elegir sistema en un arranque dual.", 'montaje'],
  ["EPI", "Equipos de protección individual: gafas, guantes, calzado…", 'montaje'],
  ["Máquina virtual", "Ordenador simulado dentro de otro, con hardware prestado por el anfitrión.", 'virtualizacion'],
  ["Hipervisor", "Software que crea y ejecuta máquinas virtuales. Tipo 1 (nativo) o tipo 2 (alojado).", 'virtualizacion'],
  ["Anfitrión / invitado", "El equipo real (host) / el sistema dentro de la VM (guest).", 'virtualizacion'],
  ["VT-x / AMD-V", "Instrucciones de virtualización del procesador; se activan en la BIOS/UEFI.", 'virtualizacion'],
  ["ISO", "Imagen de un disco de instalación en un solo archivo.", 'virtualizacion'],
  ["Guest Additions", "Controladores de VirtualBox para el sistema invitado.", 'virtualizacion'],
  ["Instantánea", "Estado guardado de una VM al que se puede volver.", 'virtualizacion'],
  ["Inventario de hardware", "Relación de los componentes de un equipo con sus características.", 'reto1'],
];

export function Glosario() {
  const [q, setQ] = useState('');
  const lista = useMemo(() => {
    const n = q.trim().toLocaleLowerCase('es-ES').normalize('NFD').replace(/\p{M}/gu, '');
    const norm = (s: string) => s.toLocaleLowerCase('es-ES').normalize('NFD').replace(/\p{M}/gu, '');
    return TERMINOS.filter(([t, d]) => !n || norm(t).includes(n) || norm(d).includes(n)).sort((a, b) => a[0].localeCompare(b[0], 'es'));
  }, [q]);
  return (
    <div className="pagina">
      <h1>Glosario</h1>
      <p>Los {TERMINOS.length} términos de la Unidad 1, explicados en una frase y enlazados a la lámina donde se trabajan.</p>
      <div style={{ maxWidth: 420, marginTop: 24 }}>
        <TextInput label="Buscar un término" type="search" value={q} onChange={setQ} placeholder="socket, DDR, hipervisor…" isLabelHidden />
      </div>
      <dl className="glos" aria-live="polite">
        {lista.length === 0 && <p style={{ color: 'var(--t8)', display: 'flex', gap: 8, alignItems: 'center' }}><Icon icon={IcoLupa} size="sm" /> Nada con «{q}». Prueba con otra palabra.</p>}
        {lista.map(([t, d, l]) => {
          const m = LAMINAS.find((x) => x.id === l)!;
          return (
            <div key={t} className="glos-fila" data-familia={m.familia}>
              <dt>{t}</dt>
              <dd>{d} <a href={enlace(l)}>Lámina {m.num}</a></dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
