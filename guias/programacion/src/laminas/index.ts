import type { ComponentType, ReactNode } from 'react';

export type Familia = 'fundamentos' | 'datos' | 'control' | 'reto';

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
  fundamentos: { nombre: 'Fundamentos', texto: 'Qué es programar, cómo se representa una solución y cómo llega tu código a ejecutarse.' },
  datos: { nombre: 'Datos', texto: 'Dónde guarda el programa la información, de qué tipo es y cómo se opera y se convierte.' },
  control: { nombre: 'Control', texto: 'Cómo decide el programa, cómo repite y cómo sobrevive a los errores del usuario.' },
  reto: { nombre: 'Reto 1', texto: 'Todo lo anterior junto: el núcleo de una aplicación financiera en C#.' },
};

export const LAMINAS: Meta[] = [
  { id: 'algoritmos', num: '01', titulo: 'Algoritmos y programas', corto: 'Algoritmos', formula: 'problema → algoritmo → programa', familia: 'fundamentos', resumen: 'La diferencia entre tener la idea y escribirla para el ordenador, y qué hace bueno a un programa.', clases: ['2026-10-14'], fuentes: ['PDF Introducción a la programación', 'Píldoras 02 y 07'] },
  { id: 'diagramas', num: '02', titulo: 'Diagramas de flujo y pseudocódigo', corto: 'Diagramas', formula: 'Inicio → pasos → decisión → Fin', familia: 'fundamentos', resumen: 'Las dos formas de dibujar o escribir un algoritmo antes de programarlo.', clases: ['2026-10-14'], fuentes: ['PDF Introducción a la programación §1'] },
  { id: 'lenguajes', num: '03', titulo: 'Lenguajes y traducción', corto: 'Lenguajes', formula: '.cs → compilador → IL → CLR → código máquina', familia: 'fundamentos', resumen: 'Alto y bajo nivel, compilar frente a interpretar, y el viaje de un programa C# hasta el procesador.', clases: [], fuentes: ['PDF Introducción a la programación §2-3', 'Píldora 03'] },
  { id: 'entorno', num: '04', titulo: 'Tu entorno y tu primer programa', corto: 'Primer programa', formula: 'static void Main(string[] args)', familia: 'fundamentos', resumen: 'Instalar VS Code, C# Dev Kit y .NET SDK, crear el proyecto y entender cada palabra de Program.cs.', clases: ['2026-10-07', '2026-10-14', '2026-10-21', '2026-10-28'], fuentes: ['PDF Estructura de un programa §1-2, §7', 'Píldora 08', 'PDF guía del Reto 1'] },
  { id: 'variables', num: '05', titulo: 'Variables, tipos e identificadores', corto: 'Variables', formula: 'tipo nombre = valor;', familia: 'datos', resumen: 'Cajas con nombre en la memoria: qué cabe en cada tipo y cómo se llaman las cosas en C#.', clases: ['2026-10-14'], fuentes: ['PDF Estructura de un programa §3', 'Píldoras 08 y 09'] },
  { id: 'constantes', num: '06', titulo: 'Constantes y literales', corto: 'Constantes', formula: 'const double IVA_GENERAL = 0.21;', familia: 'datos', resumen: 'Valores que no cambian nunca y la forma exacta de escribir cada valor en el código.', clases: ['2026-10-14', '2026-10-28'], fuentes: ['PDF Estructura de un programa §4', 'Píldora 13'] },
  { id: 'operadores', num: '07', titulo: 'Operadores y expresiones', corto: 'Operadores', formula: 'resultado = a + b * c;', familia: 'datos', resumen: 'Calcular, comparar y combinar condiciones, y en qué orden lo hace C#.', clases: ['2026-10-14'], fuentes: ['PDF Estructura de un programa §5', 'Píldora 13'] },
  { id: 'conversiones', num: '08', titulo: 'Conversiones y entrada de datos', corto: 'Conversiones', formula: 'int edad = int.Parse(Console.ReadLine());', familia: 'datos', resumen: 'Leer lo que escribe el usuario y convertirlo al tipo correcto sin que el programa se rompa.', clases: ['2026-10-14', '2026-10-21'], fuentes: ['PDF Estructura de un programa §6', 'Píldora 14'] },
  { id: 'decisiones', num: '09', titulo: 'Decisiones: if, else if y switch', corto: 'Decisiones', formula: 'if (condición) { … } else { … }', familia: 'control', resumen: 'Hacer que el programa elija un camino según los datos.', clases: ['2026-10-21', '2026-10-28'], fuentes: ['PDF Programación estructurada §6'] },
  { id: 'bucles', num: '10', titulo: 'Bucles: for, while y do-while', corto: 'Bucles', formula: 'for (inicio; condición; cambio) { … }', familia: 'control', resumen: 'Repetir sin copiar código: contadores, acumuladores y tablas.', clases: ['2026-10-28'], fuentes: ['PDF Programación estructurada §7-8'] },
  { id: 'errores', num: '11', titulo: 'Cadenas, Math y errores', corto: 'Errores', formula: 'try { … } catch (Exception) { … }', familia: 'control', resumen: 'Limpiar textos, calcular con Math, validar datos y capturar excepciones. Más depuración, pruebas y documentación.', clases: ['2026-11-04'], fuentes: ['PDF Programación estructurada §3-4, §9-12'] },
  { id: 'reto1', num: '12', titulo: 'Reto 1: el motor financiero', corto: 'Reto 1', formula: 'IVA + validación + amortización', familia: 'reto', resumen: 'Qué pide el reto, cómo se evalúa y cómo construirlo paso a paso sin copiar.', clases: ['2026-10-07', '2026-10-28', '2026-11-04'], fuentes: ['Reto Profesional 1', 'PDF guía del Reto 1 (04/11)', 'Ejercicio 15'] },
];

export const CARGAR: Record<string, () => Promise<Modulo>> = {
  algoritmos: () => import('./l01-algoritmos.tsx'),
  diagramas: () => import('./l02-diagramas.tsx'),
  lenguajes: () => import('./l03-lenguajes.tsx'),
  entorno: () => import('./l04-entorno.tsx'),
  variables: () => import('./l05-variables.tsx'),
  constantes: () => import('./l06-constantes.tsx'),
  operadores: () => import('./l07-operadores.tsx'),
  conversiones: () => import('./l08-conversiones.tsx'),
  decisiones: () => import('./l09-decisiones.tsx'),
  bucles: () => import('./l10-bucles.tsx'),
  errores: () => import('./l11-errores.tsx'),
  reto1: () => import('./l12-reto1.tsx'),
};

export const enlace = (id: string, seccion?: string) => `#/l/${id}${seccion ? `/${seccion}` : ''}`;
