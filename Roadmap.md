# Roadmap — QGEM Studio

A continuación, se detalla la hoja de ruta y las recomendaciones pertinentes para el futuro desarrollo de **TvPeru-QGEM-Studio**. Estas tareas están organizadas por bloques de prioridad.

## Fase 1: Creación de Nuevos Colectores (Alta Prioridad)

Habiendo finalizado la base estructural (Bloque 0 y 1), el objetivo principal es completar los colectores restantes utilizando el esquema y arquitectura ya definidos.

### Tareas:

- [ ] **Desarrollo del Colector 6**: Definir schema local, orquestar `page.tsx` con `WorkspaceShell` y `FileActions`.
- [ ] **Desarrollo del Colector 7**: Identificar y desarrollar componentes únicos en caso de requerirse para su interfaz.
- [ ] **Desarrollo del Colector 8**: Validar el contrato de JSON con el cliente Unity.

_Recomendación_: Usar el template base existente en la documentación del proyecto. Mantener el `page.tsx` con un máximo de ~120 líneas, delegando toda la complejidad visual a los componentes compartidos.

## Fase 2: Validaciones Previas a la Exportación (Media Prioridad)

Para garantizar la integridad de los datos cargados por los usuarios antes del envío al cliente Unity, es necesario implementar un sistema de validación robusto y genérico.

### Tareas:

- [ ] **Motor de Validación**: Crear función `validateWorkspace(data, rules): ValidationResult` en `@/helpers/validation.ts`.
- [ ] **Feedback Visual**: Desarrollar el componente `ValidationSummary` que muestre los errores en pantalla (ej. "Falta una imagen en la ronda 2", "La pregunta no puede estar vacía").
- [ ] **Integración en Exportación**: Bloquear la acción de guardado en `FileActions` si las validaciones no se cumplen (vía prop opcional `validate`).
- [ ] **Reglas Estándar**: Implementar validaciones como: campo requerido, imagen requerida, número mínimo de ítems, y longitud máxima de texto.

_Recomendación_: Este bloque debe implementarse una vez que los colectores de la Fase 1 estén estables, para evitar retrasos en la entrega principal de los módulos de juego.

## Fase 3: Mejoras de Infraestructura y Refinamiento (Baja Prioridad / Post-Entrega)

Una vez completados todos los requerimientos funcionales y de producción de datos, el proyecto puede transicionar hacia una experiencia de usuario más inmersiva.

### Tareas:

- [ ] **Barra Lateral y Contexto Global**: Migrar el control del header (`WorkspaceShell`) hacia el `layout.tsx` global utilizando Context API. Esto permitirá introducir una barra lateral de navegación persistente entre colectores.
- [ ] **Consistencia Visual**: Realizar una revisión general de UI/UX enfocada en _hover states_, transiciones suaves de entrada/salida y espaciado (spacing).
- [ ] **Documentación de Schemas**: Documentar de manera definitiva el contrato del schema JSON esperado por el equipo de Unity para cada uno de los juegos.

_Recomendación_: No incluir Context API hasta que la barra lateral sea estrictamente necesaria, para mantener la arquitectura de componentes aislados y livianos durante la fase de alta producción actual.

## Notas Adicionales y Buenas Prácticas

1. **Simplicidad**: Continuar omitiendo implementaciones complejas como bases de datos o autenticación, ya que no resuelven ningún problema en este punto y el proyecto es estrictamente una herramienta de exportación en red local/cerrada.
2. **Nomenclatura Consistente**: Recuerda siempre utilizar "QGEM Studio" o "TvPeru-QGEM-Studio" como nombre de la aplicación, evitando utilizar el antiguo nombre (AppCenter).
3. **Manejo de Imágenes**: Las imágenes y componentes en pestañas como "Intruso" requieren atención especial con las URLs efímeras. Mantener habilitada la opción `skipCleanupOnUnmount` en `use-image-picker` cuando sea necesario para prevenir la expiración de los ObjectURLs.
