// Diagrama E-R binario con la notación de los apuntes del curso:
// caja con el nombre de la entidad y un atributo por línea (P·, U·, N·…), rombo con el tipo (1:N),
// nombre de la interrelación encima y el paréntesis (mín,máx) junto a la entidad que se cuenta.

export interface Entidad { nombre: string; atributos: string[] }
type Estado = 'ok' | 'mal' | undefined;

interface Props {
  a: Entidad;
  b: Entidad;
  rel: string;
  tipo?: string;
  /** Paréntesis que va junto a A: cuántos A hay por cada B. */
  cardA?: string;
  /** Paréntesis que va junto a B: cuántos B hay por cada A. */
  cardB?: string;
  estadoA?: Estado;
  estadoB?: Estado;
  /** Punta de flecha hacia B (el lado N), como en las figuras de los apuntes. */
  flechaB?: boolean;
  etiqueta: string;
  /** Cajas sin atributos y lienzo estrecho, para paneles laterales. */
  compacto?: boolean;
}

const CAB = 34, FILA = 23;
const color = (e: Estado) => (e === 'ok' ? 'var(--verde)' : e === 'mal' ? 'var(--rojo)' : 'var(--t10)');

const altoCaja = (e: Entidad) => (e.atributos.length ? CAB + 10 + e.atributos.length * FILA : CAB);

function Caja({ x, y, e, AN }: { x: number; y: number; e: Entidad; AN: number }) {
  const alto = altoCaja(e);
  return (
    <g>
      <rect x={x} y={y} width={AN} height={alto} rx="8" fill="var(--t2)" stroke="var(--t6)" strokeWidth="1.5" />
      <rect x={x} y={y} width={AN} height={CAB} rx="8" fill="color-mix(in srgb, var(--familia-solido) 18%, var(--t2))" stroke="var(--t6)" strokeWidth="1.5" />
      <text x={x + AN / 2} y={y + 22} textAnchor="middle" style={{ font: '800 14px var(--f-titulo)', letterSpacing: '.04em' }} fill="var(--t10)">{e.nombre}</text>
      {e.atributos.map((t, i) => (
        <text key={t} x={x + 12} y={y + CAB + 22 + i * FILA} style={{ font: '500 13.5px var(--f-texto)' }} fill={t.includes('·') ? 'var(--t10)' : 'var(--t9)'}>
          {t}
        </text>
      ))}
    </g>
  );
}

export function DiagramaER({ a, b, rel, tipo = '', cardA, cardB, estadoA, estadoB, flechaB, etiqueta, compacto }: Props) {
  const W = compacto ? 460 : 640, AN = compacto ? 132 : 172, top = 40, r = 42;
  const cy = top + (a.atributos.length || b.atributos.length ? 41 : CAB / 2), cx = W / 2;
  const H = Math.max(top + Math.max(altoCaja(a), altoCaja(b)), cy + 26) + 10;
  const xA = 8, xB = W - AN - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={etiqueta} style={{ width: '100%', minWidth: compacto ? 0 : 520, height: 'auto', display: 'block' }}>
      <defs>
        <marker id="er-punta" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0 0L10 5L0 10z" fill="var(--t7)" />
        </marker>
      </defs>
      <Caja x={xA} y={top} e={a} AN={AN} />
      <Caja x={xB} y={top} e={b} AN={AN} />
      <line x1={xA + AN} y1={cy} x2={cx - r} y2={cy} stroke="var(--t7)" strokeWidth="1.5" />
      <line x1={cx + r} y1={cy} x2={xB - 2} y2={cy} stroke="var(--t7)" strokeWidth="1.5" markerEnd={flechaB ? 'url(#er-punta)' : undefined} />
      <path d={`M${cx - r} ${cy}L${cx} ${cy - 26}L${cx + r} ${cy}L${cx} ${cy + 26}z`} fill="color-mix(in srgb, var(--familia-solido) 14%, var(--t2))" stroke="var(--t6)" strokeWidth="1.5" />
      <text x={cx} y={cy + 5} textAnchor="middle" style={{ font: '800 14px var(--f-titulo)' }} fill="var(--t10)">{tipo}</text>
      {rel.trim() && <>
        <rect x={cx - 66} y={4} width={132} height={26} rx="6" fill="var(--t1)" stroke="var(--t5)" />
        <text x={cx} y={22} textAnchor="middle" style={{ font: '600 13px var(--f-texto)' }} fill="var(--t10)">{rel}</text>
      </>}
      {cardA && <text x={xA + AN + 14} y={cy - 9} style={{ font: '700 14px var(--f-texto)' }} fill={color(estadoA)}>{cardA}</text>}
      {cardB && <text x={xB - 14} y={cy - 9} textAnchor="end" style={{ font: '700 14px var(--f-texto)' }} fill={color(estadoB)}>{cardB}</text>}
    </svg>
  );
}
