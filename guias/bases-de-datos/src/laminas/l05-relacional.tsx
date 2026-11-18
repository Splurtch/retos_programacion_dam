import { useState } from 'react';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>En el modelo relacional todo son <strong>tablas</strong>. Cada tabla guarda un solo concepto; cada fila es un caso concreto y cada columna, una característica. Las tablas se conectan sin copiar datos: la tabla de libros no repite el nombre del autor, solo guarda su código. Dos claves sostienen el invento: la primaria dice «quién soy» y la ajena, «a quién pertenezco».</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Tablas con filas y columnas, una clave primaria por tabla y claves ajenas que apuntan a otras tablas.'],
  ['Sinónimos', 'Tabla = relación. Fila = tupla = registro. Columna = atributo = campo.'],
  ['Se confunde con', 'El modelo E-R. El E-R es el plano conceptual (cajas y rombos); el relacional, las tablas en que se convierte.'],
  ['Hábitat', 'MySQL, PostgreSQL, Oracle, SQL Server. En el Reto 2 la tienda pasa a tablas; en el Reto 1, todavía no.'],
];

export const secciones = [
  { id: 'piezas', titulo: 'Tabla, fila, columna, valor' },
  { id: 'claves', titulo: 'Clave primaria y clave ajena' },
  { id: 'integridad', titulo: 'Integridad referencial' },
  { id: 'redundancia', titulo: 'Redundancia y normalización' },
  { id: 'null', titulo: 'NULL, índices y vistas' },
];

// ---------- Destacado: las reglas en acción ----------
interface Autor { id: string; nombre: string }
interface Libro { id: string; titulo: string; autor: string | null }
const AUT0: Autor[] = [{ id: 'A1', nombre: 'Tolkien' }, { id: 'A2', nombre: 'Rowling' }, { id: 'A3', nombre: 'Stephen King' }];
const LIB0: Libro[] = [{ id: 'L1', titulo: 'El Hobbit', autor: 'A1' }, { id: 'L2', titulo: 'Harry Potter', autor: 'A2' }, { id: 'L3', titulo: 'Carrie', autor: 'A3' }];

