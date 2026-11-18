# Guías de estudio DAM

Cada carpeta contiene el código editable de una asignatura. GitHub Pages publica los archivos estáticos de `main:/docs`.

## Actualizar una guía

Con Node.js 24, entra en la carpeta de la asignatura. Este ejemplo actualiza Programación.

```bash
cd guias/programacion
npm ci --ignore-scripts
node --test 'src/**/*.test.ts'
npm run build -- --base ./ --outDir ../../docs/programacion --emptyOutDir
```

Las láminas se editan en `src/laminas/` y se registran en `src/laminas/index.ts`. Usa la carpeta equivalente en el comando para Sistemas informáticos o Bases de datos.

Para previsualizar las tres guías juntas, ejecuta `python3 -m http.server --directory docs` desde la raíz del repositorio y abre http://localhost:8000. Revisa los cambios en el código y en la compilación antes de subirlos. Al publicar en `main`, Pages actualizará el sitio. Los enlaces de las guías deben conservar su ruta para que sigan funcionando al compartirlos.

Para añadir una asignatura, crea su carpeta en `guias/`, compílala en la carpeta correspondiente de `docs/` y añade su enlace a `docs/index.html`.
