import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Slider } from '@astryxdesign/core/Slider';
import { Autoevaluacion, Bloque, Panel, ParaElReto, T } from '../ui/guia.tsx';

export const entradilla = (
  <p>Un fichero guarda datos, y para muchas cosas basta. El problema aparece cuando el sistema crece: miles de productos, cientos de pedidos al día y varias personas comprando a la vez. Entonces la pregunta ya no es dónde guardar, sino cómo encontrar rápido, cómo evitar contradicciones y cómo coordinar accesos simultáneos. Ahí es donde el fichero se queda corto y aparece el SGBD.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Un archivo con nombre, extensión y metadatos que el sistema operativo lee y escribe. Integridad, concurrencia y recuperación corren a cargo de tu programa.'],
  ['Se confunde con', 'Una base de datos. Un CSV persiste datos, pero no impide duplicados ni coordina dos escrituras a la vez.'],
  ['Hábitat', 'Logs, configuraciones, exportaciones, intercambio de datos. La hoja de cálculo del Reto 1 es, en el fondo, un fichero.'],
  ['Tres organizaciones', 'Plano (secuencial), indexado y de acceso directo (hashing).'],
];

export const secciones = [
  { id: 'criterios', titulo: 'Cuatro criterios para juzgar' },
  { id: 'planos', titulo: 'Ficheros planos' },
  { id: 'indexados', titulo: 'Ficheros indexados' },
  { id: 'directo', titulo: 'Acceso directo y hashing' },
  { id: 'cuando', titulo: 'Cuándo hace falta un SGBD' },
];

// ---------- Destacado: dos compras a la vez ----------
const PASOS = {
  fichero: [
    ['Ana abre el CSV y lee las existencias del monitor', 1, 'Ana ve 1 unidad.'],
    ['Luis abre el CSV a la vez y lee las existencias', 1, 'Luis también ve 1 unidad: nadie le avisa de que Ana está comprando.'],
    ['Ana compra y escribe 0', 0, 'El fichero dice 0.'],
    ['Luis compra y escribe 0', 0, 'El fichero sigue diciendo 0… pero se han vendido dos monitores y solo había uno.'],
  ],
  sgbd: [
    ['Ana empieza una transacción y lee las existencias', 1, 'El SGBD bloquea esa fila mientras Ana compra.'],
    ['Luis intenta leer las existencias', 1, 'Luis espera: la fila está en uso. Acceso concurrente controlado.'],
    ['Ana compra: 0 unidades y COMMIT', 0, 'Cambio confirmado. La fila queda libre.'],
    ['Luis lee por fin: 0 unidades, su compra se rechaza', 0, 'Nunca se vende lo que no hay. Una regla (existencias ≥ 0) lo garantiza siempre.'],
  ],
} as const;

