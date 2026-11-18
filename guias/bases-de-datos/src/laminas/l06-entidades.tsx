import { useState } from 'react';
import { Button } from '@astryxdesign/core/Button';
import { Autoevaluacion, Bloque, EnClase, Panel, ParaElReto, T } from '../ui/guia.tsx';
import { enlace } from './index.ts';

export const entradilla = (
  <p>Antes de crear una sola tabla se hace un <strong>plano</strong>: el modelo entidad-relación. Su primera pieza son las <strong>entidades</strong>, las cosas de las que quieres guardar información, y sus <strong>atributos</strong>, los datos que las describen. En esta notación cada atributo lleva delante una letra que dice cómo se comporta: si identifica, si puede faltar, si tiene varios valores…</p>
);

export const ficha: [string, React.ReactNode][] = [
  ['Marcas de campo', 'Una caja con el nombre en MAYÚSCULAS y en singular, y debajo un atributo por línea con su marcador: P·, U·, N·, M·, NM·, D·, C·.'],
  ['Se confunde con', 'Los valores. «PRODUCTO» es una entidad y «precio» un atributo; «Ratón» y «15» son datos concretos, que van en las fichas de ejemplo.'],
  ['Hábitat', 'El paso 1 del Reto 1: dos entidades, sus atributos y el principal marcado con P.'],
  ['Regla de oro', 'P· y U· nunca pueden ser nulos ni multivalorados.'],
];

export const secciones = [
  { id: 'entidad', titulo: 'Qué es una entidad' },
  { id: 'atributo', titulo: 'Atributos y dominio' },
  { id: 'marcadores', titulo: 'Los siete marcadores' },
  { id: 'principal', titulo: 'Principal frente a secundario' },
  { id: 'centro', titulo: 'Ejercicio: el centro de formación' },
];

// ---------- Destacado: marcar el ejercicio 1 de los apuntes ----------
const MARCAS = ['—', 'P', 'U', 'N', 'M', 'NM', 'D', 'C'] as const;
type Marca = (typeof MARCAS)[number];
const EJ: { ent: string; at: string; ok: Marca[]; porque: string }[] = [
  { ent: 'PROFESOR', at: 'codProfesor', ok: ['P'], porque: 'Ningún dato del enunciado identifica sin fallos, así que se inventa un código. Es el principal.' },
  { ent: 'PROFESOR', at: 'nombre', ok: ['—'], porque: 'Siempre está y tiene un solo valor: atributo normal.' },
  { ent: 'PROFESOR', at: 'prApellido', ok: ['—'], porque: 'Normal: todo el mundo tiene al menos uno.' },
  { ent: 'PROFESOR', at: 'sgApellido', ok: ['N'], porque: 'Hay quien no tiene segundo apellido: puede quedar vacío.' },
  { ent: 'PROFESOR', at: 'correos', ok: ['NM'], porque: '«Si se dispone, los correos»: puede no haber ninguno o haber varios.' },
  { ent: 'MODULO', at: 'idModulo', ok: ['P'], porque: 'Código inventado como principal.' },
  { ent: 'MODULO', at: 'nombre', ok: ['U'], porque: '«El nombre de los módulos no se repite»: es único, pero no es el que se usa para relacionar. Secundario.' },
  { ent: 'MODULO', at: 'sigla', ok: ['—', 'D'], porque: '«La sigla sí se puede repetir»: atributo normal en la solución de los apuntes. En clase se propuso D porque se deduce del nombre; las dos lecturas se aceptan si las justificas.' },
  { ent: 'MODULO', at: 'numHoras', ok: ['N'], porque: '«Si se conoce, el número de horas»: puede faltar.' },
];

