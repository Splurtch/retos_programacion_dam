import { useMemo, useState } from 'react';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Icon } from '@astryxdesign/core/Icon';
import { LAMINAS, enlace } from '../laminas/index.ts';
import { IcoLupa } from '../ui/iconos.tsx';

const TERMINOS: [string, string, string][] = [
  ['Algoritmo', 'Secuencia finita y ordenada de operaciones que resuelve un problema. Es la idea, antes de ser código.', 'algoritmos'],
  ['Programa', 'Algoritmo escrito en un lenguaje que el ordenador entiende y puede ejecutar.', 'algoritmos'],
  ['Pseudocódigo', 'Forma de escribir un algoritmo con palabras casi naturales y estructura de programa. No se ejecuta.', 'diagramas'],
  ['Diagrama de flujo', 'Representación gráfica de un algoritmo con símbolos estándar unidos por flechas.', 'diagramas'],
  ['Lenguaje de alto nivel', 'Cercano al lenguaje humano, independiente de la máquina y portable. C#, Java, Python.', 'lenguajes'],
  ['Lenguaje de bajo nivel', 'Cercano al hardware y dependiente de la máquina. Ensamblador.', 'lenguajes'],
  ['Compilador', 'Traduce todo el código fuente antes de ejecutarlo y detecta los errores de sintaxis.', 'lenguajes'],
  ['Intérprete', 'Traduce y ejecuta el código sentencia a sentencia, sin generar antes un ejecutable.', 'lenguajes'],
  ['Enlazador', 'Une el código traducido con las librerías para producir el ejecutable final.', 'lenguajes'],
  ['IL / MSIL', 'Lenguaje intermedio que genera el compilador de C#. El CLR lo traduce a código máquina al ejecutar.', 'lenguajes'],
  ['CLR', 'Common Language Runtime: el entorno de .NET que ejecuta el IL, compila con JIT y gestiona la memoria.', 'lenguajes'],
  ['JIT', '«Just in time»: compilación a código máquina en el momento de ejecutar.', 'lenguajes'],
  ['Recolector de basura', 'Parte del CLR que libera la memoria que ya no se usa, sin que el programador lo haga a mano.', 'lenguajes'],
  ['SDK', 'Kit de desarrollo: compilador, herramientas y runtime. Necesario para programar.', 'entorno'],
  ['IDE', 'Entorno de desarrollo integrado: editor, compilador, depurador e interfaz en una sola aplicación.', 'entorno'],
  ['Main', 'Método por el que empieza a ejecutarse un programa C#. Solo puede haber uno por proyecto.', 'entorno'],
  ['Sentencia', 'Una instrucción. En C# termina en punto y coma.', 'entorno'],
  ['Bloque', 'Grupo de sentencias entre llaves { }.', 'entorno'],
  ['Comentario', 'Texto para personas que el compilador ignora: // una línea, /* varias */, /// documentación.', 'entorno'],
  ['Consola', 'Ventana de texto donde el programa escribe (Write, WriteLine) y lee (ReadLine).', 'entorno'],
  ['Variable', 'Espacio de memoria con nombre y tipo cuyo valor puede cambiar durante la ejecución.', 'variables'],
  ['Declarar', 'Crear una variable indicando su tipo y su nombre: int edad;', 'variables'],
  ['Asignar', 'Guardar un valor en una variable con =: edad = 20;', 'variables'],
  ['Tipo de dato', 'Qué clase de valor admite una variable: int, double, string, bool, char, decimal…', 'variables'],
  ['Tipado estático', 'El tipo de cada variable se fija al declararla y el compilador vigila que no cambie.', 'variables'],
  ['Identificador', 'Nombre de una variable, constante, método o clase. Empieza por letra o _, sin espacios.', 'variables'],
  ['Palabra reservada', 'Palabra que C# usa para sí mismo y no puede ser identificador: int, class, if, base…', 'variables'],
  ['camelCase', 'Convención de nombres: primera palabra en minúscula y las siguientes con mayúscula inicial (precioFinal).', 'variables'],
  ['Ámbito', 'Zona del programa donde existe una variable. Una variable local vive dentro de su bloque.', 'variables'],
  ['enum', 'Tipo con un conjunto cerrado de valores con nombre (días de la semana).', 'variables'],
  ['Array', 'Colección de valores del mismo tipo bajo un nombre, a los que se accede por posición desde 0.', 'variables'],
  ['Constante', 'Valor con nombre que no puede cambiar durante la ejecución. Se declara con const.', 'constantes'],
  ['Literal', 'Valor escrito tal cual en el código: 10, 3.5, "Hola", true.', 'constantes'],
  ['Secuencia de escape', 'Barra invertida más un carácter que representa algo especial: \\n, \\t, \\".', 'constantes'],
  ['Operador', 'Símbolo que realiza una operación: + - * / % == && …', 'operadores'],
  ['Módulo (%)', 'Operador que devuelve el resto de una división entera.', 'operadores'],
  ['División entera', 'División entre dos int: descarta los decimales. 7 / 2 da 3.', 'operadores'],
  ['Cortocircuito', '&& y || dejan de evaluar en cuanto el resultado ya está decidido.', 'operadores'],
  ['Precedencia', 'Orden en que se evalúan los operadores de una expresión.', 'operadores'],
  ['Conversión implícita', 'La que C# hace sola porque el valor cabe sin pérdida (int → long).', 'conversiones'],
  ['Casting', 'Conversión explícita con el tipo entre paréntesis: (int)3.9. Puede perder datos.', 'conversiones'],
  ['Parse', 'Convierte texto en número. Si el texto no es válido, lanza una excepción.', 'conversiones'],
  ['TryParse', 'Intenta convertir texto en número y devuelve true o false, sin lanzar excepciones. El resultado sale por out.', 'conversiones'],
  ['Interpolación', 'Insertar variables en un texto con $"…{variable}…".', 'conversiones'],
  ['Condición', 'Expresión que da true o false y decide qué rama se ejecuta.', 'decisiones'],
  ['if / else', 'Estructura de selección: ejecuta un bloque si se cumple la condición y, opcionalmente, otro si no.', 'decisiones'],
  ['switch', 'Selección múltiple según el valor exacto de una variable, con case, break y default.', 'decisiones'],
  ['Bucle', 'Estructura que repite un bloque mientras se cumpla una condición.', 'bucles'],
  ['Iteración', 'Cada vuelta de un bucle.', 'bucles'],
  ['Contador', 'Variable que cuenta vueltas o sucesos (contador++).', 'bucles'],
  ['Acumulador', 'Variable que va sumando valores en cada vuelta (total += precio).', 'bucles'],
  ['Bucle infinito', 'Bucle cuya condición nunca llega a ser false. El programa se queda colgado.', 'bucles'],
  ['break / continue', 'break sale del bucle; continue salta a la siguiente vuelta.', 'bucles'],
  ['Excepción', 'Error en tiempo de ejecución que, si nadie lo captura, detiene el programa.', 'errores'],
  ['try-catch', 'Estructura que intenta un bloque y, si se lanza una excepción, ejecuta el catch en vez de romperse.', 'errores'],
  ['Error de compilación', 'Error de sintaxis o de tipos. El programa no llega a ejecutarse.', 'errores'],
  ['Error lógico', 'El programa funciona, pero da un resultado incorrecto.', 'errores'],
  ['Depurador', 'Herramienta para ejecutar paso a paso y ver el valor de las variables (F9, F5, F10).', 'errores'],
  ['Punto de interrupción', 'Marca en una línea donde el depurador detiene la ejecución.', 'errores'],
  ['Caja blanca / caja negra', 'Pruebas mirando el código por dentro / probando solo entradas y salidas.', 'errores'],
  ['Amortización', 'Devolución progresiva de un préstamo. En el sistema francés, con cuota fija.', 'reto1'],
];

