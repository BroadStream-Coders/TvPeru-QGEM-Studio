# Changelog

Registro permanente de todo el trabajo terminado. Indexado por código de tarea
(`TD-`, `RM-`, `WL-`). Orden inverso: lo más nuevo arriba.

**Formato de cada entrada:**

```
## [CÓDIGO] Título (YYYY-MM-DD HH:MM)
Resumen en ≤2 líneas de lo que se hizo.
```

---

## [RM-018] Colector "Si o No" renombrado a "Al Vuelo" (2026-08-12 09:03)
Cambio de nombre del juego: carpeta y ruta `si-o-no` → `al-vuelo`, título del header y entrada del home. El nombre del JSON exportado sigue siendo `SiONo.json` (contrato con Unity/storage).

## [RM-015] Colector Cronos (línea de tiempo) (2026-08-04 09:41)
Nuevo workspace `cronos` con estructura columns/rows: columnas de 5 eventos fijos, cada evento con fecha y título (inputs) e imagen con recorte cuadrado; export/import ZIP, validación, carga rápida (lógica provisional) y entrada en el home.

## [RM-006] Acceso "producción" gestionado en Supabase (2026-07-15)
Tabla `production_access` (allowlist a mano en el dashboard) + `has_production_access()` usada por las policies y ahora también por la app: `use-auth` la consulta por RPC y `FileActions` oculta las opciones de storage a cuentas logueadas sin acceso.

## [RM-010] Storage de Supabase (subir / bajar datos) (2026-07-15)
Bucket privado `data` (carpetas `oficial/` y `ejemplo/`) con policies por allowlist (`production_access`). Split buttons en `FileActions` (Guardar→subir, Cargar→bajar, con confirmaciones) para los 8 colectores JSON; los ZIP quedan en RM-014.

## [RM-005] Login con Google (Supabase Auth) (2026-07-15)
`AuthButton` + `use-auth` (portados de Games, adaptados a tokens shadcn) en home y WorkspaceHeader: sesión con Google, avatar con dropdown y cierre de sesión.

## [TD-003] Galería de Fotos migrada al patrón store de header (2026-06-03)
Galería pasó a `setHeader` con `validate` y se eliminó `WorkspaceShell`. Patrón único de header (store) en todo el proyecto.

## [histórico] Fundaciones del proyecto (previo al sistema de códigos) (2026-06-01)
12 colectores creados sobre la arquitectura común; motor de validación previo a exportar (`ValidationDialog` + gate en `FileActions`); sistema de recorte de imágenes opt-in; sistema "Lego" de columnas/filas; migración del header al `layout.tsx` global (patrón store).
