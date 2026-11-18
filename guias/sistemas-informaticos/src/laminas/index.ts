import type { ComponentType, ReactNode } from 'react';

export type Familia = 'arq' | 'comp' | 'soft' | 'reto';

export interface Meta {
  id: string;
  num: string;
  titulo: string;
  corto: string;
  formula: string;
  familia: Familia;
  resumen: string;
  /** Clases grabadas en las que se trabajó este contenido (fecha ISO). */
  clases: string[];
  /** Material oficial del que sale. */
  fuentes: string[];
}

export interface Modulo {
  entradilla: ReactNode;
  ficha: [string, ReactNode][];
  Destacado: ComponentType;
  secciones: { id: string; titulo: string }[];
  default: ComponentType;
}

export const FAMILIAS: Record<Familia, { nombre: string; texto: string }> = {
  arq: { nombre: 'Arquitectura', texto: 'Cómo funciona un ordenador por dentro: Von Neumann, buses, memoria y el procesador.' },
  comp: { nombre: 'Componentes', texto: 'Las piezas que vas a inventariar y montar: placa, RAM, almacenamiento, fuente y tarjetas.' },
  soft: { nombre: 'Software y puesta en marcha', texto: 'Montar, configurar la BIOS/UEFI, comparar sistemas operativos y virtualizar.' },
  reto: { nombre: 'Reto 1', texto: 'The Build: inventario de hardware y manual de instalación, paso a paso y sin copiar.' },
};

export const LAMINAS: Meta[] = [
  { id: 'arquitectura', num: '01', titulo: 'Arquitectura de un ordenador', corto: 'Arquitectura', formula: 'CPU ⇄ buses ⇄ memoria ⇄ E/S', familia: 'arq', resumen: 'Hardware, software y firmware; el modelo de Von Neumann, los tres buses y cómo se lee y se escribe en memoria.', clases: ['2026-10-14'], fuentes: ['PDF Unidad 1 §1-3', 'PDF del profesor «Arquitectura PC»', 'Píldoras 04 y 12'] },
  { id: 'procesador', num: '02', titulo: 'El microprocesador', corto: 'Procesador', formula: 'frecuencia = base × multiplicador', familia: 'arq', resumen: 'Unidad de control, ALU, registros y caché; núcleos, hilos, Turbo Boost, nanómetros, sockets y cómo leer el nombre de una CPU.', clases: ['2026-10-14', '2026-10-21'], fuentes: ['PDF Unidad 1 §4.3', 'PDF del profesor «El microprocesador»', 'Píldora 13'] },
  { id: 'placa', num: '03', titulo: 'Caja y placa base', corto: 'Placa base', formula: 'ATX · socket · chipset · slots', familia: 'comp', resumen: 'Factores de forma, todo lo que hay en una placa base, los conectores traseros y el panel frontal.', clases: ['2026-10-21', '2026-10-28'], fuentes: ['PDF Unidad 1 §4.1-4.2', 'PDF del profesor «Componentes internos»', 'Píldoras 05 y 10'] },
  { id: 'memoria', num: '04', titulo: 'Memoria RAM y ROM', corto: 'Memoria', formula: 'DDR4-3200 = PC4-25600', familia: 'comp', resumen: 'Volátil o no, SRAM y DRAM, generaciones DDR, frecuencia, latencia, Dual Channel y los tipos de ROM.', clases: ['2026-10-28'], fuentes: ['PDF Unidad 1 §4.4', 'PDF del profesor «La memoria RAM»'] },
  { id: 'almacenamiento', num: '05', titulo: 'Almacenamiento', corto: 'Almacenamiento', formula: 'HDD · SSD SATA · M.2 NVMe', familia: 'comp', resumen: 'Tecnologías, interfaces internas y externas, NAS y nube, y particiones.', clases: ['2026-11-04'], fuentes: ['PDF Unidad 1 §4.5', 'PDF del profesor «Sistemas de almacenamiento»'] },
  { id: 'fuente', num: '06', titulo: 'Fuente, tarjetas y periféricos', corto: 'Fuente y tarjetas', formula: 'W = Σ consumos + margen', familia: 'comp', resumen: 'Cómo dimensionar la fuente y sus conectores, la tarjeta gráfica y las demás tarjetas de expansión.', clases: ['2026-10-28', '2026-11-11'], fuentes: ['PDF Unidad 1 §4.6-4.8', 'PDF del profesor «Tarjetas de expansión»', 'Píldora 11'] },
  { id: 'software', num: '07', titulo: 'Software, licencias y sistemas operativos', corto: 'Sistemas operativos', formula: 'kernel · interfaz · sistema de archivos', familia: 'soft', resumen: 'Tipos de software, libre frente a propietario, qué hace un sistema operativo y Windows frente a Linux.', clases: ['2026-09-30'], fuentes: ['PDF Unidad 1 §5'] },
  { id: 'montaje', num: '08', titulo: 'Montaje, BIOS/UEFI e instalación', corto: 'Montaje y BIOS', formula: 'montar → POST → Setup → arranque → SO', familia: 'soft', resumen: 'El orden del montaje, la seguridad, el POST, la BIOS/UEFI y los pasos para instalar un sistema operativo.', clases: ['2026-10-14', '2026-10-28', '2026-11-04'], fuentes: ['PDF Unidad 1 §6-9', 'Píldora 03'] },
  { id: 'virtualizacion', num: '09', titulo: 'Virtualización', corto: 'Virtualización', formula: 'anfitrión + hipervisor + VM', familia: 'soft', resumen: 'Qué es un hipervisor, cómo activar VT-x/AMD-V y cómo crear máquinas virtuales en VirtualBox. No está en el temario de la Unidad 1, pero el reto lo pide.', clases: ['2026-09-30', '2026-11-11'], fuentes: ['Reto Profesional 1', 'Clases del 30/09 y del 11/11'] },
  { id: 'reto1', num: '10', titulo: 'Reto 1: The Build', corto: 'Reto 1', formula: 'inventario + comparativa + manual', familia: 'reto', resumen: 'Qué piden, cómo se puntúa y cómo construir el inventario, la comparativa y el manual de instalación.', clases: ['2026-10-14', '2026-10-28', '2026-11-11'], fuentes: ['Reto Profesional 1', 'Clase del 11/11'] },
];

export const CARGAR: Record<string, () => Promise<Modulo>> = {
  arquitectura: () => import('./l01-arquitectura.tsx'),
  procesador: () => import('./l02-procesador.tsx'),
  placa: () => import('./l03-placa.tsx'),
  memoria: () => import('./l04-memoria.tsx'),
  almacenamiento: () => import('./l05-almacenamiento.tsx'),
  fuente: () => import('./l06-fuente.tsx'),
  software: () => import('./l07-software.tsx'),
  montaje: () => import('./l08-montaje.tsx'),
  virtualizacion: () => import('./l09-virtualizacion.tsx'),
  reto1: () => import('./l10-reto1.tsx'),
};

export const enlace = (id: string, seccion?: string) => `#/l/${id}${seccion ? `/${seccion}` : ''}`;
