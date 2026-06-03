# Pendientes — QGEM Studio

Lista viva de tareas. El `Roadmap.md` es la visión general; la deuda técnica vive en
`docs/technical-debt.md` y el estado de los sistemas compartidos en
`docs/shared-features.md`.

> **Dificultad 1–10**: esfuerzo/complejidad estimada, para elegir tarea según tu
> energía del día. 1 = rápido y mecánico · 10 = complejo, varias piezas.
> Marca `[x]` lo terminado.

## Índice por dificultad

| #   | Tarea                                      | Dif. | Depende de |
| --- | ------------------------------------------ | :--: | ---------- |
| T3  | Favicon que funcione en claro y oscuro     | 2/10 | —          |
| T2  | Descripción del sistema para Claude Design | 3/10 | —          |
| T8  | Documentar schema JSON para Unity          | 3/10 | —          |
| T4  | Crop en "De par en par"                    | 4/10 | —          |
| T7  | Telemetría: "Guardar de todos modos"       | 4/10 | T5         |
| T9  | Barra lateral de navegación                | 5/10 | —          |
| T5  | Login con Google (Supabase Auth)           | 5/10 | —          |
| T1  | Temas claro / oscuro                       | 6/10 | —          |
| T6  | Acceso "producción" gestionado en Supabase | 6/10 | T5         |
| T10 | Storage de Supabase (subir / bajar datos)  | 7/10 | T5, T6     |

---

## 🎨 Diseño e identidad

### T1 · Temas claro / oscuro · **6/10**

- [ ] Montar proveedor de tema (toggle claro/oscuro + persistencia de preferencia).
- [ ] Auditar componentes con colores fijos y migrarlos a tokens de tema.
- [ ] Añadir el control de cambio de tema en el header.

### T2 · Descripción del sistema para Claude Design · **3/10**

> Documento, sin código. Insumo para que Claude Design proponga un diseño nuevo y consistente (con claro/oscuro).

- [ ] Describir propósito del sistema y flujo general (cargar datos → validar → exportar JSON/ZIP a Unity).
- [ ] Listar los colectores y qué hace cada uno.
- [ ] Describir los 3 sistemas compartidos (crop, validación, "Lego").
- [ ] Anotar requisitos del rediseño: consistencia, soporte claro/oscuro, pantallas objetivo.

### T3 · Favicon que funcione en claro y oscuro · **2/10**

- [ ] Reemplazar el icono actual (no se ve en navegadores con tema claro).
- [ ] Asegurar contraste en ambos fondos (idealmente SVG que se adapte al esquema).

---

## 👤 Cuentas y acceso (Supabase)

### T5 · Login con Google · **5/10**

- [ ] Configurar Supabase Auth con proveedor Google (OAuth).
- [ ] Agregar botón "Conectarse con Google".
- [ ] Manejar sesión en la app (estado conectado/desconectado, cerrar sesión).

### T6 · Acceso "producción" gestionado en Supabase · **6/10** _(requiere T5)_

> El único acceso que gestionas manualmente. Habilita las opciones de storage (T10).

- [ ] Modelar el rol/flag de "producción" por cuenta en Supabase.
- [ ] Definir cómo das/quitas el acceso (panel propio o desde el dashboard de Supabase).
- [ ] Leer el flag en la app y exponerlo al resto de la UI.
- [ ] Sin acceso: el usuario usa el sistema normal, pero sin opciones de storage.

### T10 · Storage de Supabase (subir / bajar datos) · **7/10** _(requiere T5, T6)_

- [ ] Configurar bucket(s) de storage con sus reglas de acceso (solo "producción").
- [ ] Subir datos al storage desde la app.
- [ ] Bajar / recuperar datos del storage.
- [ ] Mostrar las opciones de storage solo si el usuario tiene acceso de producción.

---

## 📈 Telemetría

### T7 · "Guardar de todos modos" · **4/10** _(se apoya en T5)_

> Por ahora una sola métrica: registrar cuándo el usuario fuerza el guardado pese a la validación.

- [ ] Definir destino del evento (tabla en Supabase u otro).
- [ ] Emitir el evento al pulsar "Guardar de todos modos" en `ValidationDialog`.
- [ ] Guardar contexto mínimo útil (colector, fecha, usuario si hay sesión).

---

## 🧩 Mejoras de colectores

### T4 · Crop en "De par en par" · **4/10**

- [ ] Activar el crop opt-in en las imágenes de las cartas (ver `docs/shared-features.md`).

### T9 · Barra lateral de navegación · **5/10**

- [ ] Introducir sidebar persistente entre colectores (el header ya vive en `layout.tsx` vía store, base lista).

---

## 📄 Documentación

### T8 · Schema JSON para Unity · **3/10**

- [ ] Documentar el contrato JSON esperado por el equipo de Unity, por cada juego.

---

## 🛠️ Deuda técnica (resumen)

Detalle y prioridad en `docs/technical-debt.md`. Abiertas hoy:

- [ ] **TD-001** · La UI asume pantalla 1080p y viewport completo (riesgo 6).
- [ ] **TD-002** · Altura con números mágicos en Galería de Fotos (riesgo 5).
- [ ] **TD-004** · Alto fijo del recortador de imágenes (riesgo 4).
- [ ] **TD-005** · Anchos máximos fijos por número de pares en De par en par (riesgo 4).
- [ ] **TD-006** · Sin diseño adaptable para móvil/tablet/TV (riesgo 3, límite asumido).

---

## ✅ Ya cerrado (referencia rápida)

- Los 12 colectores están creados.
- Sistema de validación previo a exportar (motor, diálogo de bloqueo, gate en `FileActions`).
- Sistema de recorte de imágenes (crop opt-in).
- Sistema "Lego" (columnas/filas reutilizable).
- Migración del header al `layout.tsx` global (patrón store unificado, `WorkspaceShell` eliminado).
