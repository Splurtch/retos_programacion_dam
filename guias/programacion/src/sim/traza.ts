import { CsException, csDouble } from './cs.ts';

export type Tipo = 'int' | 'long' | 'double' | 'float' | 'decimal' | 'string' | 'char' | 'bool' | 'const double' | 'const int' | 'int[]' | string;

export interface Variable { nombre: string; tipo: Tipo; valor: string; recien: boolean }
export interface Trozo { tipo: 'salida' | 'entrada' | 'error'; texto: string }
export type LineaConsola = Trozo[];
export interface Paso { linea: number; nota?: string; pideEntrada?: boolean }

export type Programa = (t: Traza) => Generator<Paso, void, string | undefined>;

/** Formatea un valor como lo mostraría el depurador de VS Code. */
export function mostrar(tipo: Tipo, v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (tipo.endsWith('string')) return `"${v}"`;
  if (tipo.endsWith('char')) return `'${v}'`;
  if (typeof v === 'number' && /double|float|decimal/.test(tipo)) return csDouble(v);
  if (Array.isArray(v)) return `{ ${v.join(', ')} }`;
  return String(v);
}

/** Lo que un programa simulado puede hacer. Cada `yield t.en(n)` es un paso visible. */
export class Traza {
  vars = new Map<string, Variable>();
  consola: LineaConsola[] = [];
  private abierta = false; // la última línea de consola sigue abierta (Console.Write)

  en(linea: number, nota?: string): Paso {
    for (const v of this.vars.values()) v.recien = false;
    return { linea, nota };
  }
  /** Console.ReadLine(): pausa hasta que el usuario escriba. Se usa como `const s = yield t.leer(n)`. */
  leer(linea: number, nota = 'El programa se detiene y espera a que escribas algo y pulses Enter.'): Paso {
    return { linea, nota, pideEntrada: true };
  }
  def(nombre: string, tipo: Tipo, valor: unknown) {
    this.vars.set(nombre, { nombre, tipo, valor: mostrar(tipo, valor), recien: true });
  }
  quitar(nombre: string) {
    this.vars.delete(nombre);
  }
  private trozo(tipo: Trozo['tipo'], texto: string, cierra: boolean) {
    if (this.abierta) this.consola[this.consola.length - 1].push({ tipo, texto });
    else this.consola.push([{ tipo, texto }]);
    this.abierta = !cierra;
  }
  write(s: string) {
    this.trozo('salida', s, false);
  }
  writeLine(s = '') {
    this.trozo('salida', s, true);
  }
  /** Lo que el usuario teclea aparece en la misma línea que la pregunta, y Enter salta de línea. */
  eco(s: string) {
    this.trozo('entrada', s, true);
  }
  error(s: string) {
    this.abierta = false;
    this.trozo('error', s, true);
  }
}

export interface Estado {
  traza: Traza;
  paso: Paso | null;
  pasos: number;
  fin: 'no' | 'ok' | 'excepcion';
  esperando: boolean;
}

/**
 * Reproduce el programa desde cero hasta `pasos` pasos, alimentando las entradas en orden.
 * Al ser determinista, retroceder es reproducir un paso menos.
 */
export function reproducir(programa: Programa, pasos: number, entradas: string[]): Estado {
  const t = new Traza();
  const gen = programa(t);
  let paso: Paso | null = null;
  let dados = 0;
  let usadas = 0;
  let envio: string | undefined;
  try {
    while (dados < pasos) {
      if (paso?.pideEntrada) {
        if (usadas >= entradas.length) return { traza: t, paso, pasos: dados, fin: 'no', esperando: true };
        envio = entradas[usadas++];
        t.eco(envio);
      }
      const r = gen.next(envio as string);
      envio = undefined;
      if (r.done) return { traza: t, paso: null, pasos: dados, fin: 'ok', esperando: false };
      paso = r.value;
      dados++;
    }
    return { traza: t, paso, pasos: dados, fin: 'no', esperando: !!paso?.pideEntrada && usadas >= entradas.length };
  } catch (e) {
    if (e instanceof CsException) {
      t.error(`Unhandled exception. System.${e.tipo}: ${e.message}`);
      return { traza: t, paso, pasos: dados, fin: 'excepcion', esperando: false };
    }
    throw e;
  }
}