export function Glosario() {
  const [q, setQ] = useState('');
  const lista = useMemo(() => {
    const n = q.trim().toLocaleLowerCase('es-ES').normalize('NFD').replace(/\p{M}/gu, '');
    const norm = (s: string) => s.toLocaleLowerCase('es-ES').normalize('NFD').replace(/\p{M}/gu, '');
    return TERMINOS.filter(([t, d]) => !n || norm(t).includes(n) || norm(d).includes(n)).sort((a, b) => a[0].localeCompare(b[0], 'es'));
  }, [q]);
  return (
    <div className="pagina">
      <h1>Glosario</h1>
      <p>Los {TERMINOS.length} términos de la Unidad 1, explicados en una frase y enlazados a la lámina donde se trabajan.</p>
      <div style={{ maxWidth: 420, marginTop: 24 }}>
        <TextInput label="Buscar un término" type="search" value={q} onChange={setQ} placeholder="variable, bucle, TryParse…" isLabelHidden />
      </div>
      <dl className="glos" aria-live="polite">
        {lista.length === 0 && <p style={{ color: 'var(--t8)', display: 'flex', gap: 8, alignItems: 'center' }}><Icon icon={IcoLupa} size="sm" /> Nada con «{q}». Prueba con otra palabra.</p>}
        {lista.map(([t, d, l]) => {
          const m = LAMINAS.find((x) => x.id === l)!;
          return (
            <div key={t} className="glos-fila" data-familia={m.familia}>
              <dt>{t}</dt>
              <dd>{d} <a href={enlace(l)}>Lámina {m.num}</a></dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
