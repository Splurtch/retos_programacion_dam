import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, EnClase, Panel, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Un <strong>modelo de datos</strong> es la forma de organizar la información: en tablas, en objetos, en documentos, en pares clave-valor, en columnas o en grafos. No hay uno mejor que otro en abstracto: cada uno encaja con un tipo de problema. El oficio está en leer las pistas del caso y justificar la elección, también por qué descartas los demás.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Relacional: tablas y claves. Orientado a objetos: clases con atributos y métodos. NoSQL: clave-valor, documentos, columnas o grafos.'],
  ['Se confunde con', 'Dónde vive la base de datos o para qué sirve. «NoSQL» solo dice el modelo; no dice si está en la nube ni si es para análisis.'],
  ['Hábitat', 'El relacional, en casi todo lo que tiene pagos, reservas o inventario. Es el del curso y el del reto.'],
  ['Método de clase', 'Rasgo del caso → ventaja del modelo → por qué no los otros.'],
];

export const secciones = [
  { id: 'relacional', titulo: 'Relacional' },
  { id: 'objetos', titulo: 'Orientado a objetos' },
  { id: 'nosql', titulo: 'Las cuatro familias NoSQL' },
  { id: 'elegir', titulo: 'Cómo elegir: tres ejes' },
  { id: 'tendencias', titulo: 'Hacia dónde va' },
];

// ---------- Destacado: elegir modelo ----------
const MODELOS = ['Relacional', 'Objetos', 'Documentos', 'Clave-valor', 'Columnas', 'Grafos'] as const;
const CASOS: [string, (typeof MODELOS)[number], string][] = [
  ['Reservas de hotel con pagos y fechas', 'Relacional', 'Pagos y reservas no admiten errores: transacciones e integridad referencial. Un NoSQL de esquema flexible no te protege de una reserva sin cliente.'],
  ['Rutas de senderismo con puntos de interés y caminos', 'Grafos', 'Lo importante es la conexión: calcular una ruta es recorrer aristas, como hace un navegador.'],
  ['Nóminas: empleados, salarios y pagos', 'Relacional', 'Estructura fija y consistencia en cada pago.'],
  ['Fichas de jugadores con estadísticas distintas según el puesto', 'Documentos', 'Cada ficha lleva campos distintos: esquema flexible en JSON.'],
  ['Idioma y tema de la aplicación de cada usuario, consultados a cada momento', 'Clave-valor', 'Siempre se pregunta por la clave (el usuario) y se quiere la respuesta al instante.'],
  ['Colaboraciones entre investigadores y sus citas', 'Grafos', 'El valor está en las relaciones: quién cita a quién.'],
  ['Millones de lecturas por segundo de sensores para analizarlas después', 'Columnas', 'Muchísimos registros continuos y consultas analíticas sobre columnas concretas.'],
  ['Simulación científica cuyos datos tienen atributos y comportamiento', 'Objetos', 'Datos complejos con métodos: encaja con la programación orientada a objetos.'],
];

export function Destacado() {
  const [i, setI] = useState(0);
  const [r, setR] = useState<string>();
  const [c, ok, porque] = CASOS[i];
  return (
    <Panel titulo="¿Qué modelo elegirías?">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--t8)' }}>Caso {i + 1} de {CASOS.length}</p>
      <p className="grande" style={{ fontSize: 19, margin: '0 0 16px' }}>{c}</p>
      <div className="opciones" role="group" aria-label="Modelo">
        {MODELOS.map((m) => <button key={m} type="button" className="opcion" aria-pressed={r === m} onClick={() => setR(m)}>{m}</button>)}
      </div>
      {r && <p className="resultado" data-ok={r === ok} aria-live="polite"><strong>{r === ok ? 'Bien.' : `Mejor ${ok.toLowerCase()}.`}</strong> {porque}</p>}
      {r && <div style={{ marginTop: 12 }}><Button label="Siguiente caso" variant="primary" size="sm" onClick={() => { setI((i + 1) % CASOS.length); setR(undefined); }} /></div>}
    </Panel>
  );
}

const NOSQL: [string, string, string, string][] = [
  ['Clave-valor', 'Pares clave → valor, como un diccionario', 'Redis, DynamoDB', 'Cachés, sesiones, carrito, preferencias'],
  ['Documentos', 'Documentos JSON o BSON; cada uno puede tener campos distintos', 'MongoDB, CouchDB', 'Aplicaciones web, catálogos con productos muy variados'],
  ['Columnas', 'Datos organizados por columnas en vez de por filas', 'Cassandra, HBase', 'Análisis, históricos, sensores'],
  ['Grafos', 'Nodos y aristas', 'Neo4j, ArangoDB', 'Redes sociales, recomendaciones («quizá conozcas a…»)'],
];

