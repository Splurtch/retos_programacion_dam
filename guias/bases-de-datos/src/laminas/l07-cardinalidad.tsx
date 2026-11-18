import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, EnClase, Ojo, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { DiagramaER } from '../ui/Er.tsx';
import { tipo, type Max } from '../er.ts';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Dos cajas sueltas no cuentan nada. La <strong>interrelación</strong> las une con un rombo y dice cómo se asocian en el mundo real: un cliente hace pedidos, un producto pertenece a una categoría. La <strong>cardinalidad</strong> precisa cuántos: como mínimo y como máximo, en cada sentido. Es la parte que más lío da, y por eso tiene un método: preguntar en voz alta y escribir la respuesta junto a la entidad que estás contando.</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Un rombo entre dos cajas, con un verbo encima, el tipo dentro (1:1, 1:N, N:M) y un paréntesis (mín,máx) junto a cada entidad.'],
  ['Se confunde con', 'El tipo de relación. El paréntesis tiene mínimo y máximo; el tipo solo mira los dos máximos.'],
  ['Hábitat', 'El paso 2 del Reto 1: CATEGORIA, PRODUCTO y el rombo que las une.'],
  ['Método', '«Un A, ¿cuántos B tiene?» → la respuesta se escribe junto a B.'],
];

export const secciones = [
  { id: 'interrelacion', titulo: 'Qué es una interrelación' },
  { id: 'minmax', titulo: 'Mínimos y máximos' },
  { id: 'colocar', titulo: 'Dónde va cada paréntesis' },
  { id: 'tipos', titulo: 'El tipo: 1:1, 1:N, N:M' },
  { id: 'tienda', titulo: 'El ejemplo de la tienda' },
];

// ---------- Destacado: entrenador de colocación ----------
const PARES = ['(0,1)', '(1,1)', '(0,n)', '(1,n)'] as const;
const CASOS: { frase: string; ents: [string, string]; par: string; junto: string }[] = [
  { frase: 'Un pedido lo hace un cliente y solo uno.', ents: ['CLIENTE', 'PEDIDO'], par: '(1,1)', junto: 'CLIENTE' },
  { frase: 'Un cliente puede no haber hecho ningún pedido o haber hecho muchos.', ents: ['CLIENTE', 'PEDIDO'], par: '(0,n)', junto: 'PEDIDO' },
  { frase: 'Una persona puede no tener pasaporte o tener como mucho uno.', ents: ['PERSONA', 'PASAPORTE'], par: '(0,1)', junto: 'PASAPORTE' },
  { frase: 'Un pasaporte es de una persona y solo de una.', ents: ['PERSONA', 'PASAPORTE'], par: '(1,1)', junto: 'PERSONA' },
  { frase: 'Un actor actúa en una o en varias películas.', ents: ['ACTOR', 'PELICULA'], par: '(1,n)', junto: 'PELICULA' },
  { frase: 'Un profesor pertenece a un único departamento.', ents: ['PROFESOR', 'DEPARTAMENTO'], par: '(1,1)', junto: 'DEPARTAMENTO' },
  { frase: 'Un proveedor tiene uno o varios contactos.', ents: ['PROVEEDOR', 'CONTACTO'], par: '(1,n)', junto: 'CONTACTO' },
  { frase: 'Una asignatura la imparte un profesor y solo uno.', ents: ['PROFESOR', 'ASIGNATURA'], par: '(1,1)', junto: 'PROFESOR' },
];

