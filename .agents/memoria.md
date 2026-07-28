# Memoria — Bitácora del agente

> Anota aquí lo que **aprendes** sobre el proyecto a lo largo de las sesiones: descubrimientos, decisiones, excepciones, errores recurrentes.

## Persistencia

`.agents/` está en `.gitignore` (línea `# Agents internal logs`). Esto significa:

- **NO se commitea** — no compartirás datos de sesión accidentalmente.
- **Se borra con `git clean -fdX`** o al clonar limpio del repo.
- **Trátalo como RAM de sesión**, no como disco: decisiones durables deben **promoverse** a `AGENTS.md` o `arquitectura.md`.

## Cómo usar este fichero

- Al final de cada sesión relevante, añade una entrada fechada con el formato `### YYYY-MM-DD — Título corto`.
- Cada entrada incluye:
  - **Tipo**: bug/footgun · patrón · hallazgo experimental · decisión · anti-patrón · duda abierta.
  - **Hallazgo**: la observación concreta, corta y verificable.
  - **Por qué importa**: qué decisión habilita / qué bug previene / qué hace más eficiente.
  - **Fuente**: ruta exacta del archivo o contexto (p. ej. `useBreathingTimer.ts:35-62`).
- Si un hallazgo contradice `AGENTS.md` o `arquitectura.md`, deja claro aquí el delta y actualiza el doc padre si procede (preferentemente antes de cerrar la sesión).
- Si el hallazgo es **durable** (contrato, footgun, convención), extráelo de aquí a `AGENTS.md` o `arquitectura.md` y deja aquí un puntero con la fecha de promoción.

## Tipos de entrada

- **Bug / Footgun**: trampa concreta del código. Candidato fuerte a `AGENTS.md`.
- **Patrón**: convención implícita con código concreto que la respalda.
- **Hallazgo experimental**: hipótesis o resultado de prueba que merece verificación.
- **Decisión**: cambio aceptado que afecta comportamiento futuro.
- **Anti-patrón**: algo en el código que NO debe replicarse.
- **Duda abierta**: pregunta sin resolver que conviene retomar.

## Plantilla de entrada

Copia este bloque y rellénalo:

```
### <YYYY-MM-DD> — Título corto
- **Tipo**: bug/footgun
- **Hallazgo**: la observación concreta (línea / archivo / comportamiento).
- **Por qué importa**: qué decisión habilita o qué bug previene.
- **Fuente**: ruta/líneas o contexto.
- **Acción sugerida** (opcional): promote a AGENTS.md / arquitectura.md / seguimiento.
```

## Entradas

*(Empieza aquí — la primera entrada suele ser la del primer descubrimiento interesante de la sesión.)*
