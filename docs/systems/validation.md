# Sistema de validación previo a exportar

Antes de guardar, ejecuta una función `validate()` propia del colector que devuelve
una lista de problemas (`ValidationIssue[]`). Si hay alguno, un diálogo **bloquea el
guardado** e indica la posición exacta de cada campo faltante (ej.
`Grupo 1 · Fila 3 · Enunciado`). Incluye un botón secundario **"Guardar de todos
modos"** para forzar el guardado. Es **opt-in**: el colector solo necesita pasar
`validate` al `setHeader`; los que no lo pasan guardan sin validación.

## Cómo se activa

Definir un `validate` (apoyado en `isBlank` / `formatPath`) y pasarlo en el header:

```ts
setHeader({ ..., validate });
```

`validate()` devuelve `ValidationIssue[]` (cada uno con `path` y `message`); una
lista vacía significa "sin problemas, se puede guardar".

## Archivos

- `src/helpers/validation.ts` — tipos y utilidades (`ValidationIssue`, `isBlank`, `formatPath`).
- `src/components/shared/ValidationDialog.tsx` — diálogo de bloqueo + "Guardar de todos modos".
- `src/components/shared/FileActions.tsx` — _gate_ centralizado: corre `validate()` antes de `onSave`.
- `src/hooks/use-workspace-header.ts` — expone el campo opcional `validate`.
- `src/components/shared/WorkspaceHeader.tsx` — pasa `validate` del store a `FileActions`.
