import { Isotipo, Pie, SelectorTema, Tarjeta, foco, type Tema } from './App.tsx';
import { Particulas } from './ui/Particulas.tsx';

const asignaturas = [
  { numero: '0483', ruta: 'sistemas-informaticos', titulo: 'Sistemas informáticos', resumen: 'Arquitectura, hardware, montaje y virtualización.' },
  { numero: '0484', ruta: 'bases-de-datos', titulo: 'Bases de datos', resumen: 'Ficheros, SGBD, entidades, relaciones y cardinalidades.' },
  { numero: '0485', ruta: 'programacion', titulo: 'Programación en C#', resumen: 'Algoritmos, variables, decisiones y bucles con simuladores paso a paso.' },
];

export function Portada({ tema, setTema }: { tema: Tema; setTema: (t: Tema) => void }) {
  return (
    <>
      <Particulas />
      <a className="vh" href="#contenido">Saltar al contenido</a>
      <header className="cab">
        <a className="marca" href="./"><Isotipo /><span>Cuaderno de estudio DAM</span></a>
        <span className="cab-hueco" />
        <SelectorTema tema={tema} setTema={setTema} />
      </header>
      <main id="contenido" tabIndex={-1}>
        <div className="indice">
          <section className="ind-hero" onPointerMove={foco}>
            <div className="ind-hero-texto">
              <h1>Cuaderno de estudio DAM</h1>
              <p className="ind-lead">Guías interactivas para repasar conceptos, practicar y preparar los retos de 1.º de DAM.</p>
            </div>
            <div className="ind-logo" data-particulas-ancla aria-hidden="true"><Isotipo size={320} /></div>
          </section>
          <section className="familia" aria-labelledby="asignaturas">
            <div className="familia-cab">
              <h2 id="asignaturas">Unidad 1 por asignatura</h2>
            </div>
            <ul className="tarjetas">
              {asignaturas.map(({ numero, ruta, titulo, resumen }) => (
                <li key={ruta}>
                  <Tarjeta href={`./${ruta}/`} numero={numero} titulo={titulo} resumen={resumen} accion="Abrir guía" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Pie titulo="El cuaderno" descripcion="Apuntes de estudio de Synji para 1.º de DAM."
        enlaces={[
          ...asignaturas.map(({ ruta, titulo }): [string, string] => [titulo, `./${ruta}/`]),
          ['Repositorio y retos', 'https://github.com/Splurtch/retos_programacion_dam'],
        ]} />
    </>
  );
}