export function Destacado() {
  const [aut, setAut] = useState(AUT0);
  const [lib, setLib] = useState(LIB0);
  const [msg, setMsg] = useState<{ ok: boolean; t: string; sql: string }>();
  const OPS: [string, string, () => { ok: boolean; t: string }][] = [
    ['Añadir el libro L4 «El Silmarillion» de A1', "INSERT INTO libros VALUES ('L4', 'El Silmarillion', 'A1');", () => {
      if (lib.some((l) => l.id === 'L4')) return { ok: false, t: 'Rechazado: L4 ya existe. La clave primaria no se repite.' };
      setLib([...lib, { id: 'L4', titulo: 'El Silmarillion', autor: 'A1' }]); return { ok: true, t: 'Aceptado: L4 es nuevo y A1 existe en autores.' };
    }],
    ['Añadir otro libro con el código L1', "INSERT INTO libros VALUES ('L1', 'It', 'A3');", () => ({ ok: false, t: 'Rechazado por la clave primaria: ya hay un L1. Dos filas no pueden tener la misma identidad.' })],
    ['Añadir un libro del autor A9, que no existe', "INSERT INTO libros VALUES ('L5', 'Anónimo', 'A9');", () => ({ ok: false, t: 'Rechazado por la clave ajena: A9 no está en autores. Sería un libro huérfano.' })],
    ['Añadir un autor sin nombre', "INSERT INTO autores VALUES ('A4', NULL);", () => ({ ok: false, t: 'Rechazado por NOT NULL: el nombre es obligatorio.' })],
    ['Borrar a Tolkien (A1)', "DELETE FROM autores WHERE id_autor = 'A1';", () => {
      if (lib.some((l) => l.autor === 'A1')) return { ok: false, t: 'Rechazado por la integridad referencial: hay libros que apuntan a A1. Borrarlo los dejaría huérfanos.' };
      setAut(aut.filter((a) => a.id !== 'A1')); return { ok: true, t: 'Aceptado: ya no quedaba ningún libro de A1.' };
    }],
    ['Borrar el libro Carrie (L3)', "DELETE FROM libros WHERE id_libro = 'L3';", () => {
      if (!lib.some((l) => l.id === 'L3')) return { ok: false, t: 'No hay ningún L3 que borrar.' };
      setLib(lib.filter((l) => l.id !== 'L3')); return { ok: true, t: 'Aceptado: nadie apunta a un libro, así que se puede borrar sin romper nada.' };
    }],
  ];
  const tabla = (titulo: string, cab: string[], filas: string[][]) => (
    <div style={{ flex: '1 1 200px', minWidth: 0 }}>
      <div style={{ font: '800 12.5px var(--f-titulo)', letterSpacing: '.06em', color: 'var(--familia)', marginBottom: 4 }}>{titulo}</div>
      <table className="tabla" style={{ margin: 0, fontSize: 14 }}>
        <thead><tr>{cab.map((c) => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{filas.map((f) => <tr key={f[0]}>{f.map((v, i) => <td key={i}>{v}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
  return (
    <Panel titulo="Intenta romper la biblioteca">
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 14 }}>
        {tabla('AUTORES', ['id_autor PK', 'nombre'], aut.map((a) => [a.id, a.nombre]))}
        {tabla('LIBROS', ['id_libro PK', 'titulo', 'id_autor FK'], lib.map((l) => [l.id, l.titulo, l.autor ?? 'NULL']))}
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {OPS.map(([n, sql, f]) => <button key={n} type="button" className="opcion" style={{ textAlign: 'left', borderRadius: 12 }} onClick={() => setMsg({ ...f(), sql })}>{n}</button>)}
        <button type="button" className="opcion" style={{ textAlign: 'left', borderRadius: 12 }} onClick={() => { setAut(AUT0); setLib(LIB0); setMsg(undefined); }}>Restaurar las tablas</button>
      </div>
      {msg && <div className="resultado" data-ok={msg.ok} aria-live="polite" style={{ marginTop: 12 }}><code style={{ fontSize: 13 }}>{msg.sql}</code><br />{msg.t}</div>}
    </Panel>
  );
}

// ---------- ON DELETE ----------
function AlBorrar() {
  const [m, setM] = useState<'restrict' | 'cascade' | 'null'>('restrict');
  const filas = { restrict: [['1001', '42'], ['1002', '42'], ['1003', '42']], cascade: [], null: [['1001', 'NULL'], ['1002', 'NULL'], ['1003', 'NULL']] }[m];
  const nota = {
    restrict: 'Por defecto: no te deja borrar al cliente 42 mientras tenga pedidos.',
    cascade: 'ON DELETE CASCADE: al borrar al cliente 42 se borran también sus tres pedidos.',
    null: 'ON DELETE SET NULL: los pedidos se quedan, pero «sin cliente».',
  }[m];
  return (
    <Panel titulo="Borras al cliente 42, que tiene tres pedidos">
      <SegmentedControl label="Acción referencial" value={m} onChange={(v) => setM(v as typeof m)}>
        <SegmentedControlItem value="restrict" label="Por defecto" />
        <SegmentedControlItem value="cascade" label="CASCADE" />
        <SegmentedControlItem value="null" label="SET NULL" />
      </SegmentedControl>
      <table className="tabla" style={{ marginTop: 14 }}>
        <thead><tr><th>id_pedido</th><th>cliente_id</th></tr></thead>
        <tbody>{filas.length ? filas.map(([a, b]) => <tr key={a}><td>{a}</td><td>{b}</td></tr>) : <tr><td colSpan={2} style={{ color: 'var(--t8)' }}>(sin filas)</td></tr>}</tbody>
      </table>
      <p className="resultado" style={{ margin: 0 }}>{nota}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="piezas" titulo="Tabla, fila, columna, valor">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Pieza</th><th>Otros nombres</th><th>Qué es</th></tr></thead>
            <tbody>
              <tr><td><strong>Tabla</strong></td><td>Relación</td><td>Estructura que agrupa los datos de un concepto</td></tr>
              <tr><td><strong>Fila</strong></td><td>Tupla, registro</td><td>Un caso concreto: un cliente, un pedido</td></tr>
              <tr><td><strong>Columna</strong></td><td>Atributo, campo</td><td>Una característica: nombre, correo</td></tr>
              <tr><td><strong>Valor</strong></td><td>—</td><td>El contenido de una celda: el cruce de una fila y una columna</td></tr>
            </tbody>
          </table>
        </div>
        <p>Cuidado con la palabra <em>relación</em>: en el modelo relacional significa <strong>tabla</strong>. La conexión entre tablas o entidades es la <em>interrelación</em>.</p>
      </Bloque>

      <Bloque id="claves" titulo="Clave primaria y clave ajena">
        <p>La <T def="Atributo (o conjunto) que identifica de forma única cada fila. No se repite y no puede ser nulo.">clave primaria</T> (PK, <em>primary key</em>) identifica cada fila: <strong>no se repite y no puede ser nula</strong>. Puede haber dos «Ana López», pero no dos clientes con el ID 3. Si una sola columna no basta, se usa una <strong>clave compuesta</strong>, como el par (factura_id, cliente_id).</p>
        <p>La <T def="Columna que guarda el valor de la clave primaria de otra tabla para relacionarlas.">clave ajena</T> (FK, <em>foreign key</em>, también «foránea») guarda la clave primaria de <strong>otra</strong> tabla. Así <code>pedidos.id_cliente</code> dice de quién es cada pedido. Solo puede apuntar a una columna única (una PK o una UNIQUE).</p>
        <EnClase fecha="20/10">
          <p>La regla mnemotécnica de clase: la primaria responde a <strong>«quién soy»</strong>; la foránea, a <strong>«a quién pertenezco»</strong>. Y una advertencia: una clave ajena sí se repite (un cliente tiene muchos pedidos); una primaria nunca.</p>
        </EnClase>
        <ParaElReto>
          <p>En la lámina 08 verás que, al pasar el E-R a tablas, la clave de CATEGORIA <em>viajaría</em> a PRODUCTO como clave ajena. Eso es justo lo que el Reto 1 <strong>no</strong> pide («no hay que propagar claves»). En el reto, PRODUCTO lleva solo sus cuatro atributos.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="integridad" titulo="Integridad referencial">
        <p>La <T def="Regla que garantiza que toda clave ajena apunta a una fila que existe.">integridad referencial</T> garantiza que las referencias son válidas: no puede haber un pedido de un cliente que no existe, ni se puede borrar un cliente dejando sus pedidos huérfanos. La lámina de arriba lo pone a prueba. Qué pasa exactamente al borrar lo decide la clave ajena:</p>
        <AlBorrar />
      </Bloque>

      <Bloque id="redundancia" titulo="Redundancia y normalización">
        <p>Si guardaras el nombre y el correo del cliente en cada pedido, los repetirías una y otra vez: eso es <strong>redundancia</strong>. Y cuando el cliente cambiara de correo, tendrías que actualizarlo en todos sus pedidos; si se te olvida uno, los datos se contradicen (una <strong>anomalía de actualización</strong>).</p>
        <p>La <T def="Proceso de diseño que reparte los datos en tablas relacionadas para eliminar redundancias y anomalías.">normalización</T> lo evita separando cada concepto en su tabla y uniéndolas con claves: el correo vive en un solo sitio. La forma práctica de pensarlo: <strong>una tabla, un concepto</strong>. Se estudia a fondo más adelante; el Reto 1 dice explícitamente que no hay que normalizar a 3FN.</p>
        <p>El relacional también ofrece <strong>independencia</strong>: puedes reorganizar cómo se guardan los datos en disco sin cambiar cómo se consultan.</p>
      </Bloque>

      <Bloque id="null" titulo="NULL, índices y vistas">
        <ul>
          <li><strong>NULL</strong> significa «sin valor»: desconocido o que no aplica. No es 0 ni texto vacío. Una clave primaria nunca puede ser NULL; una columna marcada <code>NOT NULL</code> tampoco. En el E-R, los atributos que pueden ser NULL llevan la marca <code>N·</code> (<a href={enlace('entidades')}>lámina 06</a>).</li>
          <li><strong>Índice</strong>: estructura aparte que acelera las búsquedas por una columna a cambio de espacio y de escrituras más lentas (<a href={enlace('ficheros', 'indexados')}>lámina 02</a>). La PK siempre tiene uno.</li>
          <li><strong>Vista</strong>: una consulta guardada con nombre que se usa como si fuera una tabla. Sirve para enseñar a cada usuario solo lo que necesita (el nivel de vista de la <a href={enlace('sgbd', 'niveles')}>lámina 03</a>).</li>
          <li><strong>Restricciones</strong>: <code>PRIMARY KEY</code>, <code>FOREIGN KEY</code>, <code>NOT NULL</code>, <code>UNIQUE</code>, <code>DEFAULT</code> y <code>CHECK</code> (por ejemplo, edad ≥ 18). No son consejos: el gestor las hace cumplir siempre.</li>
        </ul>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="relacional" preguntas={[
          { p: 'Una fila también se llama…', opciones: ['Atributo', 'Tupla', 'Relación', 'Dominio'], ok: 1, porque: 'Fila = tupla = registro.' },
          { p: 'En la tabla PEDIDOS, ¿qué columna es la clave ajena?', opciones: ['id_pedido', 'fecha', 'id_cliente', 'importe'], ok: 2, porque: 'Guarda la clave primaria de CLIENTES: «a quién pertenezco».' },
          { p: '¿Cuál puede repetirse?', opciones: ['La clave primaria', 'La clave ajena', 'Las dos', 'Ninguna'], ok: 1, porque: 'Muchos pedidos pueden ser del mismo cliente; la PK nunca se repite.' },
          { p: 'Intentas insertar un libro con id_autor = A9 y A9 no existe. ¿Qué lo impide?', opciones: ['La clave primaria', 'NOT NULL', 'La integridad referencial', 'Un índice'], ok: 2, porque: 'La clave ajena tiene que apuntar a una fila existente.' },
          { p: 'NULL es…', opciones: ['Cero', 'Texto vacío', 'Ausencia de valor', 'Un error'], ok: 2, porque: 'Desconocido o no aplicable; no es 0 ni "".' },
        ]} />
      </div>
    </>
  );
}
