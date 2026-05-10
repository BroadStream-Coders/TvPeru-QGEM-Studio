# TvPeru-QGEM-Studio

**QGEM Studio** es el sistema web de recolección de datos para el programa de TV en vivo *Que Gane el Mejor* (TV Perú), desarrollado por BroadStream Coders.

## Propósito del Proyecto

El sistema permite a los especialistas de producción (usuarios con bajo perfil técnico) llenar la información de cada juego **antes del en vivo**. El sistema exporta los archivos generados en formato JSON o ZIP (si incluyen imágenes), los cuales se cargan posteriormente en un cliente **Unity**. Dicho cliente lee estos datos y renderiza los juegos en pantalla durante la transmisión del programa.

## Características Principales

- **Orientado a la exportación**: Exportación siempre por archivo (JSON o ZIP con imágenes). Sin backend, sin base de datos.
- **Múltiples "Colectores"**: Cada juego (ej. Deletreo, Cálculo Mental, Mi Libro Favorito, etc.) tiene su propio "colector" o workspace de trabajo.
- **UI/UX Consistente**: Tema dark por defecto, usando componentes compartidos para asegurar un flujo de trabajo intuitivo y reducir la duplicación de código.
- **Feedback Visible**: Interfaces claras con prevención de errores para usuarios no técnicos.

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Estilos**: Tailwind CSS v4, shadcn/ui
- **Lenguaje**: TypeScript (Strict)

## Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone <repo_url>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

## Estructura del Proyecto

El código está estructurado para maximizar la reutilización de componentes entre los distintos colectores (workspaces):

- `src/app/workspaces/[nombre]`: Contiene la lógica de estado y los schemas de datos específicos de cada juego.
- `src/components/shared`: Componentes UI estructurales reutilizados en todos los colectores (ej. `WorkspaceShell`, `FileActions`, `BoardColumn`).
- `src/hooks`: Hooks de estado global o reutilizable (ej. `use-workspace-groups`, `use-image-picker`).
- `src/helpers`: Funciones utilitarias para la persistencia, exportación y validación de los datos.

## Convenciones de Desarrollo

- **Un colector = un `page.tsx` liviano**: El componente de página solo orquesta el estado, y todo lo visual viene de componentes compartidos.
- **Componentes por contrato**: Se utilizan componentes genéricos que reciben `children` en lugar de crear componentes altamente acoplados al contenido de cada juego.
- **IDs de entidades**: Siempre se utiliza `nanoid()` para generar IDs (ej. rondas, fotos), nunca índices de arreglos.

Para conocer las tareas pendientes y recomendaciones, consulta el archivo `Roadmap.md`.
