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

---

## Retiro de Supabase (RM-020 → RM-025)

Decisión (2026-08-12): sacar del proyecto todo lo que depende de Supabase —
cuentas de Google, el SQL de permisos y el storage— y volver a un colector
puramente local (archivo JSON/ZIP que el usuario guarda y carga a mano).
Se hace en pasos: cada RM deja el proyecto compilando y usable por sí solo, y
el orden va de la punta (UI) hacia la raíz (cliente y credenciales).

> Descartadas el 2026-08-12 por esta decisión (sus códigos no se reutilizan):
> RM-014 (storage para colectores ZIP) y RM-007 (telemetría de "Guardar de todos
> modos", que dependía de la sesión).

## [RM-024] Quitar el cliente, las dependencias y las credenciales de Supabase

- **Objetivo:** Que el repo no sepa que Supabase existió.
- **Alcance:** borrar `src/lib/supabase.ts`; desinstalar `@supabase/ssr` y
  `@supabase/supabase-js` (`pnpm remove`, commitear el lockfile); quitar
  `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` de
  `.env.local` y de cualquier config de despliegue.
- **Hecho cuando:** `grep -ri supabase src/` no devuelve nada, las dependencias
  ya no están en `package.json` y el build está limpio.
- **Dificultad:** 2/10
- **Depende de:** RM-020, RM-022, RM-023
- **Fecha:** 2026-08-12 · **Estado:** Abierto

## [RM-025] Desmontar el backend en el dashboard de Supabase

- **Objetivo:** Apagar lo que vive fuera del repo, una vez que la app ya no lo
  toca.
- **Alcance (manual, lo hace Esteban en el dashboard):** bajar el bucket privado
  `data` (guardando antes los JSON de `oficial/` y `ejemplo/` que se quieran
  conservar), borrar la tabla `production_access` y sus policies, borrar la
  función `has_production_access()`, desactivar el provider de Google en Auth y
  finalmente pausar o borrar el proyecto.
- **Hecho cuando:** No queda bucket, tabla, función ni provider activo, y hay
  copia local de los datos que valía la pena rescatar.
- **Dificultad:** 2/10
- **Depende de:** RM-024
- **Fecha:** 2026-08-12 · **Estado:** Abierto
