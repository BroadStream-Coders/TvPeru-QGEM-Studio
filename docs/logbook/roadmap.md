# Roadmap

Trabajo comprometido: lo que sí se va a hacer. Código `RM-###` (nunca se reutiliza).
Al terminar una tarea se mueve al changelog y se borra de aquí.

**Formato de cada entrada:**
- **Objetivo:** qué se quiere lograr.
- **Hecho cuando:** criterio claro de finalización.
- **Fecha** y **Estado** (Abierto / En progreso).

> Nota: las entradas migradas desde `docs/pendientes.md` conservan su **dificultad**
> (1-10) y sus **dependencias** como campos extra de apoyo.

---

## [RM-001] Temas claro / oscuro

- **Objetivo:** Soportar tema claro y oscuro en toda la app, con preferencia persistente y control en el header.
- **Hecho cuando:** Hay un proveedor de tema con toggle persistente, los componentes con colores fijos usan tokens de tema y el control vive en el header.
- **Dificultad:** 6/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-002] Descripción del sistema para Claude Design

- **Objetivo:** Producir un documento (sin código) que sirva de insumo para que Claude Design proponga un diseño nuevo y consistente con claro/oscuro.
- **Hecho cuando:** El documento describe propósito y flujo (cargar → validar → exportar JSON/ZIP a Unity), lista los colectores y qué hace cada uno, describe los 3 sistemas compartidos y anota los requisitos del rediseño (consistencia, claro/oscuro, pantallas objetivo).
- **Dificultad:** 3/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-003] Favicon que funcione en claro y oscuro

- **Objetivo:** Reemplazar el favicon actual por uno con contraste en fondos claros y oscuros.
- **Hecho cuando:** El icono se ve correctamente en navegadores con tema claro y oscuro (idealmente SVG adaptable al esquema).
- **Dificultad:** 2/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-004] Crop en "De par en par"

- **Objetivo:** Activar el recorte opt-in de imágenes en las cartas de "De par en par".
- **Hecho cuando:** Las imágenes de las cartas permiten recorte usando el sistema de crop compartido.
- **Dificultad:** 4/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-007] Telemetría: "Guardar de todos modos"

- **Objetivo:** Registrar cuándo el usuario fuerza el guardado pese a la validación (primera métrica del sistema).
- **Hecho cuando:** Al pulsar "Guardar de todos modos" en `ValidationDialog` se emite un evento con contexto mínimo (colector, fecha, usuario si hay sesión) a su destino definido.
- **Dificultad:** 4/10
- **Depende de:** RM-005
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-008] Documentar schema JSON para Unity

- **Objetivo:** Documentar el contrato JSON esperado por el equipo de Unity, por cada juego.
- **Hecho cuando:** Existe documentación del schema JSON de cada colector usable por el equipo de Unity.
- **Dificultad:** 3/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-009] Barra lateral de navegación

- **Objetivo:** Introducir una sidebar persistente para navegar entre colectores.
- **Hecho cuando:** Hay una barra lateral persistente que convive con el header global de `layout.tsx`.
- **Dificultad:** 5/10
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-011] Validación aritmética en Operaciones Combinadas

- **Objetivo:** Que el sistema valide que cada operación cuadre aritméticamente respecto a su forma `operandoA operador operandoB = resultado`.
- **Hecho cuando:** Una operación cuyo resultado no corresponde a `operandoA <operador> operandoB` se reporta/rechaza antes de exportar, indicando dónde está.
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-012] Validación de secuencias incompletas en Operaciones Combinadas

- **Objetivo:** Que el sistema detecte y reporte cualquier `sequence.values` que no forme una igualdad completa de 5 celdas (`[operandoA, operador, operandoB, "=", resultado]`).
- **Hecho cuando:** Una secuencia con length ≠ 5 o a la que le falten el `"="` y/o el resultado se reporta/rechaza antes de exportar, indicando dónde está.
- **Fecha:** 2026-06-11 · **Estado:** Abierto

## [RM-013] Centralizar la limpieza de datos (trim) en todos los colectores

- **Objetivo:** Que TODOS los colectores apliquen trim (espacios accidentales al
  inicio/final) a los datos, desde un punto central — no repetido a mano en cada
  workspace.
