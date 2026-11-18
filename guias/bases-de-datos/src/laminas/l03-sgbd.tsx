import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Switch } from '@astryxdesign/core/Switch';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { Codigo } from '../ui/Codigo.tsx';

export const entradilla = (
  <p>Un <strong>SGBD</strong> (sistema gestor de bases de datos) es el programa que se pone entre tú y los datos. Tú pides información («los usuarios registrados desde enero») y él se ocupa del cómo: qué bloques del disco leer, qué índice usar, si tienes permiso y qué pasa si otro usuario está escribiendo a la vez. No es un disco grande: es un sistema de garantías.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Software para crear, gestionar y consultar bases de datos. Intermediario entre usuarios y datos.'],
  ['Se confunde con', 'La base de datos (los datos) y con el cliente gráfico. MySQL Server es el SGBD; MySQL Workbench solo es una ventana para hablar con él.'],
  ['Hábitat', 'MySQL, PostgreSQL, Oracle, SQL Server; en NoSQL, MongoDB, Cassandra, DynamoDB.'],
  ['Analogía de clase', 'La base de datos es la biblioteca; el SGBD, el bibliotecario.'],
];

export const secciones = [
  { id: 'garantias', titulo: 'Cinco garantías' },
  { id: 'niveles', titulo: 'Tres niveles' },
  { id: 'funciones', titulo: 'Funciones y lenguajes' },
  { id: 'seguridad', titulo: 'Seguridad y catálogo' },
  { id: 'limites', titulo: 'Reglas de nombres' },
];

// ---------- Destacado: niveles ----------
type Nivel = 'fisico' | 'logico' | 'vista';
const NV: Record<Nivel, string> = { fisico: 'Físico', logico: 'Lógico', vista: 'Vista' };
const CASOS: [string, Nivel, string][] = [
  ['Crear un índice para que las búsquedas por DNI vayan más rápido', 'fisico', 'Cómo se almacena y se accede en el disco: nivel físico.'],
  ['Definir que pedidos.id_cliente es clave ajena de clientes', 'logico', 'Qué datos hay y cómo se relacionan: nivel lógico.'],
  ['Que el departamento de envíos solo vea los pedidos pendientes', 'vista', 'Un subconjunto a medida de un grupo de usuarios: nivel de vista.'],
  ['Mover los datos a un disco SSD más rápido', 'fisico', 'Las aplicaciones ni se enteran: independencia física.'],
  ['Añadir la columna correo a la tabla clientes', 'logico', 'Cambia la estructura: nivel lógico.'],
  ['Ocultar el sueldo a quien consulta la plantilla', 'vista', 'Proteger datos sensibles enseñando solo lo necesario: vista.'],
  ['Exigir que el nombre de un producto no pueda quedar vacío', 'logico', 'Las restricciones son parte del esquema lógico.'],
];

export function Destacado() {
  const [i, setI] = useState(0);
  const [r, setR] = useState<Nivel>();
  const [c, n, porque] = CASOS[i];
  return (
    <Panel titulo="¿En qué nivel ocurre?">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--t8)' }}>Caso {i + 1} de {CASOS.length}</p>
      <p className="grande" style={{ fontSize: 19, margin: '0 0 16px' }}>{c}</p>
      <div className="opciones" role="group" aria-label="Nivel">
        {(Object.keys(NV) as Nivel[]).map((k) => <button key={k} type="button" className="opcion" aria-pressed={r === k} onClick={() => setR(k)}>{NV[k]}</button>)}
      </div>
      {r && <p className="resultado" data-ok={r === n} aria-live="polite"><strong>{r === n ? 'Bien.' : `No: ${NV[n].toLowerCase()}.`}</strong> {porque}</p>}
      {r && <div style={{ marginTop: 12 }}><Button label="Siguiente" variant="primary" size="sm" onClick={() => { setI((i + 1) % CASOS.length); setR(undefined); }} /></div>}
      <svg viewBox="0 0 300 150" style={{ width: '100%', maxWidth: 300, display: 'block', margin: '18px auto 0' }} role="img" aria-label="Tres niveles: vista arriba, lógico en medio, físico abajo">
        {(['vista', 'logico', 'fisico'] as Nivel[]).map((k, j) => (
          <g key={k}>
            <rect x={40 + j * 20} y={8 + j * 48} width={220 - j * 40} height={38} rx="8" fill={r && k === n ? 'color-mix(in srgb, var(--familia-solido) 30%, var(--t2))' : 'var(--t1)'} stroke="var(--t5)" />
            <text x="150" y={32 + j * 48} textAnchor="middle" style={{ font: '700 14px var(--f-titulo)' }} fill="var(--t10)">{NV[k]}</text>
          </g>
        ))}
      </svg>
    </Panel>
  );
}