export function Destacado() {
  const [i, setI] = useState(0);
  const [par, setPar] = useState<string>();
  const [junto, setJunto] = useState<string>();
  const [aciertos, setAciertos] = useState(0);
  const c = CASOS[i];
  const listo = par && junto;
  const bien = par === c.par && junto === c.junto;
  const siguiente = () => { if (bien) setAciertos(aciertos + 1); setI((i + 1) % CASOS.length); setPar(undefined); setJunto(undefined); };
  return (
    <Panel titulo="¿Qué paréntesis sale y junto a qué entidad va?">
      <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--t8)' }}>Caso {i + 1} de {CASOS.length} · {aciertos} acertados</p>
      <p className="grande" style={{ fontSize: 19, margin: '0 0 16px' }}>«{c.frase}»</p>
      <div className="opciones" role="group" aria-label="Paréntesis">
        {PARES.map((p) => <button key={p} type="button" className="opcion" aria-pressed={par === p} onClick={() => setPar(p)}>{p}</button>)}
      </div>
      <div className="opciones" role="group" aria-label="Junto a">
        {c.ents.map((e) => <button key={e} type="button" className="opcion" aria-pressed={junto === e} onClick={() => setJunto(e)}>junto a {e}</button>)}
      </div>
      <div className="tabla-scroll">
        <DiagramaER compacto etiqueta={`Relación entre ${c.ents[0]} y ${c.ents[1]}`} a={{ nombre: c.ents[0], atributos: [] }} b={{ nombre: c.ents[1], atributos: [] }} rel=" "
          cardA={junto === c.ents[0] ? par : undefined} cardB={junto === c.ents[1] ? par : undefined}
          estadoA={listo ? (bien ? 'ok' : 'mal') : undefined} estadoB={listo ? (bien ? 'ok' : 'mal') : undefined} />
      </div>
      <p className="resultado" data-ok={listo ? bien : undefined} aria-live="polite" style={{ marginTop: 12 }}>
        {!listo ? 'Elige el paréntesis y su sitio.'
          : bien ? <><strong>Eso es.</strong> La pregunta cuenta ocurrencias de {c.junto}, así que el paréntesis va a su lado.</>
          : par !== c.par ? <><strong>Revisa los números.</strong> ¿Puede ser cero? Eso decide el mínimo. ¿Puede ser más de uno? Eso decide el máximo.</>
          : <><strong>Los números están bien; el lado, no.</strong> ¿Qué estás contando en la frase? El paréntesis va junto a eso.</>}
      </p>
      {listo && <div style={{ marginTop: 12 }}><Button label={i + 1 < CASOS.length ? 'Siguiente caso' : 'Volver al primero'} variant="primary" size="sm" onClick={siguiente} /></div>}
    </Panel>
  );
}

// ---------- Tipo por máximos ----------
const EJ_TIPO: Record<string, string> = {
  '1:1': 'Persona y número de la Seguridad Social: cada uno con uno solo.',
  '1:N': 'Cliente y pedido: un cliente, muchos pedidos; un pedido, un cliente.',
  'N:M': 'Actor y película: muchos con muchos. Más adelante necesitará una tabla intermedia.',
};

