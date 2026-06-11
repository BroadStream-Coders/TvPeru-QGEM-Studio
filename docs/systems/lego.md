# Sistema "Lego" (estructura de columnas/filas)

Es el esqueleto visual reutilizable para los colectores tipo lista: un contenedor
horizontal de **columnas (grupos)**, cada una con su **título**, su área de **filas**
con scroll, un pie con **llenado rápido** (pegar desde Excel) y botones para
agregar/eliminar grupos y filas. Se "arma como Lego" combinando estas piezas.

## Cómo se activa

Componer las piezas, normalmente apoyado en el hook `use-workspace-groups`:

```
GroupsContainer > GroupColumn > (TitleInput + RowsContainer + GroupFooter[QuickLoad])
```

## Archivos

- `src/components/shared/group-column/layout/GroupsContainer.tsx` — fila horizontal de grupos + botón "agregar grupo".
- `src/components/shared/group-column/layout/GroupColumn.tsx` — columna individual (cabecera, índice, capacidad, eliminar).
- `src/components/shared/group-column/layout/GroupFooter.tsx` — pie de la columna.
- `src/components/shared/group-column/components/RowsContainer.tsx` — área de filas con `ScrollArea`.
- `src/components/shared/group-column/components/QuickLoad.tsx` — llenado rápido (paste de Excel → matriz).
- `src/components/shared/group-column/components/TitleInput.tsx` — input de título del grupo.
- `src/components/shared/group-column/components/DescriptionInput.tsx` — input de descripción opcional.
- `src/components/shared/group-column/components/AddColumnButton.tsx` / `AddRowButton.tsx` — botones de alta.
- `src/hooks/use-workspace-groups.ts` — estado genérico de grupos/ítems (add/remove/update/replace).
