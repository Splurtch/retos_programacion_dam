import { Fragment, type ReactNode } from 'react';

const PALABRAS = new Set(
  'using namespace class static void public private return if else switch case default break continue for foreach in while do new const out try catch finally throw true false null var'.split(' '),
);
const TIPOS = new Set('int long short byte sbyte uint ulong ushort double float decimal string char bool object Exception'.split(' '));
const CLASES = new Set('Console Math Convert Int32 String System Program'.split(' '));

const REGLA = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\$?"(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)')|(\b\d+(?:\.\d+)?[fFdDmM]?\b|\b0x[0-9a-fA-F]+\b)|([A-Za-z_]\w*)|(\S)/gm;

/** Resaltado de C# por tokens. Cada token lleva una clase `cs-*` coloreada desde la paleta. */
export function resaltar(linea: string): ReactNode[] {
  const out: ReactNode[] = [];
  let ultimo = 0;
  for (const m of linea.matchAll(REGLA)) {
    const i = m.index ?? 0;
    if (i > ultimo) out.push(linea.slice(ultimo, i));
    const [txt, com1, com2, cad, car, num, id] = m;
    let cls = '';
    if (com1 || com2) cls = 'cs-com';
    else if (cad) cls = 'cs-str';
    else if (car) cls = 'cs-str';
    else if (num) cls = 'cs-num';
    else if (id) cls = PALABRAS.has(id) ? 'cs-kw' : TIPOS.has(id) ? 'cs-tipo' : CLASES.has(id) ? 'cs-clase' : linea[i + id.length] === '(' ? 'cs-met' : '';
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

/** Bloque de código C# legible: números de línea, resaltado y la franja de ejecución en la línea activa. */
export function Codigo({ codigo, activa, marcas, titulo, numeros = true }: Props) {
  const lineas = codigo.replace(/\n$/, '').split('\n');
  return (
    <figure className="codigo">
      {titulo && <figcaption>{titulo}</figcaption>}
      <pre tabIndex={0} aria-label={titulo ?? 'Código C#'}>
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
