# Funcionalidades compartidas

Documento de referencia de los 3 sistemas reutilizables del proyecto. Sirve para
saber qué hace cada uno, dónde encontrarlo y qué colectores lo implementan o les
falta implementarlo.

> Nota: los colectores **De par en par** y **Busca Logo** tienen una UI propia
> (tableros / grillas de posición fija), por lo que quedan al margen de varias de
> estas funcionalidades por diseño, no por omisión.

---

## 1. Sistema de recorte de imágenes (Crop)

Permite que, al subir una imagen, el usuario seleccione (con zoom y arrastre) la
porción a conservar, respetando un _aspect ratio_ fijo. Es **opt-in**: basta con
pasar la prop `crop={{ x, y }}` al `ImagePicker`; si no se pasa, el picker funciona
sin recorte. Toda la infraestructura pesada (modal, canvas, manejo de ObjectURLs)
es compartida.

**Cómo se activa:** `<ImagePicker crop={{ x: 3, y: 4 }} ... />` (ratio = x/y).

### Archivos

- `src/components/shared/ImagePicker.tsx` — punto de entrada; `isCropEnabled = !!crop`.
- `src/components/shared/ImageCropperDialog.tsx` — modal de recorte (react-easy-crop).
- `src/hooks/use-image-picker.ts` — estado del input, ObjectURLs, flujo uncropped→crop, `commitCrop`.
- `src/lib/cropImage.ts` — `getCroppedImg()` recorta vía canvas y devuelve un Blob.

### Estado por colector

| Colector             | Estado                                                                   |
| -------------------- | ------------------------------------------------------------------------ |
| **Intruso**          | ✅ Implementado (Nivel 1: 21:9, Nivel 2: 3:4)                            |
| **Album**            | ⬜ Sin crop — se probó 3:4 y se descartó ("queda mal"); usa imagen libre |
| **Galería de Fotos** | 🚫 Sin crop por decisión — se podría aplicar, pero no se quiere recorte aquí (las fotos van libres) |
| **De par en par**    | ⬜ Falta — maneja imágenes en las cartas; posible candidato              |

**No aplica** (no manejan imágenes): Mi Libro Favorito, Deletreo, Cálculo Mental,
Reto Cruzado, Operaciones Combinadas, La Sabes o No, Si o No, Busca Logo.

---

## 2. Sistema de aviso de campos vacíos (Validación)

Antes de guardar, ejecuta una función `validate()` propia del colector que devuelve
una lista de problemas (`ValidationIssue[]`). Si hay alguno, un diálogo **bloquea el
guardado** e indica la posición exacta de cada campo faltante (ej.
`Grupo 1 · Fila 3 · Enunciado`). Incluye un botón secundario **"Guardar de todos
modos"** para forzar el guardado. Es **opt-in**: el colector solo necesita pasar
`validate` al `setHeader`; los que no lo pasan guardan sin validación.

**Cómo se activa:** definir un `validate` (con `isBlank` / `formatPath`) y pasarlo en
`setHeader({ ..., validate })`.

### Archivos

- `src/helpers/validation.ts` — tipos y utilidades (`ValidationIssue`, `isBlank`, `formatPath`).
- `src/components/shared/ValidationDialog.tsx` — diálogo de bloqueo + "Guardar de todos modos".
- `src/components/shared/FileActions.tsx` — _gate_ centralizado: corre `validate()` antes de `onSave`.
- `src/hooks/use-workspace-header.ts` — expone el campo opcional `validate`.
- `src/components/shared/WorkspaceHeader.tsx` — pasa `validate` del store a `FileActions`.

### Estado por colector

| Colector                   | Estado                                              |
| -------------------------- | --------------------------------------------------- |
| **Si o No**                | ✅ Implementado (enunciado + selección Sí/No)       |
| **La Sabes o No**          | ✅ Implementado (enunciado + 2 respuestas)          |
| **Cálculo Mental**         | ✅ Implementado (enunciado + respuesta por casilla) |
| **Album**                  | ✅ Implementado (pregunta + imagen por carta)       |
| **Mi Libro Favorito**      | ✅ Implementado (nombre de jugador + enunciado + respuesta) |
| **Deletreo**               | ✅ Implementado (palabra por casilla)               |
| **Reto Cruzado**           | 🚫 Sin validación por decisión — se podría, pero no se quiere aquí |
| **Operaciones Combinadas** | ✅ Implementado (operación vacía / sin colocar + tablero sin operaciones) |
| **Galería de Fotos**       | ✅ Implementado (imagen por foto)                   |
| **Intruso**                | ✅ Implementado (solo Nivel 1: imagen + opciones + intruso marcado) |
| **De par en par**          | ✅ Implementado (cada carta con el contenido de su modo: texto/imagen/ambos) |
| **Busca Logo**             | ✅ Implementado (cada tablero con al menos un logo marcado) |