export default function Cuerpo() {
  return (
    <>
      <Bloque id="relacional" titulo="Relacional">
        <p>Propuesto por Codd en 1970: los datos se organizan en <strong>tablas</strong> (relaciones) de filas y columnas, conectadas mediante <strong>claves primarias y ajenas</strong>. Tiene esquema fijo, se consulta con <strong>SQL</strong> y destaca en <strong>consistencia y transacciones</strong>: la transferencia bancaria es su ejemplo de libro. Otras ventajas: integridad referencial y escalabilidad vertical, ideal para aplicaciones transaccionales.</p>
        <p>Es el modelo principal del curso y el de los retos. Lo ves a fondo en la <a href={enlace('relacional')}>lámina 05</a>.</p>
      </Bloque>

      <Bloque id="objetos" titulo="Orientado a objetos">
        <p>Los datos se guardan como <strong>objetos</strong> con atributos y <strong>métodos</strong>, organizados en clases con herencia y polimorfismo. Los objetos <strong>persisten</strong> más allá de la ejecución del programa y se consultan con <strong>OQL</strong>. Encaja con lenguajes orientados a objetos (Java, Python) y con datos complejos: CAD, multimedia, simulaciones.</p>
        <p>Ejemplo de los apuntes: una clase <code>Empleado</code> con nombre, cargo y el método <code>calcular_sueldo()</code>, y una clase <code>Gerente</code> que hereda de ella y añade <code>equipo_a_cargo</code>. Pista de clase: los métodos suelen ser verbos.</p>
      </Bloque>

      <Bloque id="nosql" titulo="Las cuatro familias NoSQL">
        <p><T def="«Not only SQL»: familia de modelos no relacionales, con esquema flexible y pensados para escalar horizontalmente.">NoSQL</T> no es un modelo, es una familia. Lo común: esquema flexible, escalabilidad horizontal (añadir servidores) y velocidad en operaciones concretas, para grandes volúmenes de datos semiestructurados o no estructurados.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Cómo guarda</th><th>Ejemplos</th><th>Para qué</th></tr></thead>
            <tbody>{NOSQL.map(([t, c, e, u]) => <tr key={t}><td><strong>{t}</strong></td><td>{c}</td><td>{e}</td><td>{u}</td></tr>)}</tbody>
          </table>
        </div>
        <EnClase fecha="27/10">
          <p>Duda resuelta en clase: <strong>documentos frente a columnas</strong>. Documentos, cuando lo que varía son los campos (estadísticas distintas por jugador). Columnas, cuando llegan muchísimos registros continuos para analizarlos (sensores, históricos).</p>
        </EnClase>
      </Bloque>

      <Bloque id="elegir" titulo="Cómo elegir: tres ejes">
        <p>La píldora de terminología propone describir cualquier base de datos con <strong>tres etiquetas</strong>, una por eje, porque decir «NoSQL» solo responde a la primera pregunta:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Eje</th><th>Pregunta</th><th>Opciones</th></tr></thead>
            <tbody>
              <tr><td><strong>Modelo</strong></td><td>¿Cómo se organizan los datos?</td><td>Relacional, NoSQL, orientado a objetos</td></tr>
              <tr><td><strong>Ubicación</strong></td><td>¿Dónde vive y cómo se reparte?</td><td>Centralizada, distribuida, en la nube</td></tr>
              <tr><td><strong>Propósito</strong></td><td>¿Para qué está optimizada?</td><td>Transaccional (OLTP), analítica (OLAP), híbrida (HTAP)</td></tr>
            </tbody>
          </table>
        </div>
        <p>Ejemplo: «relacional + en la nube + transaccional». La píldora de centralizadas y distribuidas añade el dilema de fondo: una base <strong>centralizada</strong> es simple y muy consistente, pero si cae, no hay servicio; una <strong>distribuida</strong> aguanta caídas a cambio de negociar la consistencia. Orden de decisión: primero el modelo, luego la arquitectura y después el propósito.</p>
        <p>Y para crecer, dos caminos: <strong>escalar en vertical</strong> (un servidor más potente: más memoria, más CPU) o <strong>en horizontal</strong> (más servidores; en clase, «comprar más cafeteras»).</p>
      </Bloque>

      <Bloque id="tendencias" titulo="Hacia dónde va">
        <ul>
          <li><strong>Multimodelo</strong>: un solo sistema que maneja varios modelos. «Pedidos en tablas y conexiones entre clientes en un grafo, en el mismo programa» (ArangoDB, MongoDB).</li>
          <li><strong>Nube y DBaaS</strong>: el proveedor se ocupa de configurar, actualizar y hacer copias (Amazon RDS, Aurora Serverless, Google Cloud SQL, BigQuery, Azure SQL Database). Escala en picos como el Black Friday y se paga por uso; a cambio, coste imprevisible, dependencia de internet y cumplimiento legal (RGPD).</li>
          <li><strong>IA</strong>: optimización automática, análisis predictivo, <strong>detección de anomalías</strong> («este pago no se parece a lo que hace este cliente») y automatización de tareas.</li>
          <li><strong>Automatización</strong>: esquemas generados, ajuste de índices, copias y parches sin intervención humana.</li>
        </ul>
        <EnClase fecha="10/11">
          <p>Debate sobre la nube: el proveedor protege la infraestructura, pero proteger los datos sigue siendo cosa tuya. Para datos muy sensibles, como historiales clínicos, puede ser razonable quedarse <em>on premise</em>, con servidores propios.</p>
        </EnClase>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="modelos" preguntas={[
          { p: 'Un catálogo de productos con características muy distintas (tallas, colores, pulgadas), sin esquema fijo. ¿Modelo?', opciones: ['Relacional', 'Documentos', 'Clave-valor', 'Grafos'], ok: 1, porque: 'Cada documento puede llevar sus propios campos.' },
          { p: '¿Qué lenguaje de consulta se asocia al modelo orientado a objetos?', opciones: ['SQL', 'OQL', 'JSON', 'DDL'], ok: 1, porque: 'Object Query Language.' },
          { p: 'Añadir más servidores para aguantar más carga es escalar…', opciones: ['En vertical', 'En horizontal', 'En diagonal', 'Hacia la nube'], ok: 1, porque: 'Horizontal: más máquinas. Vertical: una máquina más potente.' },
          { p: '«El banco recibe un aviso: este pago no se parece a lo que hace este cliente.» ¿Qué tendencia?', opciones: ['Multimodelo', 'DBaaS', 'IA: detección de anomalías', 'Big Data'], ok: 2, porque: 'Es el ejemplo de clase de detección de anomalías.' },
        ]} />
      </div>
    </>
  );
}
