# Changelog

Registro permanente de todo el trabajo terminado. Indexado por código de tarea
(`TD-`, `RM-`, `WL-`). Orden inverso: lo más nuevo arriba.

**Formato de cada entrada:**

```
## YYYY-MM-DD — [CÓDIGO] Título
Resumen en ≤2 líneas de lo que se hizo.
```

---

## 2026-06-03 — [TD-003] Galería de Fotos migrada al patrón store de header
Galería pasó a `setHeader` con `validate` y se eliminó `WorkspaceShell`. Patrón único de header (store) en todo el proyecto.

## 2026-06-01 — [histórico] Fundaciones del proyecto (previo al sistema de códigos)
12 colectores creados sobre la arquitectura común; motor de validación previo a exportar (`ValidationDialog` + gate en `FileActions`); sistema de recorte de imágenes opt-in; sistema "Lego" de columnas/filas; migración del header al `layout.tsx` global (patrón store).
