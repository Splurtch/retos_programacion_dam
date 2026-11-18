import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';

export const entradilla = (
  <p>Una <strong>base de datos</strong> es un conjunto organizado de datos, guardado de forma estructurada para poder consultarlo, actualizarlo y relacionarlo sin perder nada. Un Excel con la lista de empleados ya es una base de datos rudimentaria. La diferencia con la de verdad está en cómo se organiza, quién la gestiona y qué garantías da. Empieza por lo más pequeño: el dato.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Datos + estructura + relaciones. Persistente, organizada y accesible.'],
  ['Se confunde con', 'El SGBD. La base de datos son los datos organizados; el SGBD es el programa que los gestiona (MySQL, PostgreSQL…).'],
  ['Hábitat', 'En todas partes: tiendas, hospitales, bancos, redes sociales. En el Reto 1, el catálogo de una tienda de informática.'],
  ['Tres familias', 'Estructurados (tablas), semiestructurados (JSON, XML) y no estructurados (fotos, vídeo, texto libre).'],
];

export const secciones = [
  { id: 'que-es', titulo: 'Qué es una base de datos' },
  { id: 'dato', titulo: 'Dato frente a información' },
  { id: 'formatos', titulo: 'La misma información, tres formatos' },
  { id: 'tipos', titulo: 'Estructurados, semiestructurados, no estructurados' },
  { id: 'historia', titulo: 'De los años 60 a la IA' },
];

// ---------- Destacado: clasificar ----------
type Tipo = 'est' | 'semi' | 'no';
const CASOS: [string, Tipo, string][] = [
  ['Inventario de productos en una hoja de cálculo', 'est', 'Filas y columnas fijas: estructurado. Las herramientas típicas son MySQL o PostgreSQL.'],
  ['Ficha de un jugador en JSON, con estadísticas distintas según el puesto', 'semi', 'Tiene etiquetas, pero cada ficha puede llevar campos distintos: semiestructurado.'],
  ['Foto de perfil', 'no', 'No hay campos ni esquema: no estructurado.'],
  ['Correo electrónico', 'semi', 'Remitente y asunto son campos fijos; el cuerpo es texto libre. En clase se clasificó como semiestructurado.'],
  ['Movimientos de una cuenta bancaria', 'est', 'Fecha, concepto, importe… siempre las mismas columnas: estructurado.'],
  ['Archivo XML de configuración', 'semi', 'Etiquetas que dan forma, sin tabla rígida: semiestructurado.'],
  ['Vídeo de una clase grabada', 'no', 'Sin esquema. Para analizarlo hacen falta herramientas avanzadas.'],
  ['Mensajes publicados en una red social', 'no', 'Texto libre: no estructurado. Se procesa con herramientas como Hadoop o Elasticsearch.'],
];
const NOMBRE: Record<Tipo, string> = { est: 'Estructurado', semi: 'Semiestructurado', no: 'No estructurado' };

export function Destacado() {
  const [i, setI] = useState(0);
  const [r, setR] = useState<Tipo>();
  const [ok, setOk] = useState(0);
  const [c, tipo, porque] = CASOS[i];
  const sig = () => { if (r === tipo) setOk(ok + 1); setI((i + 1) % CASOS.length); setR(undefined); };
  return (
    <Panel titulo="¿Qué tipo de dato es?">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--t8)' }}>Caso {i + 1} de {CASOS.length} · {ok} acertados</p>
      <p className="grande" style={{ fontSize: 20, margin: '0 0 16px' }}>{c}</p>
      <div className="opciones" role="group" aria-label="Tipo de dato">
        {(Object.keys(NOMBRE) as Tipo[]).map((t) => <button key={t} type="button" className="opcion" aria-pressed={r === t} onClick={() => setR(t)}>{NOMBRE[t]}</button>)}
      </div>
      {r && <p className="resultado" data-ok={r === tipo} aria-live="polite"><strong>{r === tipo ? 'Bien.' : `No: ${NOMBRE[tipo].toLowerCase()}.`}</strong> {porque}</p>}
      {r && <div style={{ marginTop: 12 }}><Button label={i + 1 < CASOS.length ? 'Siguiente' : 'Otra vuelta'} variant="primary" size="sm" onClick={sig} /></div>}
    </Panel>
  );
}

// ---------- Dato frente a información ----------
function DatoInfo() {
  const [ctx, setCtx] = useState(false);
  return (
    <Panel titulo="Añade contexto">
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        {['34', 'Madrid', 'ana@correo.es', '12/10/2026'].map((d) => <span key={d} className="chip" style={{ cursor: 'default', fontSize: 16 }}>{d}</span>)}
      </div>
      <p className="resultado" aria-live="polite">{ctx ? <><strong>Información:</strong> Ana tiene 34 años, vive en Madrid, su correo es ana@correo.es y se dio de alta el 12/10/2026.</> : <><strong>Datos sueltos:</strong> ¿34 qué? ¿Euros, años, unidades? Sin contexto, un dato no dice nada.</>}</p>
      <div style={{ marginTop: 12 }}><Button label={ctx ? 'Quitar el contexto' : 'Darles contexto'} variant="primary" size="sm" onClick={() => setCtx(!ctx)} /></div>
    </Panel>
  );
}

