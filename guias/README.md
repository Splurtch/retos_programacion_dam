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

## Actualizar la portada

Edita el catálogo en `guias/programacion/src/Portada.tsx`. La portada usa la misma hoja de estilos y los mismos componentes que la guía de C#. Desde `guias/programacion`, con las dependencias instaladas, vuelve a compilarla así.

```bash
VITE_PORTADA=1 npm run build -- --base ./ --outDir ../../docs --assetsDir portada-assets
sed -i 's/Guía de campo de C# · 0485 Programación/Cuaderno de estudio DAM/' ../../docs/index.html
```

El comando conserva las carpetas de las guías. Revisa los archivos de `docs/portada-assets/` y retira los de compilaciones anteriores que la portada nueva ya no use.