// ---------- Transacción ----------
function Transferencia() {
  const [tx, setTx] = useState(true);
  const [fallo, setFallo] = useState(true);
  const [hecho, setHecho] = useState(false);
  const a = !hecho ? 500 : fallo && tx ? 500 : 400;
  const b = !hecho ? 200 : fallo ? 200 : 300;
  const perdido = 700 - a - b;
  return (
    <Panel titulo="Transferir 100 € de la cuenta A a la B">
      <div className="fila-controles">
        <Switch label="Dentro de una transacción" value={tx} onChange={(v: boolean) => { setTx(v); setHecho(false); }} />
        <Switch label="Se va la luz a mitad" value={fallo} onChange={(v: boolean) => { setFallo(v); setHecho(false); }} />
      </div>
      <p style={{ margin: '0 0 12px' }}>Cuenta A: <strong>{a} €</strong> · Cuenta B: <strong>{b} €</strong> · Total: <strong>{a + b} €</strong></p>
      <Button label={hecho ? 'Repetir' : 'Ejecutar: restar en A, sumar en B'} variant="primary" size="sm" onClick={() => setHecho(!hecho)} />
      {hecho && (
        <p className="resultado" data-ok={perdido === 0} aria-live="polite" style={{ marginTop: 12 }}>
          {perdido > 0 ? <><strong>Han desaparecido {perdido} €.</strong> Se restó en A, la luz se fue antes de sumar en B y nadie deshizo nada.</>
            : fallo ? <><strong>ROLLBACK.</strong> La operación falló a mitad y el SGBD deshizo la resta: todo o nada.</>
            : <><strong>COMMIT.</strong> Las dos partes se completaron y se confirman juntas.</>}
        </p>
      )}
    </Panel>
  );
}

