// Cálculos que usan las láminas. Sin dependencias: se prueba con `node --test`.

/** Frecuencia efectiva de la CPU en GHz: reloj base (MHz) × multiplicador. */
export const frecuencia = (baseMHz: number, mult: number) => (baseMHz * mult) / 1000;

/** Nombre comercial de un módulo DDR a partir de su generación y sus MT/s. */
export function ddr(gen: 1 | 2 | 3 | 4 | 5, mts: number) {
  const mbs = mts * 8; // bus de 64 bits = 8 bytes por transferencia
  return { chip: `DDR${gen === 1 ? '' : gen}-${mts}`, modulo: `PC${gen === 1 ? '' : `${gen}-`}${mbs}`, mbs, relojMHz: mts / 2 };
}

/** Latencia real en nanosegundos: CL ciclos de un reloj que va a MT/s ÷ 2. */
export const latenciaNs = (cl: number, mts: number) => (cl * 2000) / mts;

const TAMANOS = [400, 450, 500, 550, 650, 750, 850, 1000, 1200, 1600];

/** Potencia de fuente: suma de consumos más un margen; se redondea al tamaño comercial siguiente. */
export function fuente(consumos: number[], margen = 0.15) {
  const total = consumos.reduce((a, b) => a + b, 0);
  const minimo = Math.ceil(total * (1 + margen));
  return { total, minimo, comercial: TAMANOS.find((t) => t >= minimo) ?? minimo };
}

export interface Anfitrion { ramGB: number; hilos: number; discoGB: number }
export interface VM { nombre: string; ramGB: number; cpus: number; discoGB: number }

/** Avisos al repartir el equipo físico entre máquinas virtuales encendidas a la vez. */
export function planVM(h: Anfitrion, vms: VM[], reservaGB = 4) {
  const ram = vms.reduce((s, v) => s + v.ramGB, 0);
  const disco = vms.reduce((s, v) => s + v.discoGB, 0);
  const avisos: string[] = [];
  if (ram > h.ramGB - reservaGB) avisos.push(`Las VM suman ${ram} GB de RAM y el anfitrión solo puede ceder ${Math.max(0, h.ramGB - reservaGB)} GB sin ahogarse.`);
  for (const v of vms) if (v.cpus > h.hilos / 2) avisos.push(`${v.nombre}: ${v.cpus} CPU virtuales es más de la mitad de los ${h.hilos} hilos del anfitrión.`);
  if (disco > h.discoGB) avisos.push(`Los discos virtuales suman ${disco} GB y solo hay ${h.discoGB} GB libres.`);
  return { ram, disco, avisos };
}

const SUF: Record<string, string> = {
  K: 'multiplicador desbloqueado: admite overclocking',
  F: 'sin gráfica integrada: necesita tarjeta gráfica',
  KF: 'desbloqueado y sin gráfica integrada',
  H: 'portátil de alto rendimiento',
  HX: 'portátil de máximo rendimiento',
  U: 'portátil de bajo consumo',
  T: 'sobremesa de bajo consumo',
  X: 'frecuencias más altas',
  X3D: 'caché L3 apilada en 3D (3D V-Cache)',
  G: 'con gráfica integrada',
  '': 'modelo estándar',
};

/** Lee nombres tipo «Core i7-14700K» o «Ryzen 7 7800X3D». */
export function leerCPU(nombre: string) {
  const n = nombre.trim();
  let m = n.match(/^(?:Intel\s+)?Core\s+i([3579])[-\s](\d{4,5})([A-Z]*)$/i);
  if (m) {
    const num = m[2];
    const suf = m[3].toUpperCase();
    return { marca: 'Intel', gama: `i${m[1]}`, generacion: Number(num.slice(0, num.length - 3)), modelo: num.slice(-3), sufijo: suf, significa: SUF[suf] ?? 'sufijo desconocido' };
  }
  m = n.match(/^(?:AMD\s+)?Ryzen\s+([3579])\s+(\d{4})([A-Z0-9]*)$/i);
  if (m) {
    const suf = m[3].toUpperCase();
    return { marca: 'AMD', gama: `Ryzen ${m[1]}`, generacion: Number(m[2][0]), modelo: m[2].slice(1), sufijo: suf, significa: SUF[suf] ?? 'sufijo desconocido' };
  }
  return null;
}
