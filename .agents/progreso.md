# Progreso — Estado de tareas

> Bitácora de **trabajo en curso**, **completado** y **pendiente**. Úsalo como scratchpad entre sesiones para no perder el hilo.

## Persistencia

`.agents/` está en `.gitignore` — esta lista es **tu** lista, no se comparte con otros colaboradores vía git. Para tareas que importan al equipo, extráelas a issues / PRs de GitHub.

## Cómo usar este fichero

- Mueve tareas entre secciones a medida que avanzan.
- Tarea **completada**: añade fecha, archivos tocados, cómo la validaste y commit hash si aplica.
- Tarea **bloqueada**: anota qué falta para desbloquearla (input externo, decisión, otra tarea previa).
- Si una tarea se vuelve **durable** (cambia convención, contrato, etc.), extráela a `AGENTS.md` o `arquitectura.md` y deja el puntero aquí.

## Plantillas

### En curso

```
### [YYYY-MM-DD] Tarea
- **Estado**: en curso / bloqueado / pausado
- **Tamaño**: rápida (<30 min) / media / grande
- **Siguiente paso**: acción concreta
- **Bloqueos**: (si aplica) qué falta
- **Notas**: contexto / cosas que recordar
```

### Completado

```
### [YYYY-MM-DD] Tarea
- **Qué se hizo**: resumen de 1 línea
- **Archivos tocados**: rutas
- **Validación**: lint / build / browser / manual / N/A
- **Commit**: hash corto o "no commiteado"
```

### Pendiente

```
- [ ] Tarea — descripción corta (prioridad: alta/media/baja; estimación: ~X min)
- [ ] Tarea — descripción corta (prioridad: ...)
```

## En curso

*(vacío)*

## Completado

*(vacío)*

## Pendiente / backlog

*(vacío)*

## Convenciones de tarea (resumen)

Las reglas detalladas viven en `AGENTS.md` §5 *"EVITAR"* y *"Antes de hacer un commit"*. Aquí solo el TL;DR:

- **Validar antes de cerrar**: `npm run lint`, `npm run build`, y manual o browser cuando aplique (`npx tsc -b` como typecheck rápido).
- Marca tareas de duración **< 30 min** como `rápida` en el título.
- Tocar `Contexts` / máquina de fases: **doble check** antes de cerrar.
- Tocar i18n: **traducir los 7 idiomas** antes de cerrar.
- Tocar CSS: verificar también `css/style.css` (legacy) y sincronizar si hay drift grave.
- Añadir dependencias nuevas: justificar contra `AGENTS.md` §5 "EVITAR".
- Tocar `localStorage`: backward compat con datos existentes o migrar.

## Cómo cerrar una tarea

1. Mueve la entrada de "En curso" a "Completado" con fecha y commit.
2. Si cambiaste convención → promueve a `AGENTS.md` o `arquitectura.md` (y enlaza aquí la promoción). Si la promoción crea un contrato cross-doc nuevo, regístralo en `especificaciones.md`.
3. Si descubriste un footgun / anti-patrón → entrada correspondiente en `memoria.md`.
4. Limpia "En curso" si queda vacío al final de la sesión (cosmético).
