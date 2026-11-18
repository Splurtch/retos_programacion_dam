// Lógica mínima del modelo E-R que usan las láminas 07 y 09. Sin dependencias: se prueba con `node --test`.

export type Max = 1 | 'N';
export interface Card { min: 0 | 1; max: Max }

/** Cómo se escribe en el diagrama, con la n minúscula de los apuntes: (0,n), (1,1)… */
export const texto = (c: Card) => `(${c.min},${c.max === 'N' ? 'n' : '1'})`;

/** El tipo de la interrelación sale SOLO de los dos máximos. */
export const tipo = (a: Max, b: Max) => (a === 1 && b === 1 ? '1:1' : a === 'N' && b === 'N' ? 'N:M' : '1:N');

/** ¿Permite la cardinalidad que haya n ocurrencias relacionadas? */
export const admite = (c: Card, n: number) => n >= c.min && (c.max === 'N' || n <= c.max);

/**
 * Las comprobaciones del Reto 1 sobre el modelo que propone el alumno.
 * `junto_categoria`: categorías por producto (va escrita al lado de CATEGORIA).
 * `junto_producto`: productos por categoría (va escrita al lado de PRODUCTO).
 */
export function comprobarReto(junto_categoria: Card, junto_producto: Card) {
  return {
    /** PER tiene 2 productos, PAN tiene 1 y cada producto está en 1 categoría. */
    inicial: admite(junto_categoria, 1) && admite(junto_producto, 1) && admite(junto_producto, 2),
    /** Una categoría nueva, sin productos. */
    vacia: admite(junto_producto, 0),
    /** P1 no puede estar en PER y en PAN a la vez. */
    unaPorProducto: !admite(junto_categoria, 2),
    /** «Exactamente una»: tampoco puede quedarse sin categoría. */
    sinHuerfanos: !admite(junto_categoria, 0),
  };
}