// ---------- Tres formatos ----------
const FORMATOS = {
  tabla: '',
  json: `[
  { "codigo": "P1", "nombre": "Ratón",   "precio": 15,  "existencias": 4 },
  { "codigo": "P2", "nombre": "Teclado", "precio": 30,  "existencias": 2,
    "inalambrico": true },
  { "codigo": "P3", "nombre": "Monitor", "precio": 120, "existencias": 1,
    "pulgadas": 27 }
]`,
  texto: 'Tenemos un ratón a 15 euros, quedan cuatro. El teclado, que es inalámbrico, cuesta 30 y hay dos. Del monitor de 27 pulgadas solo queda uno, a 120 euros.',
};

function TresFormatos() {
  const [f, setF] = useState<keyof typeof FORMATOS>('tabla');
  return (
    <Panel titulo="El catálogo de la tienda, de tres maneras">
      <SegmentedControl label="Formato" value={f} onChange={(v) => setF(v as keyof typeof FORMATOS)}>
        <SegmentedControlItem value="tabla" label="Tabla" />
        <SegmentedControlItem value="json" label="JSON" />
        <SegmentedControlItem value="texto" label="Texto libre" />
      </SegmentedControl>
      <div style={{ marginTop: 16 }}>
        {f === 'tabla' ? (
          <div className="tabla-scroll">
            <table className="tabla">
              <thead><tr><th>codigo</th><th>nombre</th><th>precio</th><th>existencias</th></tr></thead>
              <tbody><tr><td>P1</td><td>Ratón</td><td>15</td><td>4</td></tr><tr><td>P2</td><td>Teclado</td><td>30</td><td>2</td></tr><tr><td>P3</td><td>Monitor</td><td>120</td><td>1</td></tr></tbody>
            </table>
          </div>
        ) : (
          <pre style={{ margin: 0, padding: '14px 16px', borderRadius: 12, background: 'var(--t1)', border: '1px solid var(--t4)', whiteSpace: 'pre-wrap', font: f === 'json' ? '500 14px/1.6 var(--f-codigo)' : '500 17px/1.6 var(--f-texto)', color: 'var(--t10)' }}>{FORMATOS[f]}</pre>
        )}
      </div>
      <p style={{ margin: '14px 0 0', color: 'var(--t8)', fontSize: 15 }}>
        {f === 'tabla' ? 'Estructurado: todas las filas tienen las mismas columnas. Fácil de consultar con SQL, pero ¿dónde pongo las pulgadas del monitor?' : f === 'json' ? 'Semiestructurado: cada objeto puede llevar campos propios (inalambrico, pulgadas). Flexible, pero nada obliga a que todos tengan precio.' : 'No estructurado: lo entiende una persona, pero para que un programa saque «cuántos monitores quedan» hace falta procesar el lenguaje.'}
      </p>
    </Panel>
  );
}

const HISTORIA: [string, string][] = [
  ['Años 60', 'Modelos jerárquico (árbol; IMS de IBM) y en red (CODASYL).'],
  ['Años 70', 'Edgar F. Codd propone el modelo relacional (1970): datos en tablas. Nace SQL. Oracle (1977), System R.'],
  ['Años 80', 'Se comercializan los SGBD relacionales (Oracle, Sybase, DB2), llegan las herramientas gráficas y la normalización.'],
  ['Años 90', 'Bases de datos distribuidas y OLAP para análisis. Aparecen SQL Server y MySQL.'],
  ['Años 2000', 'NoSQL (MongoDB, Cassandra) y Big Data con Hadoop.'],
  ['Años 2010', 'Bases de datos en la nube como servicio (DBaaS) y multimodelo.'],
  ['Años 2020', 'IA y automatización: optimización de consultas, diseño asistido, herramientas sin código.'],
];

