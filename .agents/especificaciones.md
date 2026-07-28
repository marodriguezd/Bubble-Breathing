# Especificaciones — Índice

> Tabla de contenidos de todos los documentos tipo **especificación / fuente-de-verdad** del proyecto. Si creas un nuevo doc con intención normativa, enlázalo aquí. Si nace un doc que **contradice** a otro, decide cuál manda.

## Documentos vigentes

| Doc | Rol | Alcance | Mantenido por |
|---|---|---|---|
| [`especificacion.md`](./especificacion.md) | **espejo de producto** | qué hace la app, qué variables acepta, comportamiento esperado. Out-of-scope y known issues. | humano |
| [`arquitectura.md`](./arquitectura.md) | **espejo técnico quick-ref** | constantes clave (versiones, sentinels, contratos audio). La prosa vive en `AGENTS.md` §4. | humano + IA |
| [`AGENTS.md`](../AGENTS.md) | **fuente-de-verdad IA** | reglas, footguns, cómo añadir componentes, qué EVITAR. | humano + IA |
| [`PROJECT.md`](../PROJECT.md) | **fuente-de-verdad roadmap** | milestones (M1–M4), features documentadas (Last Breath, Per-Minute Cue). | humano |
| [`README.md`](../README.md) | **fuente-de-verdad público** | descripción, features de cara al usuario, instalación, stack, licencia. | humano |
| [`memoria.md`](./memoria.md) | bitácora de aprendizaje | hallazgos de sesión: bugs, patrones, decisiones, anti-patrones. Append-only. | IA (agentes) |
| [`progreso.md`](./progreso.md) | scratchpad de tareas | in‑progress / completed / pending. Entre sesiones. | IA (agentes) |

**Glosario de roles**: *espejo* = un agente local mantiene este doc en `.agents/` (RAM de sesión, gitignored). *fuente-de-verdad* = vive en el repo, se commitea, sirve como contrato para todos.

## Convenciones de actualización

1. **Espejos que divergen** — si un cambio toca dos docs (p. ej. arquitectura + spec), edita ambos y pon referencia cruzada.
2. **Fuente de verdad por pregunta**:
   - ¿Qué hace la app? → `especificacion.md`.
   - ¿Cómo está hecha? → `AGENTS.md` §4 (prosa) y `arquitectura.md` (constantes).
   - ¿Qué reglas sigo como IA? → `AGENTS.md`.
   - ¿Qué features hay con timeline? → `PROJECT.md`.
   - ¿Qué descubrí / aprendí? → `memoria.md`.
   - ¿En qué estoy trabajando? → `progreso.md`.
3. **Doc nuevo** → añádelo aquí con su rol y scope.
4. **Doc obsoleto** → NO lo borres; márcalo como `OBSOLETE` con fecha de deprecation y reemplazo.

## Contratos cross-doc (vigentes y vinculantes)

Los siguientes aparecen en múltiples documentos. Si los cambias, cambia **todos**:

- **Wim Hof ratio (65/35)**: `arquitectura.md` → `especificacion.md` → git log.
- **Sentinel `rounds === 11`**: `arquitectura.md` → `AGENTS.md` §6.
- **Subfases inconsistentes**: `arquitectura.md` → `AGENTS.md` §4.2 → `PROJECT.md` (interfaz prevista).
- **CSS legacy duplication**: `arquitectura.md` → `AGENTS.md` §4.5 / §6.
- **`defaultValue` no es fallback real** en i18n: `arquitectura.md` → `AGENTS.md` §4.4.
- **Vibración sin gate de volume**: `arquitectura.md` → `AGENTS.md` §4.7 → `PROJECT.md` (Per-Minute Cue).

## Cambios recientes al índice

- **2026-07-28** — `OPENCODE.md` renombrado a `AGENTS.md` (compatibilidad Cursor / Aider / Claude Code).
- **2026-07-28** — Directorio `.agents/` creado con la triada (`arquitectura`, `especificacion`, `especificaciones`) + `memoria` + `progreso`.
- **2026-07-28** — `AGENTS.md` consolidado como guía raíz con referencia explícita al directorio `.agents/`.

## Cómo se descubre un nuevo contrato

1. Anótalo en `memoria.md` durante la sesión.
2. Si es **durable**, promueve a `AGENTS.md` o `arquitectura.md` y enlázalo aquí como contrato cross-doc.
3. Si cambia comportamiento de producto, también a `especificacion.md`.
4. Si cambia contrato de interfaz entre componentes, también a `PROJECT.md`.
5. Vuelve aquí y actualiza la tabla o lista de contratos.