function TipoPorMaximos() {
  const [a, setA] = useState<Max>(1);
  const [b, setB] = useState<Max>('N');
  const t = tipo(a, b);
  const sel = (set: (m: Max) => void, actual: Max, et: string) => (
    <div>
      <div style={{ fontSize: 13, color: 'var(--t8)', marginBottom: 4 }}>{et}</div>
      <div className="opciones" role="group" aria-label={et} style={{ margin: 0 }}>
        {([1, 'N'] as Max[]).map((m) => <button key={String(m)} type="button" className="opcion" aria-pressed={actual === m} onClick={() => set(m)}>{m === 'N' ? 'n' : '1'}</button>)}
      </div>
    </div>
  );
  return (
    <Panel titulo="El tipo sale de los máximos">
      <div className="fila-controles">
        {sel(setA, a, 'Máximo junto a A')}
        {sel(setB, b, 'Máximo junto a B')}
      </div>
      <p className="grande" style={{ fontSize: 34, margin: '6px 0' }}>{t}</p>
      <p style={{ margin: 0, color: 'var(--t9)' }}>{EJ_TIPO[t]}</p>
      <p style={{ margin: '10px 0 0', fontSize: 14, color: 'var(--t8)' }}>Los mínimos no cambian el tipo: (0,1)–(1,n) y (1,1)–(0,n) son las dos 1:N.</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="interrelacion" titulo="Qué es una interrelación">
        <p>Una <T def="Conexión entre entidades que representa una relación del mundo real.">interrelación</T> conecta entidades para representar lo que pasa en el mundo real: un cliente <em>hace</em> pedidos, un producto <em>pertenece</em> a una categoría, un proveedor <em>tiene</em> contactos. Se dibuja con un <strong>rombo</strong> y se nombra con un verbo.</p>
        <p>Según los apuntes, toda interrelación tiene cuatro rasgos: <strong>representa una relación real</strong>; tiene <strong>cardinalidad</strong>; garantiza la <strong>integridad referencial</strong> (un pedido no puede ser de un cliente que no existe), y a veces tiene <strong>atributos propios</strong>, que solo existen cuando las dos ocurrencias se juntan (los ves en la <a href={enlace('avanzado')}>lámina 08</a>).</p>
        <p>Una interrelación se lee <strong>en los dos sentidos</strong>. «Un cliente hace pedidos» y «un pedido lo hace un cliente» son dos frases distintas con dos respuestas distintas, y cada una da un paréntesis.</p>
      </Bloque>

      <Bloque id="minmax" titulo="Mínimos y máximos">
        <p>La <T def="Cuántas ocurrencias de una entidad pueden asociarse con una ocurrencia de la otra, como mínimo y como máximo.">cardinalidad</T> es una regla de negocio: cuántas ocurrencias de una entidad pueden ir con una de la otra. Se escribe como un par <strong>(mínimo, máximo)</strong>:</p>
        <ul>
          <li><strong>Mínimo 0</strong>: no es obligatorio; puede no haber ninguna. <strong>Mínimo 1</strong>: obligatorio, al menos una.</li>
          <li><strong>Máximo 1</strong>: como mucho una. <strong>Máximo n</strong>: pueden ser muchas.</li>
        </ul>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Par</th><th>Se lee</th><th>Pregunta que lo delata</th></tr></thead>
            <tbody>
              <tr><td><strong>(0,1)</strong></td><td>Opcional, como mucho una</td><td>«Puede no tener… o tener una»: una persona y su pasaporte</td></tr>
              <tr><td><strong>(1,1)</strong></td><td>Exactamente una</td><td>«Uno y solo uno», «exactamente uno»: el cliente de un pedido</td></tr>
              <tr><td><strong>(0,n)</strong></td><td>Ninguna o muchas</td><td>«Puede no tener o tener varios»: los pedidos de un cliente</td></tr>
              <tr><td><strong>(1,n)</strong></td><td>Al menos una, pueden ser muchas</td><td>«Uno o varios»: los contactos de un proveedor</td></tr>
            </tbody>
          </table>
        </div>
        <p>Los apuntes escriben la n en minúscula, «(1,n)»; en clase se dijo «(0,N)». Las dos formas significan lo mismo.</p>
      </Bloque>

      <Bloque id="colocar" titulo="Dónde va cada paréntesis">
        <p>La regla: pregunta desde una entidad, «<strong>un A, ¿cuántos B?</strong>», y escribe la respuesta <strong>junto a B</strong>, la entidad que cuentas. Luego haz la pregunta al revés y escribe la otra respuesta junto a A.</p>
        <Panel titulo="El ejemplo de clase, leído en los dos sentidos" ancho>
          <div className="tabla-scroll">
            <DiagramaER etiqueta="CLIENTE (1,1) hace 1:N (0,n) PEDIDO" a={{ nombre: 'CLIENTE', atributos: ['P · cod_cliente', 'nombre'] }} b={{ nombre: 'PEDIDO', atributos: ['P · cod_pedido', 'fecha'] }} rel="hace" tipo="1:N" cardA="(1,1)" cardB="(0,n)" flechaB />
          </div>
          <ul style={{ margin: '14px 0 0' }}>
            <li>«Un <strong>pedido</strong>, ¿cuántos clientes?» Uno y solo uno → <strong>(1,1) junto a CLIENTE</strong>.</li>
            <li>«Un <strong>cliente</strong>, ¿cuántos pedidos?» Ninguno o muchos → <strong>(0,n) junto a PEDIDO</strong>.</li>
          </ul>
        </Panel>
        <EnClase fecha="10/11">
          <p>«Un pedido lo hace un cliente y solo uno. ¿Qué paréntesis sale y junto a qué entidad va?» La respuesta de clase: «(1,1) junto al cliente… porque un pedido tiene que ser únicamente de un cliente». Y la regla: «Siempre hacia donde vamos, no al revés». La profesora insistió en decir las frases en voz alta: «es donde recae la acción».</p>
        </EnClase>
        <p>En las figuras de los apuntes la línea que llega al lado n lleva además una <strong>punta de flecha</strong>. Es opcional, pero ayuda a leer el diagrama.</p>
      </Bloque>

      <Bloque id="tipos" titulo="El tipo: 1:1, 1:N, N:M">
        <p>El tipo de la interrelación se escribe dentro del rombo y <strong>sale solo de los dos máximos</strong>: si los dos son 1, es 1:1; si uno es 1 y el otro n, es 1:N; si los dos son n, es N:M.</p>
        <TipoPorMaximos />
        <Ojo dice="«Cardinalidad máxima 1: indica que solo puede existir una asociación (relación uno a uno).»" realidad="Un máximo de 1 en un lado no hace que la relación sea 1:1. CLIENTE–PEDIDO tiene máximo 1 junto a CLIENTE y es 1:N. El tipo depende de los dos máximos a la vez, como se explicó en clase." />
        <p>Los apuntes añaden <strong>N:1</strong> (muchos a uno) como cuarto tipo: es la misma 1:N leída desde el otro lado, así que en el rombo se escribe 1:N.</p>
        <ParaElReto>
          <p>En el reto, mira los dos máximos de tus paréntesis y escribe el tipo en el rombo. Si te sale N:M, revisa: «un producto pertenece exactamente a una categoría» no deja que el máximo de categorías sea n.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="tienda" titulo="El ejemplo de la tienda">
        <p>Los apuntes construyen una tienda de informática requisito a requisito. Es más grande que el reto, pero usa la misma notación. Estas son sus interrelaciones:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Interrelación</th><th>Entidades</th><th>Tipo</th><th>Por qué</th></tr></thead>
            <tbody>
              <tr><td>ContactoProv</td><td>PROVEEDOR (1,1) – (1,n) CONTACTO</td><td>1:N</td><td>Cada contacto es de un proveedor; un proveedor tiene uno o varios contactos.</td></tr>
              <tr><td>EmpleadoVenta</td><td>EMPLEADO (1,1) – (1,n) VENTA</td><td>1:N</td><td>Cada venta la formaliza un empleado (CS4: un empleado participa en varias).</td></tr>
              <tr><td>ClienteVenta</td><td>CLIENTE (1,1) – (1,n) VENTA</td><td>1:N</td><td>CS3: un cliente puede participar en más de una venta.</td></tr>
              <tr><td>LineaVenta</td><td>VENTA (1,n) – (1,n) PRODUCTO</td><td>N:M</td><td>Una venta lleva varios productos; CS2: un producto se vende más de una vez.</td></tr>
              <tr><td>ProveedorCompra</td><td>PROVEEDOR (1,1) – (1,n) COMPRA</td><td>1:N</td><td>Cada compra se hace a un proveedor.</td></tr>
              <tr><td>LineaCompra</td><td>COMPRA (1,n) – (1,n) PRODUCTO</td><td>N:M</td><td>CS1: un producto puede comprarse a más de un proveedor.</td></tr>
            </tbody>
          </table>
        </div>
        <p>Fíjate en PRODUCTO: tiene <code>C· tipo</code> (codificable) en vez de una entidad CATEGORIA. En el reto la categoría sí es entidad, porque tiene código y nombre propios y puede existir sin productos.</p>
        <EnClase fecha="10/11">
          <p>Ejercicio de departamentos: «un profesor puede estar en muchos departamentos, no: como mínimo en uno y como máximo en uno». De ahí sale (1,1) junto a DEPARTAMENTO. Si te lías, conjuga el verbo en los dos sentidos: «el profesor <em>pertenece a</em>», «el departamento <em>tiene</em>».</p>
        </EnClase>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="cardinalidad" preguntas={[
          { p: '«Un cliente puede no haber hecho ningún pedido o haber hecho muchos.» ¿Qué paréntesis y dónde?', opciones: ['(0,n) junto a CLIENTE', '(0,n) junto a PEDIDO', '(1,n) junto a PEDIDO', '(0,1) junto a CLIENTE'], ok: 1, porque: 'Cuentas pedidos: de 0 a muchos, junto a PEDIDO.' },
          { p: 'Junto a A hay (0,1) y junto a B (1,n). ¿Tipo?', opciones: ['1:1', '1:N', 'N:M', '0:N'], ok: 1, porque: 'Máximos 1 y n.' },
          { p: '¿Qué decide el mínimo de un paréntesis?', opciones: ['Si la relación es 1:N o N:M', 'Si la asociación es obligatoria', 'El nombre del rombo', 'La punta de la flecha'], ok: 1, porque: 'Mínimo 0, opcional; mínimo 1, obligatoria.' },
          { p: 'Estudiantes que se matriculan en varios cursos, y cursos con varios estudiantes. ¿Tipo?', opciones: ['1:1', '1:N', 'N:M', 'Reflexiva'], ok: 2, porque: 'Muchos con muchos en los dos sentidos.' },
        ]} />
      </div>
    </>
  );
}