export default function Cuerpo() {
  return (
    <>
      <Bloque id="que-es" titulo="Qué es una base de datos">
        <p>Una <T def="Conjunto organizado de datos almacenados de forma estructurada y sistemática.">base de datos</T> es un conjunto organizado de datos, almacenados de forma estructurada y sistemática, que permite <strong>acceder</strong> a ellos (y controlar quién accede), <strong>gestionarlos</strong> y <strong>relacionarlos</strong>. Tiene tres elementos:</p>
        <ul>
          <li><strong>Datos</strong>: los valores concretos. «Ana», «34», «12/10/2026».</li>
          <li><strong>Estructura</strong>: el esquema que dice cómo se organizan. Nombre, edad, fecha de alta.</li>
          <li><strong>Relaciones</strong>: cómo se conectan entre sí. Un cliente con sus pedidos.</li>
        </ul>
        <p>Y tres características: <strong>persistencia</strong> (los datos sobreviven a apagar el equipo), <strong>organización</strong> (ordenados para consultar sin redundancias) y <strong>accesibilidad</strong> (se consultan rápido, por ejemplo con SQL).</p>
        <p>Importan porque permiten gestionar mucha información con eficiencia, decidir con datos, automatizar procesos, proteger información sensible y crecer sin perder rendimiento. Aparecen en empresas (clientes, inventario, contabilidad), salud (historias clínicas), educación (expedientes), comercio electrónico, redes sociales y administración pública.</p>
        <EnClase fecha="13/10">
          <p>Primera clase de contenido. La consigna: centrarse en el <strong>primer PDF</strong> de la Unidad 1; el resto es ampliación. Las preguntas del final del temario son autoevaluación, no se entregan. El ejemplo de acceso: el historial clínico, que no puede ver cualquiera.</p>
        </EnClase>
      </Bloque>

      <Bloque id="dato" titulo="Dato frente a información">
        <p>Un <strong>dato</strong> es un valor aislado, sin contexto. La <strong>información</strong> son datos con sentido, interpretados juntos. Las empresas guardan datos para obtener información, y cuando el volumen es enorme se habla de <T def="Gestión de volúmenes masivos de datos para convertirlos en información útil.">Big Data</T>.</p>
        <DatoInfo />
      </Bloque>

      <Bloque id="formatos" titulo="La misma información, tres formatos">
        <p>En clase se hizo este ejercicio con clientes: la misma información en una hoja de cálculo guardada como CSV, en un archivo JSON y en un párrafo de texto. Aquí lo tienes con los productos del Reto 1:</p>
        <TresFormatos />
      </Bloque>

      <Bloque id="tipos" titulo="Estructurados, semiestructurados, no estructurados">
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Tipo</th><th>Estructura</th><th>Ejemplos</th><th>Herramientas</th></tr></thead>
            <tbody>
              <tr><td><strong>Estructurados</strong></td><td>Rígida: tablas con filas y columnas y un esquema definido</td><td>Clientes, notas, inventarios, movimientos bancarios</td><td>MySQL, PostgreSQL</td></tr>
              <tr><td><strong>Semiestructurados</strong></td><td>Definida pero flexible: texto con etiquetas</td><td>JSON, XML, correo electrónico</td><td>MongoDB, Firebase</td></tr>
              <tr><td><strong>No estructurados</strong></td><td>Ninguna</td><td>Imágenes, vídeo, audio, texto libre, redes sociales</td><td>Hadoop, Elasticsearch</td></tr>
            </tbody>
          </table>
        </div>
        <ParaElReto>
          <p>La tienda del reto tiene sus datos en una hoja de cálculo: ya son estructurados. El problema no es el tipo de dato, sino que <strong>categorías y productos están mezclados</strong> en la misma hoja. El reto consiste en separarlos en un modelo.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="historia" titulo="De los años 60 a la IA">
        <ol style={{ listStyle: 'none', padding: 0 }}>
          {HISTORIA.map(([d, t]) => (
            <li key={d} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--t4)' }}>
              <strong style={{ color: 'var(--familia)' }}>{d}</strong><span>{t}</span>
            </li>
          ))}
        </ol>
        <Ojo dice="La píldora «Sistemas Gestores de Bases de Datos» sitúa el modelo jerárquico en los años 70 y el relacional en los 80." realidad="El jerárquico es de los 60 (IMS de IBM) y Codd publicó el modelo relacional en 1970, como dicen el PDF del tema, el glosario y la clase del 13/10. En los 80 el relacional se comercializa y se populariza, no nace. Para el test, quédate con 60 jerárquico y en red, 70 relacional." />
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="datos" preguntas={[
          { p: '«Los datos siguen ahí después de reiniciar el servidor.» ¿Qué característica es?', opciones: ['Organización', 'Persistencia', 'Accesibilidad', 'Redundancia'], ok: 1, porque: 'Persistencia: los datos perduran en disco o en la nube.' },
          { p: '«34» sin más es…', opciones: ['Información', 'Un dato', 'Una base de datos', 'Un SGBD'], ok: 1, porque: 'Un valor aislado, sin contexto.' },
          { p: 'Un correo electrónico es un dato…', opciones: ['Estructurado', 'Semiestructurado', 'No estructurado', 'Relacional'], ok: 1, porque: 'Campos fijos (remitente, asunto) más un cuerpo libre.' },
          { p: '¿Quién propuso el modelo relacional y cuándo?', opciones: ['IBM, 1960', 'Codd, 1970', 'Oracle, 1977', 'Codd, 1985'], ok: 1, porque: 'Edgar F. Codd, 1970.' },
          { p: '¿Cuáles son los tres elementos de una base de datos?', opciones: ['Tablas, filas y columnas', 'Datos, estructura y relaciones', 'SQL, NoSQL y JSON', 'Usuarios, roles y permisos'], ok: 1, porque: 'Datos, la estructura que los organiza y las relaciones que los conectan.' },
        ]} />
      </div>
    </>
  );
}
