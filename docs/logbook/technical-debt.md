# Deuda Técnica

Registro de atajos, decisiones pendientes y riesgos a futuro de este proyecto.
Código `TD-###` (nunca se reutiliza). Al resolverse, la entrada se mueve al
changelog y se borra de aquí.

**Formato de cada entrada:**
- **Ubicación:** `archivo:línea` afectado.
- **Riesgo:** del 1 al 10 (1-3 cosmético · 4-6 ralentiza/moderado · 7-9 bug latente o seguridad · 10 crítico).
- **Problema:** qué está mal, sintetizado.
- **Impacto futuro:** qué puede causar si no se atiende.
- **Fecha** y **Estado** (Abierto / En progreso).

---

## [TD-001] La UI asume pantalla 1080p y viewport completo

- **Ubicación:** `src/app/workspaces/layout.tsx:9`
- **Riesgo:** 6/10
- **Problema:** El contenedor de workspaces usa `h-screen ... overflow-hidden` y reparte el alto entre header (48px), contenido y footer (36px) sin scroll de página. Todo el diseño está calibrado para 1920×1080 con el navegador a pantalla completa. En una laptop de 720p, o en 1080p con barra de favoritos / pestañas / barra de tareas reduciendo el alto útil, no hay válvula de escape: el contenido se recorta en vez de poder hacer scroll.
- **Impacto futuro:** En equipos de menor resolución (caso real de producción en laptops) se pierden filas, botones de guardar/cargar o el footer quedan inaccesibles. Difícil de diagnosticar porque no falla, solo "se ve mal" o se corta.
- **Fecha:** 2026-06-01 · **Estado:** Abierto

## [TD-002] Altura calculada con números mágicos en Galería de Fotos

- **Ubicación:** `src/app/workspaces/galeria-fotos/page.tsx:137`
- **Riesgo:** 5/10
- **Problema:** Usa `style={{ height: "calc(100vh - 48px - 36px)" }}`, restando a mano las alturas del header (48px) y footer (36px). Son números mágicos duplicados que además parten de `100vh` aunque ya vive dentro de un layout `h-screen`, ignorando el espacio realmente disponible.
- **Impacto futuro:** Si cambia la altura del header o del footer, este cálculo queda desfasado y el área se descuadra (scroll doble o contenido cortado). Frágil ante cualquier ajuste de chrome de la app.
- **Fecha:** 2026-06-01 · **Estado:** Abierto

## [TD-004] Alto fijo del recortador de imágenes

- **Ubicación:** `src/components/shared/ImageCropperDialog.tsx:75`
- **Riesgo:** 4/10
- **Problema:** El área de recorte es `h-[400px]` fija. Sumando padding del diálogo, título, slider de zoom y botones, el modal supera con holgura los ~648px de alto útil de una pantalla de 720p.
- **Impacto futuro:** En laptops de baja resolución el modal de recorte se sale de la pantalla y los botones Cancelar/Confirmar quedan fuera de vista, bloqueando el flujo de recorte (usado en Intruso).
- **Fecha:** 2026-06-01 · **Estado:** Abierto

## [TD-005] Anchos máximos fijos por número de pares en De par en par

- **Ubicación:** `src/app/workspaces/de-par-en-par/components/Tab2View.tsx:121`
- **Riesgo:** 4/10
- **Problema:** El tablero elige `max-w-[1200px]`, `[950px]`, `[1100px]` o `[1400px]` según la cantidad de pares. Son medidas afinadas a ojo para 1080p, no derivadas del espacio disponible.
- **Impacto futuro:** En resoluciones distintas a 1080p el tablero se desborda o queda con cartas demasiado pequeñas/grandes. Cada nuevo conteo de pares exige otro número mágico.
- **Fecha:** 2026-06-01 · **Estado:** Abierto

## [TD-006] Sin diseño adaptable para móvil, tablet o TV

- **Ubicación:** `src/app/workspaces/layout.tsx` (y colectores en general)
- **Riesgo:** 3/10
- **Problema:** El sistema está pensado solo para escritorio/laptop. No hay breakpoints reales para móvil/tablet ni consideración para TV. Es una decisión de diseño asumida, no un bug.
- **Impacto futuro:** Si en el futuro se necesitara operar desde una tablet en estudio o desde un móvil, habría que rehacer buena parte del layout. Queda registrado como límite conocido para no descubrirlo por sorpresa.
- **Fecha:** 2026-06-01 · **Estado:** Abierto
