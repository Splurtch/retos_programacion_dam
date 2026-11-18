import { LAMINAS, enlace } from '../laminas/index.ts';

interface Sesion { fecha: string; dia: string; titulo: string; puntos: string[]; ejercicios?: string; laminas: string[] }

const SESIONES: Sesion[] = [
  { fecha: '29/09', dia: 'Martes', titulo: 'Presentación de la asignatura', puntos: ['Recorrido del curso: diseño conceptual (entidad-relación), modelo relacional y normalización, SQL, consultas, transacciones y, al final, un ejercicio que une base de datos y programación.', 'Test inicial de nivel: no cuenta para nota.', 'Los entregables son los «retos profesionales». Hay un margen de recuperación de un mes y cuenta la mejor nota.', 'Se puede usar cualquier gestor mientras se trabaje con SQL.'], laminas: ['datos'] },
  { fecha: '06/10', dia: 'Martes', titulo: 'Cuestionarios iniciales y dudas de plataforma', puntos: ['Sin temario: cuestionarios diagnósticos de Bases de datos y Lenguaje de marcas (8 preguntas y una breve de desarrollo; «no lo sé» es válido).', 'Exámenes presenciales el 22 y el 23 de mayo; la sede se elige por formulario.', 'Para dudas, el correo institucional del profesorado, no la mensajería de la plataforma.'], laminas: [] },
  { fecha: '13/10', dia: 'Martes', titulo: 'Qué es una base de datos', puntos: ['Estudiar sobre todo el primer PDF de la Unidad 1; el resto es ampliación.', 'Base de datos: conjunto organizado de datos. Datos, estructura y relaciones; persistencia, organización y accesibilidad.', 'Dato frente a información; Big Data.', 'Estructurados, semiestructurados y no estructurados. La misma información en Excel/CSV, JSON y texto libre.', 'Historia de los 60 a la IA. SGBD y SQL. Tarea: instalar MySQL y Workbench.'], laminas: ['datos', 'sgbd'] },
  { fecha: '20/10', dia: 'Martes', titulo: 'Modelos y claves', puntos: ['Modelo relacional (Codd, 1970): columna = atributo = campo; fila = tupla = registro.', 'Clave primaria («quién soy») y clave foránea («a quién pertenezco»). Integridad referencial: nada de pedidos huérfanos.', 'Redundancia, normalización e independencia. SELECT … FROM … WHERE.', 'Modelo orientado a objetos (clases, atributos, métodos, OQL) e introducción a NoSQL. Escalabilidad vertical y horizontal.'], laminas: ['relacional', 'modelos'] },
  { fecha: '26/10', dia: 'Lunes', titulo: 'Webinar 1.º DAM + 1.º DAW', puntos: ['Evaluación: 70 % retos profesionales, 20 % tests de las unidades (dos intentos, cuenta la nota más alta) y 10 % examen presencial.', 'Organización del campus y de las tutorías.'], laminas: ['reto1'] },
  { fecha: '27/10', dia: 'Martes', titulo: 'Elegir modelo e instalar MySQL', puntos: ['Fechas de los cuatro retos de Bases de datos: 20/11, 22/01, 05/03 y 23/04.', 'Relacional, objetos y las cuatro familias NoSQL. Método: rasgo del caso, ventaja del modelo y por qué no los otros.', 'Casos: hotel con pagos (relacional), rutas de senderismo (grafos), nóminas, fichas de jugadores (documentos), preferencias (clave-valor), investigadores (grafos).', 'Diseño de una biblioteca con préstamos (tabla intermedia para el muchos a muchos).', 'Instalación de MySQL Server y Workbench; contraseña de root; puerto 3306.'], laminas: ['modelos', 'relacional', 'reto1'] },
  { fecha: '03/11', dia: 'Martes', titulo: 'El SGBD y primera práctica en MySQL', puntos: ['Definición de SGBD (el bibliotecario) y sus cinco características: independencia, transacciones, concurrencia, seguridad y optimización.', 'Arquitectura de tres niveles: físico, lógico y de vista.', 'DDL (CREATE, ALTER, DROP) y DML (SELECT, INSERT, UPDATE, DELETE); NOT NULL, UNIQUE, DEFAULT; COMMIT y ROLLBACK.', 'Práctica en Workbench: base de datos biblioteca con autores y libros unidos por clave foránea.'], laminas: ['sgbd', 'relacional'] },
  { fecha: '10/11', dia: 'Martes', titulo: 'Modelo entidad-relación y Reto 1', puntos: ['Lectura del Reto 1: un único PDF, sin SQL ni propagación de claves. «El reto es cortito».', 'Tendencias: multimodelo, DBaaS, Big Data e IA.', 'Entidades en singular y mayúsculas; atributos con P·, U·, N·, M·, NM·, D·, C·; un atributo por línea.', 'Cardinalidades (mín, máx) y su colocación: «un pedido lo hace un cliente y solo uno → (1,1) junto al cliente». El tipo sale de los máximos.', 'Práctica en draw.io: cajas, rombos, flechas y exportar a PNG.'], ejercicios: 'Ejercicio de profesores, módulos y exámenes', laminas: ['entidades', 'cardinalidad', 'reto1'] },
];

export function Clases() {
  return (
    <div className="pagina">
      <h1>Diario de clases</h1>
      <p>Lo que se vio en cada clase grabada del módulo, en una lista, con enlace a las láminas donde está explicado a fondo. Las grabaciones completas están en «3 Clases grabadas». La clase del 17/11, donde se iba a trabajar la comprobación de la categoría vacía, no está entre las grabaciones descargadas.</p>
      {SESIONES.map((s) => (
        <section key={s.fecha} className="sesion" aria-labelledby={`s-${s.fecha}`}>
          <div className="sesion-fecha">{s.fecha}<small>{s.dia} · 2026</small></div>
          <div>
            <h2 id={`s-${s.fecha}`}>{s.titulo}</h2>
            <ul>{s.puntos.map((p) => <li key={p}>{p}</li>)}</ul>
            {s.ejercicios && <p style={{ margin: '0 0 10px', fontSize: 15, color: 'var(--t8)' }}>Material: {s.ejercicios}</p>}
            {s.laminas.length > 0 && (
              <div className="enlaces-lam">
                {s.laminas.map((id) => {
                  const m = LAMINAS.find((l) => l.id === id)!;
                  return <a key={id} href={enlace(id)} data-familia={m.familia}>{m.num} {m.corto}</a>;
                })}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
