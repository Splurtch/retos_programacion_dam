import type { ComponentType, ReactNode } from 'react';

export type Familia = 'sgbd' | 'modelos' | 'er' | 'reto';

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
  sgbd: { nombre: 'Datos y SGBD', texto: 'Qué es una base de datos, por qué no basta con ficheros y qué hace el gestor por ti.' },
  modelos: { nombre: 'Modelos', texto: 'Las formas de organizar los datos y, a fondo, la que usarás todo el curso: la relacional.' },
  er: { nombre: 'Modelo E-R', texto: 'El plano de los datos: entidades, atributos, relaciones y cardinalidades. Es lo que pide el reto.' },
  reto: { nombre: 'Reto 1', texto: 'Del concepto al catálogo: el diseño de la tienda de informática, paso a paso y sin copiar.' },
};

export const LAMINAS: Meta[] = [
  { id: 'datos', num: '01', titulo: 'Datos, información y bases de datos', corto: 'Datos', formula: 'dato + contexto = información', familia: 'sgbd', resumen: 'Qué es una base de datos, qué la hace útil y los tres tipos de datos: estructurados, semiestructurados y no estructurados.', clases: ['2026-10-13', '2026-10-20'], fuentes: ['PDF T1 §1', 'Píldora 05'] },
  { id: 'ficheros', num: '02', titulo: 'Ficheros frente a SGBD', corto: 'Ficheros', formula: 'CSV → índice → SGBD', familia: 'sgbd', resumen: 'Ficheros planos, indexados y de acceso directo: cuándo bastan y cuándo hace falta un gestor.', clases: ['2026-10-13'], fuentes: ['Píldoras 06 y 19'] },
  { id: 'sgbd', num: '03', titulo: 'El SGBD por dentro', corto: 'SGBD', formula: 'físico · lógico · vista', familia: 'sgbd', resumen: 'Sus cinco garantías, la arquitectura de tres niveles, sus funciones, sus lenguajes y la seguridad.', clases: ['2026-11-03'], fuentes: ['PDF T1 §3-4', 'Píldoras 05, 18, 20 y 21'] },
  { id: 'modelos', num: '04', titulo: 'Modelos de bases de datos', corto: 'Modelos', formula: 'relacional · objetos · NoSQL', familia: 'modelos', resumen: 'Relacional, orientado a objetos y las cuatro familias NoSQL. Cómo elegir y hacia dónde va todo.', clases: ['2026-10-20', '2026-10-27', '2026-11-10'], fuentes: ['PDF T1 §2 y §5', 'Píldoras 07 y 09'] },
  { id: 'relacional', num: '05', titulo: 'El modelo relacional', corto: 'Relacional', formula: 'tabla · fila · columna · PK · FK', familia: 'modelos', resumen: 'Tablas, claves primarias y ajenas, integridad referencial, NULL, índices y vistas.', clases: ['2026-10-20', '2026-11-03'], fuentes: ['PDF T1 §2.1', 'Píldoras 09, 16, 17 y 19'] },
  { id: 'entidades', num: '06', titulo: 'Entidades y atributos', corto: 'Entidades', formula: 'P· U· N· M· NM· D· C·', familia: 'er', resumen: 'Qué es una entidad, cómo se describe y cómo se marca cada tipo de atributo en la notación del curso.', clases: ['2026-11-10'], fuentes: ['PDF Modelización y diagramas ER §1-2', 'PPT 2'] },
  { id: 'cardinalidad', num: '07', titulo: 'Interrelaciones y cardinalidad', corto: 'Cardinalidad', formula: '(mín, máx) → 1:1 · 1:N · N:M', familia: 'er', resumen: 'Unir entidades con un rombo, leer la relación en los dos sentidos y colocar cada paréntesis en su sitio.', clases: ['2026-11-10'], fuentes: ['PDF Modelización y diagramas ER §3', 'PPT 2'] },
  { id: 'avanzado', num: '08', titulo: 'Más allá del reto', corto: 'E-R avanzado', formula: 'ternarias · reflexivas · PK → FK', familia: 'er', resumen: 'Atributos codificables y en las relaciones, relaciones ternarias y reflexivas, y cómo se propagan las claves.', clases: [], fuentes: ['PDF Modelización y diagramas ER §4-8'] },
  { id: 'reto1', num: '09', titulo: 'Reto 1: del concepto al catálogo', corto: 'Reto 1', formula: 'entidades · diagrama · fichas · PDF', familia: 'reto', resumen: 'Qué piden, cómo se puntúa y cada paso del diseño de la tienda, comprobado con tu propio modelo.', clases: ['2026-10-27', '2026-11-10'], fuentes: ['Reto Profesional 1', 'Clase del 10/11'] },
];

export const CARGAR: Record<string, () => Promise<Modulo>> = {
  datos: () => import('./l01-datos.tsx'),
  ficheros: () => import('./l02-ficheros.tsx'),
  sgbd: () => import('./l03-sgbd.tsx'),
  modelos: () => import('./l04-modelos.tsx'),
  relacional: () => import('./l05-relacional.tsx'),
  entidades: () => import('./l06-entidades.tsx'),
  cardinalidad: () => import('./l07-cardinalidad.tsx'),
  avanzado: () => import('./l08-avanzado.tsx'),
  reto1: () => import('./l09-reto1.tsx'),
};

export const enlace = (id: string, seccion?: string) => `#/l/${id}${seccion ? `/${seccion}` : ''}`;
