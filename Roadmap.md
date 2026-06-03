# Roadmap — QGEM Studio

Hoja de ruta general de **TvPeru-QGEM-Studio**. Las fases ya cerradas quedan abajo
como histórico; el detalle del trabajo pendiente del día a día vive en
`docs/pendientes.md`.

## Estado actual

- ✅ **Fase 0 y 1 — Base estructural y colectores.** Los 12 colectores están creados
  sobre la arquitectura común (`page.tsx` ligero + componentes compartidos +
  `FileActions`). El contrato JSON con el cliente Unity está en uso.
- ✅ **Fase 2 — Validaciones previas a la exportación.** Motor en
  `@/helpers/validation.ts`, diálogo de bloqueo `ValidationDialog`, _gate_
  centralizado en `FileActions` (prop `validate`) y reglas estándar (campo/imagen
  requeridos, mínimos, etc.). Cobertura por colector en `docs/shared-features.md`.
- 🚧 **Fase 3 — Infraestructura y refinamiento.** En curso. La migración del header
  al `layout.tsx` global (vía `useWorkspaceHeader` store) ya está hecha. Quedan la
  barra lateral, la consistencia visual y la documentación de schemas → ver
  `docs/pendientes.md`.

## Pendientes

Todo el trabajo pendiente —tareas, ideas y deuda técnica— se gestiona en:

- **`docs/pendientes.md`** — lista viva de tareas e ideas por definir.
- **`docs/technical-debt.md`** — registro de deuda técnica con prioridad.
- **`docs/shared-features.md`** — estado de los 3 sistemas compartidos por colector.

## Notas y buenas prácticas

1. **Simplicidad**: seguir omitiendo bases de datos o autenticación; el proyecto es
   estrictamente una herramienta de exportación en red local/cerrada.
2. **Nomenclatura consistente**: usar siempre "QGEM Studio" o "TvPeru-QGEM-Studio",
   nunca el antiguo nombre (AppCenter).
3. **Manejo de imágenes**: las URLs efímeras (ObjectURLs) requieren atención;
   mantener `skipCleanupOnUnmount` en `use-image-picker` cuando sea necesario para
   prevenir su expiración (caso "Intruso").