---

## 3. Sistema "Lego" (estructura de columnas/filas)

Es el esqueleto visual reutilizable para los colectores tipo lista: un contenedor
horizontal de **columnas (grupos)**, cada una con su **título**, su área de **filas**
con scroll, un pie con **llenado rápido** (pegar desde Excel) y botones para
agregar/eliminar grupos y filas. Se "arma como Lego" combinando estas piezas.

**Cómo se activa:** componer `GroupsContainer > GroupColumn > (TitleInput +
RowsContainer + GroupFooter[QuickLoad])`, normalmente apoyado en el hook
`use-workspace-groups`.

### Archivos

- `src/components/shared/group-column/layout/GroupsContainer.tsx` — fila horizontal de grupos + botón "agregar grupo".
- `src/components/shared/group-column/layout/GroupColumn.tsx` — columna individual (cabecera, índice, capacidad, eliminar).
- `src/components/shared/group-column/layout/GroupFooter.tsx` — pie de la columna.
- `src/components/shared/group-column/components/RowsContainer.tsx` — área de filas con `ScrollArea`.
- `src/components/shared/group-column/components/QuickLoad.tsx` — llenado rápido (paste de Excel → matriz).
- `src/components/shared/group-column/components/TitleInput.tsx` — input de título del grupo.
- `src/components/shared/group-column/components/DescriptionInput.tsx` — input de descripción opcional.
- `src/components/shared/group-column/components/AddColumnButton.tsx` / `AddRowButton.tsx` — botones de alta.
- `src/hooks/use-workspace-groups.ts` — estado genérico de grupos/ítems (add/remove/update/replace).

### Estado por colector

| Colector                   | Estado                                                |
| -------------------------- | ----------------------------------------------------- |
| **Mi Libro Favorito**      | ✅ Implementado                                       |
| **Deletreo**               | ✅ Implementado                                       |
| **Cálculo Mental**         | ✅ Implementado                                       |
| **Intruso**                | ✅ Implementado                                       |
| **Album**                  | ✅ Implementado                                       |
| **Reto Cruzado**           | ✅ Implementado (con componentes locales adicionales) |
| **Operaciones Combinadas** | ✅ Implementado                                       |
| **La Sabes o No**          | ✅ Implementado                                       |
| **Galería de Fotos**       | ✅ Implementado                                       |
| **Si o No**                | ✅ Implementado                                       |

**No aplica** (UI propia de tablero/grilla, no encaja en el paradigma columna/fila):
De par en par, Busca Logo.

---

## Resumen rápido

| Colector               | Crop | Validación | Lego |
| ---------------------- | :--: | :--------: | :--: |
| Mi Libro Favorito      |  —   |     ✅     |  ✅  |
| Deletreo               |  —   |     ✅     |  ✅  |
| Cálculo Mental         |  —   |     ✅     |  ✅  |
| Intruso                |  ✅  |     ✅     |  ✅  |
| Album                  |  ⬜  |     ✅     |  ✅  |
| Reto Cruzado           |  —   |     🚫     |  ✅  |
| De par en par          |  ⬜  |     ✅     |  —   |
| Operaciones Combinadas |  —   |     ✅     |  ✅  |
| La Sabes o No          |  —   |     ✅     |  ✅  |
| Galería de Fotos       |  🚫  |     ✅     |  ✅  |
| Busca Logo             |  —   |     ✅     |  —   |
| Si o No                |  —   |     ✅     |  ✅  |

Leyenda: ✅ implementado · ⬜ falta (aplicable) · 🚫 no se usa por decisión
(aplicable, pero no se quiere) · — no aplica por diseño (estructural).
