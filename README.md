# RETOS · PROGRAMACIÓN DAM

> Aprender, entender y construir. Un reto, un proyecto, un paso más.

Repositorio de **Synji · Digital Synapse** para compartir mi aprendizaje de programación: aplicaciones propias, código comentado y proyectos ejecutables para explorar con compañeros y comunidad.

**C#** · **.NET 10** · **Consola** · **Aprendizaje práctico**

[Explorar el reto 01](reto-01-iva-financiacion/README.md) · [Ver el código](reto-01-iva-financiacion/Program.cs) · [Cómo actualizar el repositorio](SUBIR_A_GITHUB.md)

---

[Abrir el cuaderno de estudio DAM](https://splurtch.github.io/retos_programacion_dam/) · [Cómo actualizar las guías](guias/README.md)

## 01 / Catálogo de retos

| Reto | Qué construye | Qué se practica | Estado |
|---|---|---|---|
| **[01 · IVA y financiación](reto-01-iva-financiacion/README.md)** | Calculadora de IVA y tabla de amortización francesa | Entradas, validación, condicionales, bucles y excepciones | Entregado · versión de aprendizaje |

Cada nuevo reto tendrá su propia carpeta y README. Así se puede ejecutar y compartir de forma independiente sin mezclar proyectos.

---

## 02 / Dentro del primer reto

**Del precio base a la última cuota.** Una aplicación de consola que calcula el IVA, permite pagar al contado o financiar desde 500 € con IVA y muestra el detalle de cada mensualidad.

| Entrada | Proceso | Resultado |
|---|---|---|
| Precio sin IVA y tipo de IVA | General, reducido o superreducido | Precio final con IVA |
| 3, 6 o 12 meses y tipo de interés | Amortización francesa o financiación al 0 % | Cuota, intereses, amortización y saldo |
| Respuestas y datos incorrectos | Validación y repetición de entradas | Flujo guiado en consola |

**Acceso didáctico:** usuario `Usuario1`, contraseña ficticia `1234`. No son credenciales de ninguna cuenta real ni un modelo de autenticación para producción.

---

## 03 / Ejecutarlo en tu equipo

Necesitas el **SDK de .NET 10** y una terminal.

```bash
git clone https://github.com/Splurtch/retos_programacion_dam.git
cd retos_programacion_dam
dotnet run --project reto-01-iva-financiacion/PrimerCSharp..csproj
```

El nombre del `.csproj` mantiene los dos puntos del proyecto original. Consulta [uso y limitaciones del reto](reto-01-iva-financiacion/README.md) antes de probarlo.

---

## 04 / Organización

```text
retos_programacion_dam/
├── README.md                         # Portada e índice
├── .gitignore                        # Generados y archivos privados fuera de Git
├── .editorconfig                     # Convenciones básicas de edición
├── SUBIR_A_GITHUB.md                  # Guía de actualizaciones
└── reto-01-iva-financiacion/
    ├── README.md                     # Uso, requisitos y limitaciones
    ├── Program.cs                    # Código del reto entregado
    └── PrimerCSharp..csproj           # Proyecto ejecutable
```

---

## 05 / Alcance y aprendizaje

- **Código propio:** no se publican temarios, enunciados, documentos privados ni material docente del centro.
- **Versión entregada:** el código se conserva sin reescribir su lógica al preparar este repositorio.
- **Transparencia:** compila sin errores, con cinco advertencias de nulabilidad. Las limitaciones de entradas extremas y configuración regional están documentadas en el reto.
- **Propósito educativo:** no es una herramienta financiera ni de autenticación para uso real.
- **Reutilización:** no se ha añadido una licencia por defecto. Compartir públicamente no concede automáticamente permisos adicionales de reutilización.

Este repositorio complementa el aprendizaje y no sustituye la entrega oficial en el campus.