export function Destacado() {
  const [r, setR] = useState<Record<string, Marca>>({});
  const [ver, setVer] = useState(false);
  const aciertos = EJ.filter((e) => r[e.at + e.ent] && e.ok.includes(r[e.at + e.ent])).length;
  return (
    <Panel titulo="Marca cada atributo">
      <p style={{ margin: '0 0 12px', fontSize: 15, color: 'var(--t9)' }}>Ejercicio 1 de los apuntes. <em>Profesores: nombre, apellidos y, si se dispone, los correos. Módulos: nombre, sigla y, si se conoce, el número de horas. El nombre del módulo no se repite; la sigla, sí.</em></p>
      {['PROFESOR', 'MODULO'].map((ent) => (
        <div key={ent} style={{ marginBottom: 14 }}>
          <div style={{ font: '800 13px var(--f-titulo)', letterSpacing: '.06em', color: 'var(--familia)', marginBottom: 6 }}>{ent}</div>
          {EJ.filter((e) => e.ent === ent).map((e) => {
            const k = e.at + e.ent, v = r[k];
            const est = ver && v ? (e.ok.includes(v) ? 'var(--verde)' : 'var(--rojo)') : undefined;
            return (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: est }}>{v && v !== '—' ? `${v} · ` : ''}{e.at}</span>
                <div role="group" aria-label={`Marcador de ${e.at}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {MARCAS.map((m) => <button key={m} type="button" className="chip" aria-pressed={v === m} style={v === m ? { background: 'var(--familia-relleno)', color: '#fff', borderColor: 'transparent' } : undefined} onClick={() => setR({ ...r, [k]: m })}>{m}</button>)}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, margin: '6px 0 12px' }}>
        <Button label="Corregir" variant="primary" size="sm" onClick={() => setVer(true)} />
        <Button label="Borrar" variant="ghost" size="sm" onClick={() => { setR({}); setVer(false); }} />
      </div>
      {ver && (
        <div className="resultado" data-ok={aciertos === EJ.length} aria-live="polite">
          <strong>{aciertos} de {EJ.length}.</strong>
          <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 14 }}>
            {EJ.filter((e) => !e.ok.includes(r[e.at + e.ent])).map((e) => <li key={e.at + e.ent}><strong>{e.at}:</strong> {e.porque}</li>)}
          </ul>
        </div>
      )}
    </Panel>
  );
}

const TIPOS_AT: [string, string, string, string][] = [
  ['P·', 'Principal', 'Identifica cada ocurrencia y es el que se usa para relacionarla con otras. Único, nunca nulo, estable.', 'cod_producto'],
  ['U·', 'Secundario (único)', 'También es único, pero no se usa para relacionar.', 'correo de un estudiante, nombre de un módulo'],
  ['N·', 'Nulo', 'Puede quedar vacío: no existe, no aplica o no se conoce.', 'segundo apellido'],
  ['M·', 'Multivalorado', 'Puede tener varios valores para la misma ocurrencia.', 'teléfonos, temas de un examen'],
  ['NM·', 'Nulo y multivalorado', 'Cero, uno o varios valores.', 'correos «si se dispone»'],
  ['D·', 'Derivado', 'Se calcula a partir de otros atributos.', 'edad a partir de la fecha de nacimiento, nota final'],
  ['C·', 'Codificable', 'Solo admite una lista cerrada de valores. Más adelante será un CHECK.', 'tipo de producto, cargo, estado civil'],
  ['(nada)', 'Normal', 'Siempre tiene un único valor. No se marca.', 'precio, nombre'],
];

function Candidato() {
  const CANDS: [string, boolean, boolean, boolean, string][] = [
    ['Nombre del cliente', false, true, false, 'Dos clientes pueden llamarse igual, y alguien puede cambiar de nombre.'],
    ['DNI', true, true, true, 'Único, siempre presente y estable. Buen principal… si todos tus clientes tienen DNI español.'],
    ['Correo electrónico', true, true, false, 'Único, pero la gente cambia de correo. Mejor como secundario (U·).'],
    ['Teléfono', false, false, false, 'Puede no tenerlo, puede tener varios (M·) y puede cambiar.'],
    ['Código inventado (cod_cliente)', true, true, true, 'La salida de los apuntes cuando el enunciado no da nada que sirva: «nos inventamos un código».'],
  ];
  const [i, setI] = useState(0);
  const [, u, nn, est, porque] = CANDS[i];
  const crit = [['Único', u], ['Nunca nulo', nn], ['Estable', est]] as const;
  return (
    <Panel titulo="¿Sirve como atributo principal?">
      <div className="opciones" role="group" aria-label="Candidatos">
        {CANDS.map(([n], k) => <button key={n} type="button" className="opcion" aria-pressed={i === k} onClick={() => setI(k)}>{n}</button>)}
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
        {crit.map(([n, ok]) => <span key={n} style={{ padding: '6px 12px', borderRadius: 999, border: `1px solid ${ok ? 'var(--verde)' : 'var(--rojo)'}`, color: ok ? 'var(--verde)' : 'var(--rojo)', fontWeight: 600, fontSize: 14 }}>{ok ? '✓' : '✗'} {n}</span>)}
      </div>
      <p className="resultado" data-ok={u && nn && est} aria-live="polite"><strong>{u && nn && est ? 'Sirve.' : 'No sirve como P·.'}</strong> {porque}</p>
    </Panel>
  );
}

export default function Cuerpo() {
  return (
    <>
      <Bloque id="entidad" titulo="Qué es una entidad">
        <p>Una <T def="Cualquier objeto o concepto sobre el que se desea almacenar información.">entidad</T> es cualquier cosa o concepto del que quieres guardar información: un libro, un cliente, un producto, una venta. Cada caso concreto (el libro «El Principito») es una <strong>ocurrencia</strong> o instancia de la entidad.</p>
        <p>Cuando el modelo se convierta en base de datos relacional, la correspondencia será directa:</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>En el modelo E-R</th><th>En la base de datos</th><th>Ejemplo</th></tr></thead>
            <tbody>
              <tr><td>Entidad</td><td>Tabla</td><td>LIBRO</td></tr>
              <tr><td>Ocurrencia</td><td>Fila (registro)</td><td>001 · Cien años de soledad · García Márquez · 1967</td></tr>
              <tr><td>Atributo</td><td>Columna (campo)</td><td>título, autor, año</td></tr>
            </tbody>
          </table>
        </div>
        <p>Los apuntes piden ocho cualidades a una buena entidad: <strong>unicidad</strong> (un identificador que distinga cada ocurrencia), <strong>atributos bien definidos</strong>, <strong>normalización</strong> (una entidad, un concepto, sin repetir datos), <strong>integridad referencial</strong>, respeto a las <strong>reglas de negocio</strong> (una edad no es negativa), <strong>escalabilidad</strong>, <strong>seguridad</strong> y <strong>documentación</strong>.</p>
        <EnClase fecha="10/11">
          <p>Convenciones para el reto: entidades en <strong>singular y en mayúsculas</strong> (PRODUCTO, CATEGORIA); atributos sin tildes ni espacios (<code>nombre_modulo</code> o <code>nombreModulo</code>), uno por línea, con su marcador delante y el punto medio: <code>P·</code>.</p>
        </EnClase>
      </Bloque>

      <Bloque id="atributo" titulo="Atributos y dominio">
        <p>Un <T def="Propiedad o característica que describe a una entidad. Será una columna.">atributo</T> es un dato que describe a la entidad. Su <T def="Conjunto de todos los valores posibles que puede tomar un atributo.">dominio</T> es el conjunto de valores que puede tomar: la edad, enteros positivos; un correo, texto con el patrón algo@algo.algo; las existencias de un producto, enteros desde 0.</p>
        <p>También se clasifican por su forma: <strong>simples</strong> (no se dividen: edad, precio) o <strong>compuestos</strong> (se dividen en partes con sentido propio: el domicilio en calle, número, ciudad y código postal). Hasta dónde descomponer depende de lo que necesite el sistema.</p>
      </Bloque>

      <Bloque id="marcadores" titulo="Los siete marcadores">
        <p>Delante de cada atributo se escribe una letra que resume su comportamiento. Si no lleva ninguna, es un atributo normal: obligatorio y con un solo valor.</p>
        <div className="tabla-scroll">
          <table className="tabla">
            <thead><tr><th>Marca</th><th>Nombre</th><th>Significa</th><th>Ejemplo</th></tr></thead>
            <tbody>{TIPOS_AT.map(([m, n, s, e]) => <tr key={m}><td><strong>{m}</strong></td><td>{n}</td><td>{s}</td><td>{e}</td></tr>)}</tbody>
          </table>
        </div>
        <p>La regla que ata a todos: <strong>los atributos principales y secundarios siempre son monovalorados y no nulos.</strong> Un identificador que puede faltar o tener dos valores no identifica nada.</p>
      </Bloque>

      <Bloque id="principal" titulo="Principal frente a secundario">
        <p>El <strong>atributo principal</strong> (clave primaria) cumple tres condiciones: <strong>unicidad</strong> (no hay dos iguales), <strong>no nulidad</strong> (siempre tiene valor) y <strong>persistencia</strong> (no cambia con el tiempo). Además, es el que se usa para relacionar la entidad con otras. El <strong>secundario</strong> también es único, pero no se usa para relacionar.</p>
        <Candidato />
        <ParaElReto>
          <p>El enunciado ya te da los principales: «cada producto tiene código único», «cada categoría tiene código único». Lo que tienes que razonar es <em>por qué no el nombre</em>: mira cuántos criterios falla en el panel de arriba. Ese razonamiento, en una frase, es parte del paso 1.</p>
        </ParaElReto>
      </Bloque>

      <Bloque id="centro" titulo="Ejercicio: el centro de formación">
        <p>Ejercicio 2 de los apuntes, con su solución oficial. Intenta hacerlo en papel antes de mirar la tabla: profesores con DNI, nombre, apellidos, cuenta bancaria, domicilio, correos y teléfonos; asignaturas con nombre y horas; alumnos con DNI, nombre, apellidos, fecha de nacimiento, nombres de los padres, domicilio, correos y teléfonos. Consideraciones: el segundo apellido es opcional y puede que no haya teléfonos, correos ni nombres de los padres.</p>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 700, margin: '8px 0 12px' }}>Ver la solución de los apuntes</summary>
          <div className="tabla-scroll">
            <table className="tabla">
              <thead><tr><th>PROFESOR</th><th>ASIGNATURA</th><th>ALUMNO</th></tr></thead>
              <tbody>
                <tr><td>P· DNI<br />nombre<br />prApellido<br />N· sgApellido<br />cuentaBancaria<br />NM· telefonos<br />NM· correosElectronicos</td><td>P· idAsignatura<br />U· nombreAsignatura<br />numHoras</td><td>P· DNI<br />nombre<br />prApellido<br />N· sgApellido<br />fechaNacimiento<br />N· nombresPadres<br />domicilio<br />NM· correosElectronicos<br />NM· telefonos</td></tr>
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 15, color: 'var(--t8)' }}>Fíjate en que ASIGNATURA no tiene un dato natural que identifique, así que se inventa <code>idAsignatura</code>, y el nombre pasa a U·. La relación con departamentos, matrículas y evaluaciones se ve en la <a href={enlace('cardinalidad')}>lámina 07</a>.</p>
        </details>
      </Bloque>

      <div id="autoevaluacion">
        <Autoevaluacion id="entidades" preguntas={[
          { p: '«Si se dispone, los correos de contacto» (pueden ser varios). ¿Qué marca lleva?', opciones: ['N', 'M', 'NM', 'U'], ok: 2, porque: 'Puede no haber ninguno (N) y puede haber varios (M).' },
          { p: '¿Qué atributo NO puede ser nunca nulo?', opciones: ['El segundo apellido', 'El principal', 'El número de horas', 'Ninguno'], ok: 1, porque: 'P· (y U·) son siempre no nulos y monovalorados.' },
          { p: 'La edad, calculada a partir de la fecha de nacimiento, es…', opciones: ['Compuesta', 'Codificable', 'Derivada', 'Multivalorada'], ok: 2, porque: 'Se obtiene con operaciones sobre otro atributo: D·.' },
          { p: '«Tipo: componente, sobremesa, portátil, comunicación o periférico.» ¿Qué marca?', opciones: ['C', 'M', 'D', 'Ninguna'], ok: 0, porque: 'Lista cerrada de valores: codificable. En los apuntes, C· Tipo en PRODUCTO.' },
          { p: '«Ratón» en el Reto 1 es…', opciones: ['Una entidad', 'Un atributo', 'Un valor de una ocurrencia', 'Una relación'], ok: 2, porque: 'Es el valor del atributo nombre en la ocurrencia P1.' },
        ]} />
      </div>
    </>
  );
}
