# Documentación Técnica del Frontend

## 1. Introducción
Este frontend forma parte de una aplicación de gestión de procesos de reclutamiento. Su objetivo es ofrecer una interfaz intuitiva para gestionar candidatos, posiciones y flujos de entrevistas, interactuando con un backend basado en Node.js y Prisma.

## 2. Arquitectura General
La estructura del frontend sigue una organización modular y escalable, basada en buenas prácticas de desarrollo web moderno:

```
frontend/
├── src/
│   ├── components/      # Componentes reutilizables y de página
│   ├── services/        # Servicios para comunicación con APIs
│   ├── pages/           # (Sugerido) Páginas principales de la app
│   ├── hooks/           # (Sugerido) Hooks personalizados
│   ├── types/           # (Sugerido) Tipos TypeScript
│   ├── assets/          # Recursos estáticos (imágenes, logos)
│   ├── App.js/tsx       # Componente raíz y ruteo
│   └── index.tsx        # Punto de entrada
```

- **components/**: Incluye componentes como formularios, dashboards, listados y utilidades visuales.
- **services/**: Encapsula la lógica de acceso a APIs (ej: `candidateService.js`).
- **assets/**: Imágenes y recursos estáticos.
- **App.js/tsx**: Define la estructura de rutas y navegación.

## 3. Frameworks y Librerías Principales
- **React**: Biblioteca principal para la construcción de interfaces de usuario.
- **React Router DOM**: Manejo de rutas y navegación entre páginas.
- **Bootstrap & React-Bootstrap**: Sistema de estilos y componentes visuales responsivos.
- **react-datepicker**: Selección de fechas en formularios.
- **axios**: (En servicios) Para llamadas HTTP a la API.
- **Jest & React Testing Library**: (Sugerido) Para pruebas unitarias y de integración.

## 4. Patrones de Diseño y Buenas Prácticas
- **Componentes funcionales** y uso intensivo de hooks (`useState`, `useEffect`).
- **Separación de responsabilidades**: Lógica de negocio en servicios, UI en componentes.
- **Reutilización**: Componentes desacoplados y reutilizables.
- **Tipado estático**: Uso de TypeScript en nuevos componentes para robustez y autocompletado.
- **Convenciones de nombres**: Archivos y variables en inglés, componentes en PascalCase.

## 5. Estándares de Código
- **TypeScript** recomendado para nuevos desarrollos.
- **Bootstrap** como base de estilos.
- **Servicios** para toda comunicación con el backend.
- **Manejo de estados y errores** en la UI.
- **Pruebas unitarias** para lógica y componentes clave.
- **TDD** sugerido: escribir tests antes de implementar funcionalidades.

## 6. Ruteo y Navegación
- Definido en `App.js` usando `react-router-dom`:
  - `/` → Dashboard principal (`RecruiterDashboard`)
  - `/add-candidate` → Formulario de alta de candidatos (`AddCandidateForm`)
  - `/positions` → Listado de posiciones (`Positions`)

## 7. Comunicación con el Backend
- **Servicios** en `src/services/` (ej: `candidateService.js`) usan `axios` o `fetch` para interactuar con la API REST.
- Endpoints principales:
  - `POST /candidates` para crear candidatos
  - `POST /upload` para subir archivos
  - `GET /position/:id/candidates` para obtener candidatos de una posición (pendiente de integración en frontend)

## 8. Gestión de Estado
- Uso de hooks locales (`useState`, `useEffect`).
- (Sugerido) Para escalabilidad, considerar React Query o Redux en proyectos más grandes.

## 9. Estilos y UI
- **Bootstrap** y **React-Bootstrap** para estilos y componentes visuales.
- Clases y estilos consistentes para mantener la coherencia visual.
- Personalización de componentes visuales según necesidades del negocio.

## 10. Testing
- **Jest** y **React Testing Library** recomendados para pruebas unitarias y de integración.
- Estructura sugerida:
  - Tests junto a los componentes o en una carpeta `__tests__`.
  - Cobertura mínima para servicios y componentes críticos.
- **TDD**: Escribir primero los tests, luego la funcionalidad.

## 11. Accesibilidad y Responsividad
- Uso de componentes accesibles de Bootstrap.
- Diseño responsive para soportar dispositivos móviles y tablets.

## 12. Sugerencias de Mejora
- Integrar TypeScript en todos los componentes para mayor robustez.
- Implementar React Query para gestión eficiente de datos remotos.
- Añadir pruebas unitarias y de integración en todos los servicios y componentes nuevos.
- Mejorar la documentación de componentes y servicios con JSDoc.
- Crear una carpeta `pages/` para separar vistas principales de componentes reutilizables.
- Añadir manejo global de errores y estados de carga.
- Considerar el uso de Storybook para documentar y probar componentes visuales. 