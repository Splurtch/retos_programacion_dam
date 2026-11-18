// Comportamiento de C# (.NET, cultura es-ES) que los simuladores necesitan imitar con fidelidad.
// Lo justo para los programas de la Unidad 1; no es un intérprete de C#.

export class CsException extends Error {
  tipo: string;
  constructor(tipo: string, mensaje: string) {
    super(mensaje);
    this.tipo = tipo;
  }
}

const ENTERO = /^\s*[+-]?\d+\s*$/;

/** int.Parse: solo dígitos (con signo y espacios alrededor). Fuera de rango o con letras, excepción. */
export function intParse(s: string | null | undefined): number {
  if (s == null) throw new CsException('ArgumentNullException', "Value cannot be null. (Parameter 's')");
  if (!ENTERO.test(s)) throw new CsException('FormatException', `The input string '${s}' was not in a correct format.`);
  const n = Number(s.trim());
  if (n > 2147483647 || n < -2147483648) throw new CsException('OverflowException', 'Value was either too large or too small for an Int32.');
  return n;
}

/**
 * double.Parse con cultura es-ES: la coma es el separador decimal y el punto es separador de miles.
 * Por eso "2.5" se lee como 25 y "2,5" como 2,5. En un ordenador en inglés es al revés: "1,45" se lee como 145
 * (lo que le pasó a la profesora en el ejercicio de tarifas del 21/10).
 */
export function doubleParse(s: string | null | undefined, cultura: 'es' | 'en' = 'es'): number {
  if (s == null) throw new CsException('ArgumentNullException', "Value cannot be null. (Parameter 's')");
  // En inglés (en-US) los papeles se invierten: punto decimal y coma de miles.
  const t = cultura === 'en' ? s.trim().replace(/[.,]/g, (c) => (c === '.' ? ',' : '.')) : s.trim();
  // ponytail: separador de miles aceptado de forma laxa ("1.2.3" → 123), como hace .NET con AllowThousands.
  if (!/^[+-]?(\d+(\.\d+)*(,\d*)?|,\d+)$/.test(t)) {
    throw new CsException('FormatException', `The input string '${s}' was not in a correct format.`);
  }
  return Number(t.replace(/\./g, '').replace(',', '.'));
}

/** TryParse nunca lanza: devuelve [ok, valor]; si falla, el valor es 0. */
export function tryParse(parse: (s: string | null | undefined) => number, s: string | null | undefined): [boolean, number] {
  try {
    return [true, parse(s)];
  } catch {
    return [false, 0];
  }
}

const fmt = (n: number, dec?: number) =>
  n.toLocaleString('es-ES', dec === undefined
    ? { maximumFractionDigits: 15, useGrouping: false }
    : { minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: false });

/** Cómo imprime C# un double en es-ES: 12.5 → "12,5"; con :F2 → "12,50". */
export function csDouble(n: number, formato?: string): string {
  if (Number.isNaN(n)) return 'NaN';
  if (!Number.isFinite(n)) return n > 0 ? '∞' : '-∞';
  const m = formato?.match(/^F(\d)$/i);
  return m ? fmt(n, Number(m[1])) : fmt(n);
}

/** División entera de C#: trunca hacia cero y lanza si el divisor es 0. */
export function intDiv(a: number, b: number): number {
  if (b === 0) throw new CsException('DivideByZeroException', 'Attempted to divide by zero.');
  return Math.trunc(a / b);
}

/** Resto de C# (%): conserva el signo del dividendo, igual que JavaScript. */
export const intMod = (a: number, b: number): number => {
  if (b === 0) throw new CsException('DivideByZeroException', 'Attempted to divide by zero.');
  return a % b;
};
