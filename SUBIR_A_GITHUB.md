# Publicar y actualizar

Repositorio remoto ya creado: https://github.com/Splurtch/retos_programacion_dam

La carpeta local usa la rama `main` y el remoto `origin`. Esta guía permite revisar y publicar futuras actualizaciones.

Antes de cada publicación, revisa las limitaciones del reto, confirma que solo incluyes código propio y no datos reales, y decide si quieres añadir una licencia.

Desde la raíz del repositorio:

```bash
git status
git add README.md SUBIR_A_GITHUB.md .gitignore .editorconfig reto-01-iva-financiacion
git diff --cached
git commit -m "Añade reto 1 de IVA y financiación"
git push -u origin main
```

Git pedirá autenticación si el equipo no la tiene preparada. No pegues contraseñas o tokens en archivos del proyecto. Para actualizaciones posteriores, revisa los cambios, crea otro commit y ejecuta `git push`.

Los archivos se copiaron del ejercicio original para mantenerlo intacto. Los cambios posteriores en el original no se sincronizan solos: copia la versión revisada a esta carpeta antes de confirmar cambios.
