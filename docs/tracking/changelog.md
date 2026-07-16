# Changelog

Registro permanente de todo el trabajo terminado. Indexado por código de tarea
(`TD-`, `RM-`, `WL-`). Orden inverso: lo más nuevo arriba.

**Formato de cada entrada:**

```
## YYYY-MM-DD — [CÓDIGO] Título
Resumen en ≤2 líneas de lo que se hizo.
```

---

## 2026-07-15 — [RM-006] Acceso "producción" gestionado en Supabase
Tabla `production_access` (allowlist a mano en el dashboard) + `has_production_access()` usada por las policies y ahora también por la app: `use-auth` la consulta por RPC y `FileActions` oculta las opciones de storage a cuentas logueadas sin acceso.

## 2026-07-15 — [RM-010] Storage de Supabase (subir / bajar datos)
Bucket privado `data` (carpetas `oficial/` y `ejemplo/`) con policies por allowlist (`production_access`). Split buttons en `FileActions` (Guardar→subir, Cargar→bajar, con confirmaciones) para los 8 colectores JSON; los ZIP quedan en RM-014.

## 2026-07-15 — [RM-005] Login con Google (Supabase Auth)
`AuthButton` + `use-auth` (portados de Games, adaptados a tokens shadcn) en home y WorkspaceHeader: sesión con Google, avatar con dropdown y cierre de sesión.

## 2026-06-03 — [TD-003] Galería de Fotos migrada al patrón store de header
Galería pasó a `setHeader` con `validate` y se eliminó `WorkspaceShell`. Patrón único de header (store) en todo el proyecto.

## 2026-06-01 — [histórico] Fundaciones del proyecto (previo al sistema de códigos)
12 colectores creados sobre la arquitectura común; motor de validación previo a exportar (`ValidationDialog` + gate en `FileActions`); sistema de recorte de imágenes opt-in; sistema "Lego" de columnas/filas; migración del header al `layout.tsx` global (patrón store).
