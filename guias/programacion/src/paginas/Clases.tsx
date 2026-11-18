import { LAMINAS, enlace } from '../laminas/index.ts';

interface Sesion { fecha: string; dia: string; titulo: string; puntos: string[]; ejercicios?: string; laminas: string[] }

const SESIONES: Sesion[] = [
  { fecha: '30/09', dia: 'Miércoles', titulo: 'Presentación del módulo', puntos: ['Sin contenido técnico: organización de la asignatura con la profesora Simona.', 'Programación: clase semanal los miércoles, 2 horas. Fundamentos de la Programación (Python) va aparte, cada 15 días.', 'El curso se estructura en unidades y retos profesionales.'], laminas: [] },
  { fecha: '07/10', dia: 'Miércoles', titulo: 'Reto 1 y preparación del entorno', puntos: ['Cuatro retos: los dos primeros en C#, los dos últimos en Java. Reto 1 desde cero, 7 sesiones y entrega antes del 20/11.', 'Pesos del Reto 1: sintaxis y tipos 30 %, control de flujo 40 %, entrada y librerías 20 %, calidad 10 %.', 'Instalación: VS Code + C# Dev Kit + .NET SDK, comprobada con dotnet --version.', 'Primera Console App y Program.cs; estructura con Main frente a la plantilla de una línea.'], laminas: ['entorno', 'lenguajes', 'reto1'] },
  { fecha: '14/10', dia: 'Miércoles', titulo: 'Estructura de un programa, variables y operadores', puntos: ['Anatomía de Program.cs: using System, class Program, static void Main(string[] args).', 'Ejercicio «mi primera tarjeta por consola» con tres WriteLine.', 'Algoritmo frente a programa; entrada → proceso → salida (área del rectángulo); natural, pseudocódigo y C#.', 'Variables, tipos (int, double, decimal con M, string, bool), camelCase, constantes en MAYÚSCULAS.', 'Operadores: división entera (5/2 = 2), %, ++, comparación y lógicos. Introducción a Parse y TryParse.', 'Práctica: presupuesto de una excursión e interpolación con $.'], laminas: ['entorno', 'algoritmos', 'variables', 'constantes', 'operadores', 'conversiones'] },
  { fecha: '21/10', dia: 'Miércoles', titulo: 'Entrada por consola y decisiones', puntos: ['Error por varios Main en un proyecto: un proyecto, un punto de entrada.', 'ReadLine devuelve string; Write frente a WriteLine; concatenar con + frente a interpolar con $.', 'int.Parse para convertir la edad.', 'if, if-else (saldo), else if (notas: por qué no valen varios if sueltos), switch con break y default.', 'Prácticas: acceso por edad (16), tarifa de envío (≤2 kg 4 €, ≤5 kg 7 €, >5 kg 12 €) y menú de bebidas.', 'Lío de la coma y el punto al teclear el peso.'], ejercicios: 'Ejercicios 1-3', laminas: ['entorno', 'conversiones', 'decisiones'] },
  { fecha: '26/10', dia: 'Lunes', titulo: 'Webinar 1.º DAM + 1.º DAW', puntos: ['Cómo se organiza el campus: Introducción (calendario y reserva de tutorías), Secciones (material obligatorio por unidad) y Material complementario.', 'Dudas de gestión, al personal de gestión; dudas académicas, al profesorado. Tutorías con reserva previa.'], laminas: [] },
  { fecha: '28/10', dia: 'Miércoles', titulo: 'Bucles y tablas', puntos: ['Fechas de los retos: 20/11, 22/01, 05/03 y 23/04. Los tests ya están disponibles.', 'Llaves siempre en los if; using System puede salir atenuado (implícito).', 'Tres preguntas de cualquier bucle. for, while y do-while; break y continue; += y -=.', 'Ejercicio 8, tabla de multiplicar; ejercicio 9, ahorro mensual con :F2; ejercicio 10, bicicleta de 900 € con constante y saldo pendiente.'], ejercicios: 'Ejercicios 8-10 (ZIP de la clase)', laminas: ['bucles', 'constantes', 'decisiones', 'reto1'] },
  { fecha: '04/11', dia: 'Miércoles', titulo: 'Validación, Math, cadenas y excepciones', puntos: ['En clase, práctica; la teoría se estudia en el aula virtual.', 'Math: Pow, Round, Sqrt, Abs, Max, Min y PI.', 'Cadenas: Trim, ToLower, ToUpper y Length.', 'TryParse con out y while para pedir hasta que el dato sea válido; no usar break para eso.', 'try-catch (Exception) para que una división entre cero no rompa el programa.', 'Ejercicio 15, IVA: el ensayo general del reto. Entrega del reto en .zip hasta el 20 inclusive.'], ejercicios: 'Ejercicios 11-15 + PDF guía del Reto 1', laminas: ['errores', 'conversiones', 'reto1'] },
];

export function Clases() {
  return (
    <div className="pagina">
      <h1>Diario de clases</h1>
      <p>Lo que se vio en cada clase grabada del módulo, en una lista, con enlace a las láminas donde está explicado a fondo. Las grabaciones completas están en «3 Clases grabadas».</p>
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