// ---------- Rol de solo lectura ----------
function Rol() {
  const [r, setR] = useState<string>();
  const OPS: [string, boolean][] = [['SELECT * FROM productos;', true], ['INSERT INTO productos VALUES (…);', false], ['UPDATE productos SET precio = 1;', false], ['DELETE FROM productos;', false]];
  return (
    <Panel titulo="El usuario «dependiente» tiene el rol de solo lectura">
      <div className="opciones" role="group" aria-label="Sentencias">
        {OPS.map(([s]) => <button key={s} type="button" className="chip" aria-pressed={r === s} onClick={() => setR(s)}>{s}</button>)}
      </div>
      {r && (OPS.find(([s]) => s === r)![1]
        ? <p className="resultado" data-ok="true"><strong>Permitido.</strong> El rol incluye el privilegio SELECT.</p>
        : <p className="resultado" data-ok="false"><strong>Denegado.</strong> El rol no tiene ese privilegio. El SGBD lo comprueba en su catálogo antes de ejecutar nada.</p>)}
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="garantias" titulo="Cinco garantías">
        <p>Lo que un SGBD hace por ti y un fichero no:</p>
        <ol>
          <li><strong>Independencia de datos</strong>: puedes cambiar cómo se almacena sin romper los programas que lo usan.</li>
          <li><strong>Gestión de transacciones</strong>: operaciones de «todo o nada», con recuperación ante fallos.</li>
          <li><strong>Acceso concurrente</strong>: muchos usuarios a la vez sin pisarse (dos personas reservando el mismo asiento).</li>
          <li><strong>Seguridad</strong>: quién puede ver y qué puede hacer cada usuario.</li>
          <li><strong>Optimización</strong>: consultas rápidas gracias a índices y planes de ejecución.</li>
        </ol>
        <p>La segunda se entiende mejor con dinero de por medio. Una <T def="Conjunto de operaciones que se ejecutan todas o ninguna.">transacción</T> empieza con <code>START TRANSACTION</code> y termina con <code>COMMIT</code> (confirmar) o <code>ROLLBACK</code> (deshacer):</p>
        <Transferencia />
      </Bloque>

      <Bloque id="niveles" titulo="Tres niveles">
        <p>Un SGBD separa tres miradas sobre los mismos datos, y así cada una puede cambiar sin tocar las demás:</p>
        <ul>
          <li><strong>Físico</strong>: cómo se guardan en el hardware: bloques, registros, índices (un árbol B+, por ejemplo). Invisible para usuarios y programadores.</li>
          <li><strong>Lógico</strong>: qué datos hay y cómo se relacionan: tablas, claves, restricciones. Es el esquema.</li>
          <li><strong>Vista</strong>: lo que ve cada usuario o departamento. Por ejemplo, una vista <code>Pedidos_Pendientes</code> que oculta todo lo demás.</li>
        </ul>
        <EnClase fecha="03/11">
          <p>Se preguntó en clase con tres casos: definir una clave foránea (lógico), mostrar solo pedidos pendientes a un departamento (vista) y crear índices para acelerar búsquedas (físico). Son los tres primeros de la lámina de arriba.</p>
        </EnClase>
      </Bloque>

      <Bloque id="funciones" titulo="Funciones y lenguajes">
        <p>Cuatro funciones: <strong>crear y diseñar</strong> la base de datos, <strong>consultar y manipular</strong> los datos, <strong>proteger</strong> el acceso y <strong>respaldar y recuperar</strong> ante fallos. Cada una tiene su familia de sentencias SQL:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Lenguaje</th><th>Para qué</th><th>Sentencias</th></tr></thead>
            <tbody>
              <tr><td><strong>DDL</strong>, definición</td><td>Cambiar la forma: tablas, columnas, restricciones</td><td>CREATE, ALTER, DROP</td></tr>
              <tr><td><strong>DML</strong>, manipulación</td><td>Leer y cambiar el contenido (CRUD)</td><td>SELECT, INSERT, UPDATE, DELETE</td></tr>
              <tr><td><strong>DCL</strong>, control</td><td>Permisos</td><td>GRANT, REVOKE</td></tr>
              <tr><td>Transacciones</td><td>Agrupar cambios</td><td>START TRANSACTION, COMMIT, ROLLBACK</td></tr>
            </tbody>
          </table>
        </div>
        <Codigo titulo="Lo que se practicó el 03/11 en MySQL Workbench" codigo={`CREATE DATABASE biblioteca;
USE biblioteca;
CREATE TABLE autores (
    id_autor VARCHAR(5) PRIMARY KEY,
    nombre   VARCHAR(100) NOT NULL
);
CREATE TABLE libros (
    id_libro VARCHAR(5) PRIMARY KEY,
    titulo   VARCHAR(150) NOT NULL,
    id_autor VARCHAR(5),
    genero   VARCHAR(30),
    FOREIGN KEY (id_autor) REFERENCES autores(id_autor)
);
INSERT INTO autores VALUES ('A1', 'J. R. R. Tolkien');
SELECT titulo FROM libros WHERE genero = 'Fantasía';`} />
        <p>Las restricciones básicas que salieron en clase: <code>NOT NULL</code> (no puede quedar vacío), <code>UNIQUE</code> (no se repite, como un correo) y <code>DEFAULT</code> (valor por defecto). Y para copias de seguridad, <code>mysqldump -u usuario -p NombreBD &gt; respaldo.sql</code>.</p>
        <EnClase fecha="03/11">
          <p>Práctica guiada: conexión en Workbench (usuario <code>root</code>, <code>localhost</code>, puerto 3306), y los errores típicos: «No database selected» (falta <code>USE</code>), «already exists», comas olvidadas y la tabla referenciada, que debe existir antes que la que tiene la clave ajena.</p>
        </EnClase>
        <ParaElReto>
          <p>Nada de esto entra en el Reto 1: «no se pide nada de SQL». Pero el reto pide <strong>una ventaja concreta del SGBD</strong>, y estas garantías son tu cantera: integridad, concurrencia, seguridad…</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="seguridad" titulo="Seguridad y catálogo">
        <p>La seguridad tiene capas que no conviene mezclar: <strong>autenticación</strong> (¿quién eres? usuario y contraseña), <strong>autorización</strong> (¿qué puedes hacer? roles y privilegios), <strong>auditoría</strong> (registro de quién hizo qué) y <strong>cifrado</strong> de los datos sensibles.</p>
        <Rol />
        <Codigo codigo={`GRANT SELECT ON Usuarios TO 'UsuarioLectura';`} titulo="Dar permiso de solo lectura" />
        <p>Para aplicar todo esto, el SGBD consulta su <T def="Inventario de metadatos que mantiene el SGBD: estructura, usuarios, permisos, estadísticas. No contiene datos de negocio.">catálogo o diccionario de datos</T>: qué tablas existen, qué usuarios y permisos hay y qué estadísticas e índices puede usar. No guarda los datos de negocio, sino la descripción del sistema.</p>
      </Bloque>

      <Bloque id="limites" titulo="Reglas de nombres">
        <p>Al nombrar tablas y columnas: no se repiten dos tablas con el mismo nombre en la misma base de datos, conviene evitar símbolos raros (el guion bajo sí está bien), los nombres con espacios van entre comillas dobles y algunos gestores distinguen mayúsculas de minúsculas. Convención: palabras reservadas en mayúsculas y cada sentencia terminada en punto y coma.</p>
        <Ojo dice="«Máximo 30 caracteres» para los nombres (píldora «Límites en el uso del SGBD»)." realidad="Ese límite es de Oracle en versiones antiguas. En MySQL, el gestor de clase, tablas y columnas admiten hasta 64 caracteres, y PostgreSQL, 63. Nombres cortos y claros siguen siendo buena idea." />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="sgbd" preguntas={[
          { p: 'Te equivocas al borrar datos dentro de una transacción. ¿Qué ejecutas?', opciones: ['COMMIT', 'ROLLBACK', 'DROP', 'GRANT'], ok: 1, porque: 'ROLLBACK deshace todo lo hecho desde el inicio de la transacción.' },
          { p: 'CREATE, ALTER y DROP pertenecen al…', opciones: ['DML', 'DDL', 'DCL', 'Catálogo'], ok: 1, porque: 'Lenguaje de definición: cambian la estructura.' },
          { p: 'Dos personas reservan el mismo asiento a la vez y solo una lo consigue. ¿Qué garantía actúa?', opciones: ['Independencia', 'Acceso concurrente', 'Optimización', 'Persistencia'], ok: 1, porque: 'El control de concurrencia evita que se pisen.' },
          { p: 'Mostrar a contabilidad solo las facturas, sin el resto de datos, es trabajo del nivel…', opciones: ['Físico', 'Lógico', 'De vista', 'De red'], ok: 2, porque: 'Una vista a medida de un grupo de usuarios.' },
          { p: '¿Qué es MySQL Workbench?', opciones: ['El SGBD', 'Un cliente gráfico para hablar con el SGBD', 'Un lenguaje de consulta', 'Una base de datos NoSQL'], ok: 1, porque: 'El SGBD es MySQL Server; Workbench se conecta a él.' },
        ]} />
      </div>
    </>
  );
}
