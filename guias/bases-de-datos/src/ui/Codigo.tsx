import { Fragment, type ReactNode } from 'react';

// SQL no distingue mayúsculas: se compara en mayúsculas.
const PALABRAS = new Set(
  'SELECT FROM WHERE INSERT INTO VALUES UPDATE SET DELETE CREATE ALTER DROP TABLE DATABASE VIEW INDEX USE SHOW DESCRIBE AS ON AND OR NOT NULL PRIMARY KEY FOREIGN REFERENCES UNIQUE DEFAULT CHECK AUTO_INCREMENT CONSTRAINT ADD GRANT REVOKE TO START TRANSACTION COMMIT ROLLBACK CASCADE IN BETWEEN ORDER BY JOIN'.split(' '),
);
const TIPOS = new Set('INT INTEGER SMALLINT TINYINT BIGINT DECIMAL NUMERIC FLOAT REAL VARCHAR CHAR TEXT DATE DATETIME TIMESTAMP BOOLEAN BLOB JSON ENUM'.split(' '));

const REGLA = /(--.*$)|(\/\*[\s\S]*?\*\/)|('(?:[^'\\]|\\.)*')|("(?:[^"\\]|\\.)*")|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)|(\S)/gm;

/** Resaltado de SQL por tokens. Cada token lleva una clase `cs-*` coloreada desde la paleta. */
export function resaltar(linea: string): ReactNode[] {
  const out: ReactNode[] = [];
  let ultimo = 0;
  for (const m of linea.matchAll(REGLA)) {
    const i = m.index ?? 0;
    if (i > ultimo) out.push(linea.slice(ultimo, i));
    const [txt, com1, com2, cad, ident, num, id] = m;
    let cls = '';
    if (com1 || com2) cls = 'cs-com';
    else if (cad) cls = 'cs-str';
    else if (ident) cls = 'cs-clase';
    else if (num) cls = 'cs-num';
    else if (id) { const u = id.toUpperCase(); cls = PALABRAS.has(u) ? 'cs-kw' : TIPOS.has(u) ? 'cs-tipo' : ''; }
    else cls = 'cs-op';
    out.push(cls ? <span key={i} className={cls}>{txt}</span> : <Fragment key={i}>{txt}</Fragment>);
    ultimo = i + txt.length;
  }
  if (ultimo < linea.length) out.push(linea.slice(ultimo));
  return out;
}

interface Props {
  codigo: string;
  activa?: number;
  marcas?: Record<number, 'ok' | 'error'>;
  titulo?: string;
  numeros?: boolean;
}

/** Bloque de código SQL legible: números de línea, resaltado y la franja de ejecución en la línea activa. */
export function Codigo({ codigo, activa, marcas, titulo, numeros = true }: Props) {
  const lineas = codigo.replace(/\n$/, '').split('\n');
  return (
    <figure className="codigo">
      {titulo && <figcaption>{titulo}</figcaption>}
      <pre tabIndex={0} aria-label={titulo ?? 'Código SQL'}>
        <code>
          {lineas.map((l, i) => {
            const n = i + 1;
            const estado = n === activa ? 'activa' : marcas?.[n];
            return (
              <span key={n} className="cl" data-estado={estado} aria-current={n === activa ? 'step' : undefined}>
                {numeros && <span className="cl-n" aria-hidden="true">{n}</span>}
                <span className="cl-t">{l ? resaltar(l) : ' '}</span>
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}

/** Código en línea dentro de la prosa, también resaltado. */
export function C({ children }: { children: string }) {
  return <code className="ci">{resaltar(children)}</code>;
}