export function Destacado() {
  const [modo, setModo] = useState<keyof typeof PASOS>('fichero');
  const [n, setN] = useState(0);
  const pasos = PASOS[modo];
  const vendidas = modo === 'fichero' ? (n >= 4 ? 2 : n >= 3 ? 1 : 0) : n >= 3 ? 1 : 0;
  return (
    <Panel titulo="Queda un monitor y lo compran dos personas a la vez">
      <SegmentedControl label="Dónde se guardan las existencias" value={modo} onChange={(v) => { setModo(v as keyof typeof PASOS); setN(0); }}>
        <SegmentedControlItem value="fichero" label="Un fichero CSV" />
        <SegmentedControlItem value="sgbd" label="Un SGBD" />
      </SegmentedControl>
      <ol style={{ margin: '16px 0', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
        {pasos.map(([t, , nota], i) => (
          <li key={t} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid var(--t4)', background: i < n ? 'var(--t1)' : 'transparent', opacity: i < n ? 1 : 0.4 }}>
            <strong>{i + 1}. {t}</strong>{i < n && <><br /><span style={{ fontSize: 14, color: 'var(--t8)' }}>{nota}</span></>}
          </li>
        ))}
      </ol>
      <p className="resultado" data-ok={n === 4 ? modo === 'sgbd' : undefined} aria-live="polite">
        Existencias: <strong>{n === 0 ? 1 : pasos[n - 1][1]}</strong> · vendidas: <strong>{vendidas}</strong>
        {n === 4 && (modo === 'fichero' ? ' · Se ha vendido una unidad que no existía.' : ' · Correcto: una unidad, una venta.')}
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button label="Siguiente paso" variant="primary" size="sm" isDisabled={n === 4} onClick={() => setN(n + 1)} />
        <Button label="Reiniciar" variant="ghost" size="sm" onClick={() => setN(0)} />
      </div>
    </Panel>
  );
}

// ---------- Planos: CSV, TSV, longitud fija ----------
const PLANOS = {
  csv: 'Ana López,Madrid, España,28001\nLuis Pérez,Sevilla,41001',
  tsv: 'Ana López\tMadrid, España\t28001\nLuis Pérez\tSevilla\t41001',
  fija: 'Ana López   Madrid, España      28001\nLuis Pérez  Sevilla             41001',
};
const NOTA_PLANOS = {
  csv: 'CSV: separado por comas. Pero «Madrid, España» lleva una coma dentro, y esta línea se lee como cuatro campos en vez de tres.',
  tsv: 'TSV: separado por tabuladores. La coma de «Madrid, España» ya no confunde a nadie.',
  fija: 'Longitud fija: cada campo ocupa siempre las mismas posiciones (1-12 nombre, 13-32 ciudad, 33-37 código). Se lee por posiciones, pero se desperdicia espacio.',
};

function Planos() {
  const [f, setF] = useState<keyof typeof PLANOS>('csv');
  return (
    <Panel titulo="Dónde acaba un campo">
      <SegmentedControl label="Formato" value={f} onChange={(v) => setF(v as keyof typeof PLANOS)}>
        <SegmentedControlItem value="csv" label="CSV" />
        <SegmentedControlItem value="tsv" label="TSV" />
        <SegmentedControlItem value="fija" label="Longitud fija" />
      </SegmentedControl>
      <pre style={{ margin: '16px 0 0', padding: '14px 16px', borderRadius: 12, background: 'var(--t1)', border: '1px solid var(--t4)', font: '500 15px/1.7 var(--f-codigo)', color: 'var(--t10)', overflowX: 'auto' }}>{PLANOS[f].replaceAll('\t', '  →  ')}</pre>
      <p className="resultado" data-ok={f !== 'csv'} style={{ marginTop: 14 }}>{NOTA_PLANOS[f]}</p>
    </Panel>
  );
}

// ---------- Coste de buscar ----------
function Busqueda() {
  const [exp, setExp] = useState(4);
  const n = 10 ** exp;
  const filas: [string, number, string][] = [
    ['Fichero plano (secuencial)', n, 'O(n): en el peor caso lee todos los registros.'],
    ['Fichero indexado (árbol B+)', Math.ceil(Math.log2(n)), 'O(log n): busca la clave en el índice y salta a su dirección.'],
    ['Acceso directo (hashing)', 1, 'O(1) ideal: la clave se convierte en la dirección. Empeora con colisiones.'],
  ];
  return (
    <Panel titulo="¿Cuántas lecturas para encontrar un registro?" ancho>
      <Slider label={`Registros: ${n.toLocaleString('es-ES')}`} value={exp} onChange={(v: number) => setExp(v)} min={2} max={8} step={1} valueDisplay="none" />
      <div style={{ display: 'grid', gap: 10, marginTop: 18 }}>
        {filas.map(([t, k, nota]) => (
          <div key={t}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 15 }}><strong>{t}</strong><span className="grande" style={{ fontSize: 17 }}>{k.toLocaleString('es-ES')}</span></div>
            <div style={{ height: 10, borderRadius: 999, background: 'var(--t3)', overflow: 'hidden', margin: '6px 0' }}>
              <div style={{ width: `${Math.max(1, (Math.log10(k + 1) / Math.log10(n + 1)) * 100)}%`, height: '100%', background: 'var(--familia-solido)', transition: 'width 300ms var(--ease)' }} />
            </div>
            <small style={{ color: 'var(--t8)' }}>{nota}</small>
          </div>
        ))}
      </div>
      <p style={{ margin: '14px 0 0', fontSize: 14, color: 'var(--t8)' }}>Barras en escala logarítmica: con 100 millones de registros, el índice necesita unas 27 lecturas y el fichero plano, 100 millones.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="criterios" titulo="Cuatro criterios para juzgar">
        <p>La píldora plantea una tienda online con 5.000 productos, 800 pedidos al día y 30 compras simultáneas, con una regla: nunca vender si las existencias quedarían en negativo. Cualquier forma de guardar datos se juzga con cuatro criterios:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Criterio</th><th>Pregunta en la tienda</th></tr></thead>
            <tbody>
              <tr><td><strong>Persistencia</strong></td><td>Si se reinicia el servidor, ¿siguen ahí los pedidos?</td></tr>
              <tr><td><strong>Acceso</strong></td><td>¿Se lee el catálogo rápido y se escriben pedidos sin parar?</td></tr>
              <tr><td><strong>Integridad</strong></td><td>¿Es imposible que las existencias queden negativas?</td></tr>
              <tr><td><strong>Escalabilidad</strong></td><td>Con 30 compras a la vez, ¿responde igual de rápido?</td></tr>
            </tbody>
          </table>
        </div>
        <p>Un <T def="Unidad lógica de datos relacionados, con nombre, extensión y metadatos, gestionada por el sistema operativo.">fichero</T> cumple la persistencia. Lo demás, si lo necesitas, lo tiene que programar tu aplicación. Por contenido, hay ficheros de <strong>texto</strong> (código, configuración, logs), <strong>binarios</strong> (imágenes, ejecutables, comprimidos) y <strong>de datos</strong> (CSV, XML, JSON o formatos propios).</p>
      </Bloque>

      <Bloque id="planos" titulo="Ficheros planos">
        <p>En un fichero plano cada línea es un <strong>registro</strong> y cada trozo, un <strong>campo</strong>. Son simples, portables y eficientes para leer todo de principio a fin, por lotes. Sus debilidades: redundancia, búsquedas lentas y ningún control de concurrencia ni de recuperación. La lámina de arriba es el ejemplo de la píldora: dos compras leen «1» a la vez y venden dos unidades.</p>
        <Planos />
        <p>Regla práctica: si hay comas en los datos, TSV; si prima la compatibilidad, CSV; si necesitas leer por posiciones y no importa el espacio, longitud fija.</p>
      </Bloque>

      <Bloque id="indexados" titulo="Ficheros indexados">
        <p>Un fichero indexado añade un <T def="Estructura aparte con pares (clave, dirección) que permite saltar directamente a un registro.">índice</T>: una guía de pares <strong>(clave, dirección)</strong>, como «pedido 12345 → posición 8192». Buscas la clave en el índice y saltas al registro sin leer el resto. Si el índice es un árbol B o B+, buscar pasa de O(n) a O(log n).</p>
        <Busqueda />
        <p>Tipos: <strong>primario</strong> (sobre la clave principal), <strong>secundario</strong> (sobre otro campo) y <strong>agrupado</strong> (ordena físicamente los datos; va bien para rangos). Pero el índice no es gratis: ocupa entre un 10 % y un 30 % más y hace más lentas las escrituras, porque cada alta actualiza también los índices.</p>
      </Bloque>

      <Bloque id="directo" titulo="Acceso directo y hashing">
        <p>El <strong>acceso directo</strong> lee o escribe un registro sin pasar por los anteriores. Con registros de tamaño fijo, la posición se calcula: <strong>posición = inicio + número de registro × tamaño del registro</strong>.</p>
        <p>El <T def="Función que convierte una clave en una dirección de almacenamiento.">hashing</T> va más allá: una función convierte la clave en la dirección (por división, por multiplicación o con un hash criptográfico para claves de texto). Es casi instantáneo por clave, pero tiene dos pegas: las <strong>colisiones</strong> (dos claves, misma dirección; se resuelven encadenando o con sondeo) y los <strong>rangos</strong>, porque el hash no guarda orden y «pedidos entre dos fechas» le cuesta.</p>
      </Bloque>

      <Bloque id="cuando" titulo="Cuándo hace falta un SGBD">
        <p>Los ficheros se quedan cortos cuando la aplicación tiene que encargarse de mantener las relaciones entre datos, coordinar accesos simultáneos y agrupar cambios en operaciones seguras. Un SGBD automatiza esas garantías y permite consultas <strong>declarativas</strong>: dices qué quieres, no cómo buscarlo.</p>
        <p>No es todo o nada: ficheros y bases de datos conviven. La regla de la píldora: <strong>datos críticos, varios usuarios y reglas entre datos → SGBD</strong>; acceso simple y secuencial → puede bastar un fichero.</p>
        <ParaElReto>
          <p>La hoja de cálculo de la tienda tiene los problemas de un fichero: el nombre de cada categoría se repite en cada fila, nada impide dos productos con el mismo código y no hay forma de tener una categoría sin productos. Cualquiera de esas tres cosas es una buena «ventaja concreta del SGBD» para el paso 3.</p>
        </ParaElReto>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="ficheros" preguntas={[
          { p: 'Dos compras simultáneas leen «existencias = 1» de un CSV y ambas venden. ¿Qué falta?', opciones: ['Persistencia', 'Control de concurrencia', 'Un formato TSV', 'Un índice'], ok: 1, porque: 'El fichero no coordina accesos simultáneos ni tiene transacciones.' },
          { p: 'Buscar en un fichero indexado con árbol B+ cuesta…', opciones: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], ok: 1, porque: 'Logarítmico: por eso un índice compensa con muchos registros.' },
          { p: '¿Qué organización responde peor a «pedidos entre el 1 y el 15 de marzo»?', opciones: ['Indexado con árbol B+', 'Índice agrupado', 'Hashing', 'Ninguna'], ok: 2, porque: 'El hash no mantiene orden, así que no sirve para rangos.' },
          { p: 'Un precio de un índice es…', opciones: ['Búsquedas más lentas', 'Más espacio y escrituras más lentas', 'Perder la persistencia', 'No poder usar SQL'], ok: 1, porque: 'Ocupa un 10-30 % más y cada alta actualiza los índices.' },
        ]} />
      </div>
    </>
  );
}
