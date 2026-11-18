# Reto 01 · IVA y financiación

Aplicación de consola en C# para calcular el precio con IVA y, a partir de 500 euros con IVA, ofrecer financiación a 3, 6 o 12 meses. Calcula la cuota y la tabla de amortización francesa, con una rama sin intereses y ajuste final del saldo.

## Requisitos

- SDK .NET 10, porque el proyecto usa `net10.0`.
- Terminal (por ejemplo, el de VS Code).

## Ejecutar

Desde esta carpeta:

```bash
dotnet run --project PrimerCSharp..csproj
```

El nombre del archivo de proyecto conserva el original del ejercicio, incluidos sus dos puntos antes de `csproj`.

## Uso

1. Introduce el usuario de prueba `Usuario1` y la contraseña ficticia `1234`.
2. Introduce un precio sin IVA mayor que cero.
3. Selecciona IVA general (1), reducido (2) o superreducido (3).
4. Para importes con IVA desde 500 euros, responde `s` para financiar o `n` para pagar al contado.
5. Introduce 3, 6 o 12 meses y el interés nominal anual en porcentaje: por ejemplo, `8` significa 8 %.

Los decimales siguen la configuración regional del equipo. El usuario de prueba distingue mayúsculas y minúsculas. Las respuestas de sí/no aceptan `s`, `S`, `n` y `N`; otras respuestas se vuelven a solicitar.

## Validaciones incluidas

Se repiten las entradas incorrectas de sí/no, IVA, precio, meses e interés. Los meses deben ser 3, 6 o 12; el interés debe ser finito y mayor o igual a cero. Las conversiones de meses e interés manejan errores de formato y desbordamiento.

## Conceptos practicados

Constantes, variables `double`, `int` y `string`, conversiones, condicionales, `switch`, bucles, excepciones, `Math.Pow` y salida formateada.

## Limitaciones de esta versión

El código se conserva tal como fue guardado por el autor, sin reescribirlo durante la preparación del repositorio.

- El precio base aún no rechaza expresamente valores no finitos; cantidades extremas pueden producir resultados no válidos.
- Las tasas extremadamente pequeñas o grandes pueden causar pérdida de precisión o desbordamientos en la fórmula.
- La autenticación es una simulación con datos de prueba, no un sistema seguro para uso real.
- El fin de entrada de consola no tiene una salida específica y puede provocar repeticiones.
- La compilación mantiene cinco advertencias CS8600 por lecturas de consola potencialmente nulas.
- El separador decimal depende de la configuración regional: usa el que corresponda a tu equipo.
- Las columnas usan tabulaciones; pueden desalinearse con importes muy largos.

No presentar esta versión como completamente validada frente a todas las entradas inválidas. No es una herramienta de asesoramiento financiero.