- **Contexto (2026-07-15):** hoy es inconsistente: Cálculo Mental ya hace `trim()`
  en su `buildData` y en su QuickLoad; Deletreo y el resto no hacen ninguno. La
  decisión de diseño quedó abierta a propósito; opciones a evaluar cuando toque:
  1. **Al exportar/subir (central):** un deep-trim de strings en `saveAsJson` /
     `jsonBlob` (helpers compartidos) — cubre todos los colectores sin tocarlos,
     pero lo que se ve en pantalla puede diferir de lo exportado.
  2. **Al cargar/escribir (por flujo):** trim en `loadJsonFile`, QuickLoad y
     `onBlur` de inputs — lo que se ve es lo que se exporta, pero son varios
     puntos de entrada.
  3. **Al validar:** que `validate` reporte/corrija espacios — visible pero añade
     fricción.
  Nota: la carga desde storage ya pasa por el mismo `onLoad` que la carga local
  (un solo punto de entrada), lo que favorece las opciones centralizadas.
- **Hecho cuando:** Existe un único mecanismo compartido de trim, todos los
  colectores lo usan (incluido QuickLoad), y se retiró el trim manual duplicado
  de Cálculo Mental.
- **Fecha:** 2026-07-15 · **Estado:** Abierto

## [RM-014] Storage para colectores ZIP (bundles con imágenes)

- **Objetivo:** Extender la subida/bajada al storage (RM-010, ya operativa para
  los 8 colectores JSON) a los 4 colectores ZIP: Álbum, Intruso, Galería de
  Fotos y De par en par.
- **Bloqueado por (decisión de Esteban, 2026-07-15):** antes hay que resolver el
  tema del **peso de las imágenes** (tamaño de los bundles a subir/bajar,
  posible compresión/redimensionado, cuota del bucket). No implementar hasta
  tener esa conversación.
- **Camino técnico ya identificado:** separar en `persistence.ts` un
  `buildZipBlob(jsonData, files)` que `saveAsZip` y el `getBlob` del `upload`
  compartan (mismo refactor que `buildData` en los JSON); el resto (split
  buttons, confirmaciones, gate de login) ya lo da `FileActions` gratis.
- **Hecho cuando:** Los 4 colectores ZIP suben y bajan su bundle de
  `oficial/`/`ejemplo/` igual que los JSON, con una política de peso definida.
- **Depende de:** RM-013 no; decisión de peso/imágenes sí.
- **Fecha:** 2026-07-15 · **Estado:** Abierto

## [RM-016] Reordenar eventos por drag & drop dentro de una columna (Cronos)

- **Objetivo:** Poder arrastrar un evento (row) dentro de su columna para cambiar
  el orden, ya que el orden es la respuesta del juego.
- **Camino técnico sugerido:** reusar `@dnd-kit` (sortable) en vez de programar el
  arrastre a mano; el orden persistido ya es el orden del array de la columna.
- **Hecho cuando:** El usuario puede reordenar los eventos de una columna
  arrastrándolos, y el nuevo orden se refleja al exportar.
- **Fecha:** 2026-08-04 · **Estado:** Abierto

## [RM-017] Llenado rápido leyendo el portapapeles directamente (Cronos)

- **Objetivo:** Agregar al llenado rápido un botón tipo toggle que, al pulsarlo,
  lea el portapapeles directamente (Clipboard API) y ejecute el llenado, sin
  tener que pegar en el textarea ni enviar manualmente.
- **Detalle:** al presionar el botón se hace `navigator.clipboard.readText()` y se
  reutiliza el mismo parseo/llenado actual (2 columnas: fecha, título; ignora
  lo que pase de 5). Contemplar el permiso de portapapeles del navegador.
- **Hecho cuando:** Con datos copiados de Excel, un clic en el botón llena la
  columna sin pasar por el textarea.
- **Fecha:** 2026-08-04 · **Estado:** Abierto

## [RM-019] Colector "Tres en Raya"

- **Objetivo:** Crear el colector del juego "Tres en Raya" siguiendo la
  arquitectura común (workspace propio con `page.tsx` que registra header vía
  `setHeader`, componentes en `components/`, validación previa a exportar).
- **Hecho cuando:** El colector existe en `src/app/workspaces/tres-en-raya`,
  aparece en el home, exporta/importa su formato y valida antes de exportar.
- **Fecha:** 2026-08-12 · **Estado:** Abierto
