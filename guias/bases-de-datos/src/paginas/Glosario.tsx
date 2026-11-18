import { useMemo, useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';
import { LAMINAS, enlace } from '../laminas/index.ts';
import { IcoLupa } from '../ui/iconos.tsx';

const TERMINOS: [string, string, string][] = [
  ["Dato", "Valor aislado, sin contexto: «34», «Madrid».", 'datos'],
  ["Información", "Datos con sentido, interpretados juntos.", 'datos'],
  ["Base de datos", "Conjunto organizado de datos almacenados de forma estructurada y sistemática.", 'datos'],
  ["Persistencia", "Los datos perduran aunque se apague el sistema.", 'datos'],
  ["Datos estructurados", "Organizados en tablas con un esquema rígido. Se consultan con SQL.", 'datos'],
  ["Datos semiestructurados", "Estructura flexible con etiquetas: JSON, XML, correo electrónico.", 'datos'],
  ["Datos no estructurados", "Sin esquema: imágenes, vídeo, audio, texto libre.", 'datos'],
  ["Big Data", "Gestión de volúmenes masivos de datos para convertirlos en información útil.", 'datos'],
  ["JSON", "Formato de texto con pares nombre: valor y listas. Típico de los datos semiestructurados.", 'datos'],
  ["Fichero", "Unidad lógica de datos con nombre, extensión y metadatos, gestionada por el sistema operativo.", 'ficheros'],
  ["CSV / TSV", "Ficheros planos con campos separados por comas o por tabuladores.", 'ficheros'],
  ["Fichero indexado", "Fichero con un índice de pares (clave, dirección) para saltar directo a un registro.", 'ficheros'],
  ["Hashing", "Función que convierte una clave en una dirección. Rápido por clave, malo para rangos.", 'ficheros'],
  ["Colisión", "Dos claves distintas a las que el hash asigna la misma dirección.", 'ficheros'],
  ["SGBD", "Sistema gestor de bases de datos: software para crear, gestionar y consultar bases de datos.", 'sgbd'],
  ["Transacción", "Grupo de operaciones que se ejecutan todas o ninguna. Termina en COMMIT o ROLLBACK.", 'sgbd'],
  ["Acceso concurrente", "Varios usuarios trabajan a la vez sin pisarse.", 'sgbd'],
  ["Independencia de datos", "Cambiar cómo se almacenan los datos sin romper los programas que los usan.", 'sgbd'],
  ["Nivel físico / lógico / de vista", "Las tres capas del SGBD: almacenamiento, esquema y lo que ve cada usuario.", 'sgbd'],
  ["DDL", "Lenguaje de definición: CREATE, ALTER, DROP. Cambia la estructura.", 'sgbd'],
  ["DML", "Lenguaje de manipulación: SELECT, INSERT, UPDATE, DELETE. Cambia o lee el contenido.", 'sgbd'],
  ["SQL", "Structured Query Language: el lenguaje estándar de las bases de datos relacionales.", 'sgbd'],
  ["Rol y privilegio", "Un rol agrupa privilegios (permisos) que se asignan a usuarios. GRANT los da; REVOKE los quita.", 'sgbd'],
  ["Catálogo", "Diccionario de datos: los metadatos que el SGBD guarda sobre sí mismo (tablas, usuarios, permisos).", 'sgbd'],
  ["Copia de seguridad", "Backup: respaldo de los datos para recuperarlos (restore) tras un fallo.", 'sgbd'],
  ["Modelo relacional", "Datos en tablas conectadas por claves. Propuesto por Codd en 1970.", 'modelos'],
  ["Modelo orientado a objetos", "Datos como objetos con atributos y métodos. Se consulta con OQL.", 'modelos'],
  ["NoSQL", "Familia de modelos no relacionales: clave-valor, documentos, columnas y grafos.", 'modelos'],
  ["Escalabilidad vertical / horizontal", "Una máquina más potente / más máquinas.", 'modelos'],
  ["Multimodelo", "Un solo sistema que maneja varios modelos de datos.", 'modelos'],
  ["DBaaS", "Base de datos como servicio en la nube: el proveedor la configura, actualiza y respalda.", 'modelos'],
  ["OLTP / OLAP", "Bases de datos para transacciones del día a día / para análisis.", 'modelos'],
  ["Tabla (relación)", "Estructura de filas y columnas que guarda un concepto.", 'relacional'],
  ["Tupla", "Fila de una tabla. También registro.", 'relacional'],
  ["Campo", "Columna de una tabla. También atributo.", 'relacional'],
  ["Clave primaria (PK)", "Identifica cada fila: no se repite y no puede ser nula. «Quién soy».", 'relacional'],
  ["Clave ajena (FK)", "Columna que guarda la clave primaria de otra tabla. «A quién pertenezco».", 'relacional'],
  ["Integridad referencial", "Toda clave ajena apunta a una fila que existe.", 'relacional'],
  ["NULL", "Ausencia de valor: desconocido o no aplicable. No es 0 ni texto vacío.", 'relacional'],
  ["Redundancia", "Repetición innecesaria de datos, fuente de contradicciones.", 'relacional'],
  ["Normalización", "Repartir los datos en tablas relacionadas para eliminar redundancias.", 'relacional'],
  ["Vista", "Consulta guardada con nombre que se usa como una tabla.", 'relacional'],
  ["Índice", "Estructura que acelera las búsquedas por una columna a cambio de espacio y escrituras.", 'relacional'],
  ["Modelo entidad-relación", "Plano conceptual de los datos: entidades, atributos e interrelaciones.", 'entidades'],
  ["Entidad", "Cosa o concepto del que se guarda información. En singular y mayúsculas: PRODUCTO.", 'entidades'],
  ["Ocurrencia", "Cada caso concreto de una entidad: el producto P1. Será una fila.", 'entidades'],
  ["Atributo", "Dato que describe a una entidad. Será una columna.", 'entidades'],
  ["Dominio", "Conjunto de valores que puede tomar un atributo.", 'entidades'],
  ["Atributo principal (P·)", "Identifica cada ocurrencia y se usa para relacionarla. Único, no nulo y estable.", 'entidades'],
  ["Atributo secundario (U·)", "Único, pero no se usa para relacionar.", 'entidades'],
  ["Atributo nulo (N·)", "Puede quedar vacío: segundo apellido.", 'entidades'],
  ["Atributo multivalorado (M·)", "Puede tener varios valores: teléfonos.", 'entidades'],
  ["Atributo derivado (D·)", "Se calcula a partir de otros: edad.", 'entidades'],
  ["Atributo compuesto", "Se divide en partes con sentido propio: domicilio.", 'entidades'],
  ["Interrelación", "Asociación entre entidades. Se dibuja con un rombo y se nombra con un verbo.", 'cardinalidad'],
  ["Cardinalidad", "Par (mínimo, máximo) de ocurrencias que se asocian con una de la otra entidad.", 'cardinalidad'],
  ["Cardinalidad mínima", "0 si la asociación es opcional; 1 si es obligatoria.", 'cardinalidad'],
  ["Cardinalidad máxima", "1 si como mucho una; n si pueden ser muchas.", 'cardinalidad'],
  ["1:1, 1:N, N:M", "Tipos de interrelación según los dos máximos.", 'cardinalidad'],
  ["Atributo codificable (C·)", "Solo admite una lista cerrada de valores. En SQL, CHECK.", 'avanzado'],
  ["Interrelación ternaria", "Une tres entidades a la vez.", 'avanzado'],
  ["Interrelación reflexiva", "Relaciona una entidad consigo misma, con roles.", 'avanzado'],
  ["Propagación de claves", "Copiar la clave primaria de una tabla en otra al pasar el E-R a tablas.", 'avanzado'],
  ["Fichas de ejemplo", "Las ocurrencias del caso dibujadas con sus valores, para comprobar que el modelo las admite.", 'reto1'],
  ["draw.io", "Herramienta gratuita de diagramas (app.diagrams.net) recomendada en clase para el E-R.", 'reto1'],
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
        <TextInput label="Buscar un término" type="search" value={q} onChange={setQ} placeholder="entidad, clave, NULL…" isLabelHidden />
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
