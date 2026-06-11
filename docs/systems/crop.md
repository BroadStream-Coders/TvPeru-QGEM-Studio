# Sistema de recorte de imágenes (Crop)

Permite que, al subir una imagen, el usuario seleccione (con zoom y arrastre) la
porción a conservar, respetando un _aspect ratio_ fijo. Es **opt-in**: basta con
pasar la prop `crop={{ x, y }}` al `ImagePicker`; si no se pasa, el picker funciona
sin recorte. Toda la infraestructura pesada (modal, canvas, manejo de ObjectURLs)
es compartida.

## Cómo se activa

```tsx
<ImagePicker crop={{ x: 3, y: 4 }} ... />  // ratio = x / y
```

Sin la prop `crop`, el `ImagePicker` sube la imagen tal cual (sin recorte).

## Archivos

- `src/components/shared/ImagePicker.tsx` — punto de entrada; `isCropEnabled = !!crop`.
- `src/components/shared/ImageCropperDialog.tsx` — modal de recorte (react-easy-crop).
- `src/hooks/use-image-picker.ts` — estado del input, ObjectURLs, flujo uncropped→crop, `commitCrop`.
- `src/lib/cropImage.ts` — `getCroppedImg()` recorta vía canvas y devuelve un Blob.

## Manejo de ObjectURLs

Las imágenes se referencian con URLs efímeras (ObjectURLs) que pueden expirar al
desmontar. Cuando una imagen debe sobrevivir al desmontaje del componente (caso
"Intruso"), mantener `skipCleanupOnUnmount` en `use-image-picker` para evitar que
la URL se libere antes de tiempo.
