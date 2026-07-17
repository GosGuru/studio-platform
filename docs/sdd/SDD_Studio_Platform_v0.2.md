# SDD — Studio Platform: Portfolio público + sistema operativo interno
**Versión:** 0.2 **Estado:** Fase 0 iniciada — contrato técnico aprobado provisionalmente **Fecha:** 17 de julio de 2026 **Propietarios del producto:** Máximo y Daniel Roldán **Nombre técnico provisional:** `studio-platform` **Nombre comercial:** pendiente de definición
---
## 0. Propósito del documento
Este Software Design Document define el producto, la arquitectura y la secuencia de implementación del sitio público y del panel administrativo del estudio. El documento funciona como contrato técnico y operativo para el trabajo por fases y pull requests. El objetivo no es describir una idea general, sino permitir que un agente o desarrollador implemente el producto sin improvisar decisiones estructurales. Las decisiones visuales concretas de los frames de Figma se resolverán durante la fase de dirección artística. Las reglas del design system, rendimiento, accesibilidad y arquitectura aquí definidas prevalecen sobre cualquier template individual.
### 0.1 Lenguaje normativo
- **DEBE:** requisito obligatorio para aprobar un PR. · **NO DEBE:** comportamiento prohibido. · **DEBERÍA:** recomendación fuerte que requiere justificar cualquier excepción.
- **PUEDE:** decisión opcional condicionada por valor, coste y complejidad. · **Fuera de alcance:** no debe introducirse accidentalmente en el PR indicado.
### 0.2 Resultado esperado
- Una web pública editorial-cinematográfica que demuestre diseño, desarrollo y pensamiento de producto. · Un sistema de casos de estudio capaz de presentar contexto, decisiones, proceso y resultados. · Un panel privado para gestionar clientes, proyectos, tareas, documentos, portfolio y cobros.
- Un monorepo con dos aplicaciones desplegables y paquetes compartidos. · Una base PostgreSQL con permisos explícitos y trazabilidad. · Un proceso Figma → MCP → código controlado y verificable.
- Una plataforma preparada para crecer sin construir prematuramente un ERP universal.

### 0.3 Estado de ejecución de Fase 0
- **PR-001:** preparado documentalmente en este paquete.
- **PR-002:** inventario inicial creado; licencias, contenido publicable y permisos de clientes siguen abiertos.
- **PR-003:** referencias y matriz preparadas; la inspección visual queda bloqueada hasta conectar Figma MCP en un entorno autorizado.
- **PR-004:** dirección artística preliminar documentada; no se considera cerrada hasta completar PR-003 y aprobarla Máximo y Daniel.
- El trabajo técnico de PR-005 puede comenzar en paralelo controlado con PR-002/003, pero PR-006 no debe congelar branding definitivo antes de aprobar PR-004.
---
## 1. Visión del producto
### 1.1 Problema comercial
Máximo y Daniel ya producen proyectos para clientes, pero su experiencia, metodología y calidad no están concentradas en una propiedad digital propia. Un portfolio convencional mostraría capturas, pero no demostraría la profundidad de su trabajo ni ayudaría a operar el estudio. La información de clientes, proyectos, vencimientos y cobros puede fragmentarse entre mensajes, memoria, documentos y herramientas inconexas. La nueva plataforma debe resolver simultáneamente posicionamiento, prueba de capacidad y organización interna.
### 1.2 Propuesta de producto
La plataforma tendrá dos superficies complementarias:
1. **Web pública:** escaparate editorial, comercial y técnico. 2. **Panel administrativo:** sistema operativo privado del estudio.
La web pública debe generar confianza y conversación comercial. El panel debe reducir olvidos, retrabajo y dependencia de información dispersa. Ambas superficies compartirán fundamentos de marca, pero no la misma densidad ni intensidad de movimiento.
### 1.3 Principio rector
> La web pública demuestra lo que el estudio puede construir; el panel demuestra cómo el estudio decide operar.
### 1.4 Objetivos de negocio
- Presentar una identidad conjunta entre Uruguay y España. · Aumentar la percepción de valor del estudio. · Facilitar la evaluación de proyectos anteriores.
- Convertir visitas cualificadas en conversaciones comerciales. · Centralizar información básica de clientes y proyectos. · Anticipar vencimientos y cobros.
- Reutilizar el trabajo interno como contenido público. · Crear una base para futuros servicios, productos y portal de clientes.
### 1.5 No objetivos iniciales
- Reemplazar un software contable certificado. · Procesar tarjetas o custodiar medios de pago. · Crear un gestor de proyectos genérico comparable con Jira o ClickUp.
- Implementar una API independiente sin una necesidad operativa demostrada. · Construir un sistema multiempresa comercializable en la primera versión. · Incluir chat interno, videollamadas o edición colaborativa en tiempo real.
- Automatizar decisiones financieras o legales. · Publicar contenido ficticio como si fueran resultados reales.
---
## 2. Usuarios y permisos
### 2.1 Visitante público
- Puede navegar la web pública. · Puede explorar proyectos publicados. · Puede leer casos de estudio.
- Puede conocer al equipo y su método. · Puede enviar una consulta comercial. · No puede acceder a información privada ni borradores.
### 2.2 Owner
- Representa a Máximo o Daniel. · Tiene acceso completo al workspace. · Puede administrar miembros y permisos.
- Puede ver información financiera. · Puede publicar casos de estudio. · Puede cambiar configuraciones críticas.
### 2.3 Admin
- Puede administrar clientes, proyectos, tareas y contenido. · Puede operar cobros si recibe el permiso financiero. · No puede eliminar el último owner.
- No puede modificar secretos ni políticas de infraestructura.
### 2.4 Member
- Puede acceder a proyectos asignados. · Puede actualizar tareas y notas autorizadas. · No puede ver finanzas por defecto.
- No puede publicar contenido sin revisión.
### 2.5 Viewer
- Puede consultar información autorizada. · No puede crear, editar ni eliminar registros. · Está pensado para colaboradores o revisión temporal.
### 2.6 Principio de autorización
Los permisos se validarán en la base mediante RLS y, cuando corresponda, también en el servidor. Ocultar un botón en la interfaz no se considera una medida de seguridad. Las operaciones privilegiadas no confiarán en roles enviados por el cliente.
---
## 3. Alcance funcional
### 3.1 Web pública v1
- Home. · Índice de proyectos. · Página individual de caso de estudio.
- Página del estudio. · Página de contacto. · Páginas legales mínimas.
- SEO técnico y metadatos sociales. · Navegación accesible. · Animación progresiva con alternativa de movimiento reducido.
### 3.2 Panel administrativo v1
- Autenticación. · Dashboard operativo. · Clientes y contactos.
- Proyectos, etapas y responsables. · Tareas y vencimientos. · Documentos y enlaces.
- CMS del portfolio. · Registro básico de actividad. · Configuración del workspace.
### 3.3 Finanzas operativas v1
- Facturas o cuentas por cobrar. · Conceptos de factura. · Pagos parciales y totales.
- Monedas EUR, USD y UYU desde el comienzo. · Vencimientos y estados. · Cargos recurrentes.
- Comprobantes y notas. · Alertas visuales de atraso.
### 3.4 Posibles extensiones posteriores
- Integración con Gmail. · Integración con Google Calendar. · Creación y vinculación de carpetas en Drive.
- Recordatorios automáticos. · Generación de propuestas. · Portal de clientes.
- Reportes de rentabilidad. · Webhooks y workers especializados. · API pública o integraciones externas.
---
## 4. Dirección de arte y experiencia
### 4.1 Dirección aprobada
La dirección se denomina provisionalmente **Editorial Systems × Cinematic Craft**. Combina claridad editorial, disciplina de sistema y momentos cinematográficos deliberados. La estética no debe depender de glassmorphism, glows o parallax como recursos permanentes. La sensación premium surgirá principalmente de restricción, composición, tipografía, ritmo y consistencia.
### 4.2 Jerarquía de fuentes visuales
1. El design system propio define las reglas. 2. Los templates Figma aportan patrones y composiciones. 3. El kit cinematográfico aporta técnicas y experimentos. 4. Figma MCP acelera la traducción del frame aprobado a contexto técnico. 5. El código de producción debe obedecer la arquitectura del repositorio.
### 4.3 Principios visuales
- Una paleta reducida y semántica. · Un máximo de dos familias tipográficas principales. · Un solo acento con variantes definidas.
- Escala de espaciado cerrada. · Jerarquías tipográficas fluidas. · Alternancia intencional entre superficies cálidas y oscuras.
- Imágenes grandes y proyectos tratados como historias. · Componentes sin valores visuales improvisados. · Contraste y foco visibles con teclado.
- Movimiento al servicio de jerarquía, contexto o transición.
### 4.4 Diferencia entre superficies
#### Web pública
- Expresiva. · Editorial. · Narrativa.
- Espaciosa. · Con momentos inmersivos. · Optimizada para mostrar trabajos y generar contacto.
#### Panel administrativo
- Denso sin ser confuso. · Predecible. · Rápido.
- Orientado a tareas. · Con movimiento funcional mínimo. · Optimizado para lectura, edición y seguimiento.
### 4.5 Reglas de movimiento
- Toda animación debe tener un propósito documentable. · Las transiciones de interfaz usarán una curva de easing común. · Los springs quedan restringidos a interacciones físicas justificadas.
- Los reveals no desplazarán contenido desde distancias exageradas. · El parallax será sutil y desactivable. · El scroll horizontal no reemplazará la navegación vertical en móvil.
- `prefers-reduced-motion` debe producir una experiencia completa, no una página rota. · Los elementos esenciales no dependerán de hover. · Las animaciones pesadas se cargarán de manera diferida.
- Three.js o Spline requieren una decisión explícita de arquitectura y rendimiento.
### 4.6 Presupuesto cinematográfico
Cada página pública puede tener:
- Hasta un momento cinematográfico principal. · Hasta dos momentos narrativos secundarios. · Microinteracciones funcionales en controles.
- Un único glow dominante por viewport como máximo. · Film grain opcional con opacidad baja y sin afectar legibilidad.
---
## 5. Referencias Figma inventariadas
Estas referencias se consideran insumos auditables, no diseños aprobados. El PR de dirección artística debe inspeccionar cada nodo con Figma MCP y captura visual.
### 5.1 Arkkhe Daily Heroes
- Hero 01 — archivo `HsilWBZpRlT5nMMuQZ5lhM` — nodo `2001:60`. · Hero 04 — archivo `Fv20sXDJpzCfwBX4iO5GSs` — nodo `20001:971`. · Hero 06 — archivo `SxevwAp4OFhwLbpOsnAJN7` — nodo `2001:60`.
- Hero 08 — archivo `lIu8d3AxZe8Iu8P3EHCCwN` — nodo `2001:60`. · Hero 11 — archivo `QtyREuYlqkXhfHYsbFlmIH` — nodo `2001:60`. · Hero 15 — archivo `YYzS2R3z7tUga8hPdfOvNG` — nodo `2001:60`.
- Hero 18 — archivo `WGT7xlG809U4xHZgyyjw6i` — nodo `0:179`. · Hero 19 — archivo `nZipF8S9NSAKitjq6lhXIV` — nodo `1:24`.
### 5.2 Templates prioritarios del pack
- Hallmark para curaduría de portfolio. · Bloom Editorial para tensión tipográfica y composición. · Folio Suite para servicios y capacidades.
- Lineage Hot para historia y manifiesto. · Coda Noir para cierre y contacto. · Showcase Hero para casos de estudio.
- Whisper Nav para navegación contenida. · AR Mirror para dualidad Uruguay–España o diseño–desarrollo.
### 5.3 Matriz de auditoría
Cada referencia se calificará de 1 a 5 en:
- Encaje con el posicionamiento. · Claridad del mensaje. · Originalidad tras adaptación.
- Capacidad para presentar proyectos. · Comportamiento responsive. · Accesibilidad.
- Rendimiento esperado. · Complejidad de implementación. · Reutilización en el sistema.
- Potencial de diferenciación.
### 5.4 Flujo obligatorio con Figma MCP
1. Consultar el nodo exacto con `get_design_context`. 2. Extraer variables y estilos con `get_variable_defs`. 3. Capturar o revisar la representación visual. 4. Comparar con tokens y componentes existentes. 5. Describir la estructura antes de escribir código. 6. Implementar una sección por vez. 7. Comparar desktop, tablet y móvil. 8. Registrar desviaciones deliberadas. 9. No copiar valores fuera del sistema sin aprobación. 10. No convertir el código sugerido por MCP en autoridad arquitectónica.
---
## 6. Arquitectura de alto nivel
### 6.1 Estrategia de repositorio
Se usará un único monorepo. El monorepo contendrá aplicaciones independientes y paquetes compartidos. No se crearán repositorios separados para web y admin. Cada aplicación tendrá su propio proyecto de Vercel y su propio dominio.
### 6.2 Estructura objetivo
```text
studio-platform/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── design-tokens/
│   ├── ui-core/
│   ├── ui-marketing/
│   ├── ui-admin/
│   ├── database/
│   ├── validation/
│   ├── testing/
│   ├── eslint-config/
│   └── typescript-config/
├── supabase/
│   ├── migrations/
│   ├── seed/
│   ├── functions/
│   └── tests/
├── docs/
│   ├── sdd/
│   ├── adr/
│   └── runbooks/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```
### 6.3 Aplicación `apps/web`
- Next.js App Router. · Server Components por defecto. · Client Components limitados a interacción real.
- Rutas públicas y SEO. · Lectura de contenido publicado. · Formulario de contacto mediante servidor.
- Animación cargada progresivamente.
### 6.4 Aplicación `apps/admin`
- Next.js App Router. · Autenticación obligatoria. · Layout privado.
- Formularios y tablas operativas. · Server Functions o Route Handlers para mutaciones complejas. · Validación compartida.
- Acceso condicionado por rol y políticas RLS.
### 6.5 Backend inicial
El backend inicial estará compuesto por:
- PostgreSQL administrado por Supabase. · Supabase Auth. · Supabase Storage.
- Row Level Security. · Server Functions. · Route Handlers.
- Edge Functions solo cuando aporten valor claro.
### 6.6 API independiente
No se creará `apps/api` en la primera versión. Se evaluará una API o worker separado cuando existan:
- Webhooks complejos. · Procesos de larga duración. · Colas.
- Integraciones múltiples. · Generación intensiva de documentos. · Límites operativos de funciones existentes.
- Necesidad de consumidores externos.
### 6.7 Despliegue
- Proyecto Vercel 1: raíz `apps/web`. · Proyecto Vercel 2: raíz `apps/admin`. · Ambos proyectos apuntan al mismo repositorio.
- Cada proyecto tendrá variables y dominios independientes. · Los previews de PR se usarán como entorno de revisión. · Los builds ignorarán cambios que no afecten a la aplicación correspondiente cuando sea posible.
---
## 7. Stack técnico
### 7.1 Base
- TypeScript en modo estricto. · Next.js App Router. · React según la versión soportada por Next.js estable.
- pnpm workspaces. · Turborepo para tareas y caché. · Tailwind CSS para utilidades y tokens expuestos.
- CSS custom properties como contrato de design tokens.
### 7.2 UI
- Componentes accesibles basados en primitives verificadas. · `ui-core` para controles comunes. · `ui-marketing` para patrones editoriales y cinematográficos.
- `ui-admin` para tablas, filtros, formularios y estados. · Storybook con integración recomendada para Next.js. · Iconos consistentes desde una única familia principal.
### 7.3 Movimiento
- Motion for React como herramienta principal. · `LazyMotion` o carga diferida para reducir JavaScript inicial. · CSS para transiciones simples.
- GSAP únicamente para secuencias que Motion no resuelva claramente. · Lenis condicionado a pruebas de accesibilidad, navegación y rendimiento.
### 7.4 Datos
- Supabase PostgreSQL. · Supabase JS para clientes autorizados. · SQL migrations versionadas.
- Tipos generados desde el esquema. · Zod para validación de entradas y bloques de contenido. · Repositories o servicios para desacoplar UI del origen de datos.
### 7.5 Calidad
- ESLint. · Prettier o formateo equivalente acordado. · Vitest para lógica y validadores.
- Storybook para componentes aislados. · Playwright para E2E y comparación visual. · Axe integrado en pruebas de componentes o E2E.
- Lighthouse CI o medición equivalente para presupuestos públicos.
---
## 8. Design system
### 8.1 Fuente de verdad
El código será la fuente de verdad operativa de tokens. Figma deberá reflejar los mismos nombres semánticos. Toda diferencia entre Figma y código debe registrarse y resolverse. No se mantendrán dos paletas independientes.
### 8.2 Grupos de tokens
- Colores de superficie. · Colores de texto. · Colores de borde.
- Color de acento y estados. · Colores semánticos. · Espaciado.
- Tamaños de container. · Tipografía. · Radios.
- Elevación. · Z-index. · Duraciones.
- Easings. · Distancias de movimiento.
### 8.3 Espaciado
La escala base partirá de múltiplos consistentes. Se permitirá una escala ampliada para heroes y secciones editoriales. Los valores no pertenecientes a la escala requerirán una razón documentada. Los paddings responsive se definirán como tokens o reglas de layout.
### 8.4 Tipografía
- Una familia display. · Una familia body. · Una familia mono solo si cumple un rol informativo real.
- Tamaños fluidos mediante `clamp` donde corresponda. · Longitud máxima de lectura para párrafos. · Tracking definido por rol.
- Line-height más ajustado en titulares grandes. · Fuentes autoalojadas cuando la licencia lo permita.
### 8.5 Color
- Canvas cálido o neutral definido tras auditoría. · Superficie oscura para momentos cinematográficos. · Near-black en lugar de negro absoluto cuando mejore la lectura.
- Un acento principal. · Estados success, warning, danger e info reservados al panel. · Contraste WCAG verificado.
### 8.6 Componentes base
- Button. · Link. · IconButton.
- Input. · Textarea. · Select.
- Checkbox. · Radio. · Switch.
- Dialog. · Drawer. · Tooltip.
- DropdownMenu. · Badge. · Avatar.
- Card. · Skeleton. · EmptyState.
- ErrorState. · Toast.
### 8.7 Patrones marketing
- SiteHeader. · SiteMenu. · StatementHero.
- ProjectFeature. · ProjectIndexRow. · HoverProjectPreview.
- ServiceEditorialList. · ManifestoSection. · TeamStory.
- CaseStudyChapter. · MetricGroup. · MediaFrame.
- NextProjectCTA. · ContactPitch. · SiteFooter.
### 8.8 Patrones admin
- AdminShell. · Sidebar. · CommandPalette.
- DataTable. · FilterBar. · StatCard.
- StatusBadge. · DetailHeader. · FormSection.
- Timeline. · ActivityFeed. · DateRangePicker.
- MoneyField. · CurrencyBadge. · ConfirmActionDialog.
### 8.9 Estados obligatorios
Cada componente interactivo debe documentar:
- Default. · Hover. · Focus-visible.
- Active. · Disabled. · Loading.
- Error cuando corresponda. · Reduced motion cuando corresponda.
---
## 9. Arquitectura de contenido público
### 9.1 Home
- Navegación mínima. · Hero declarativo. · Proyectos seleccionados.
- Posicionamiento o manifiesto. · Servicios y capacidades. · Método de trabajo.
- Presentación de Máximo y Daniel. · Evidencia o testimonios reales. · CTA de contacto.
- Footer editorial.
### 9.2 Índice de proyectos
- Curaduría prioritaria sobre cantidad. · Filtros opcionales sin bloquear navegación. · Metadata visible: año, categoría y servicio.
- Preview enriquecido en dispositivos con hover. · Alternativa táctil completa. · Estado vacío controlado.
### 9.3 Caso de estudio
- Hero del proyecto. · Resumen ejecutivo. · Cliente y contexto.
- Problema. · Objetivos. · Restricciones.
- Proceso. · Dirección de diseño. · Decisiones de arquitectura.
- Implementación. · Resultados verificables. · Aprendizajes.
- Créditos. · Próximo proyecto.
### 9.4 Estudio
- Historia de la colaboración. · Relación Uruguay–España. · Perfiles individuales.
- Filosofía de trabajo. · Servicios. · Capacidades técnicas.
- Proceso comercial y de entrega. · CTA.
### 9.5 Contacto
- Nombre. · Email. · Empresa opcional.
- Tipo de proyecto. · Mensaje. · Presupuesto orientativo opcional.
- Fecha deseada opcional. · Consentimiento requerido. · Estado de envío.
- Protección antispam y rate limit.
### 9.6 Internacionalización
La arquitectura no bloqueará una futura versión bilingüe. El lanzamiento puede utilizar un único idioma hasta que exista contenido revisado. No se duplicará contenido automáticamente con traducciones sin revisión. La estrategia final de idioma se decide antes del PR de copy y SEO.
---
## 10. Modelo de datos
### 10.1 Convenciones
- IDs UUID. · `created_at` y `updated_at` en UTC. · Soft delete solo donde el historial lo justifique.
- Importes almacenados en unidades menores enteras. · Moneda en código ISO 4217. · Fechas de vencimiento como `date` cuando no requieren hora.
- Slugs únicos y normalizados. · Campos auditables con usuario responsable.
### 10.2 Tablas de identidad y workspace
- `profiles`. · `organizations`. · `organization_members`.
- `role_permissions` si el modelo fijo deja de ser suficiente.
### 10.3 Tablas comerciales
- `clients`. · `client_contacts`. · `leads` opcional en una fase posterior.
- `services`. · `project_services`.
### 10.4 Tablas de proyectos
- `projects`. · `project_members`. · `project_stages`.
- `project_status_history`. · `project_links`. · `tasks`.
- `task_comments`. · `notes`. · `documents`.
### 10.5 Tablas financieras
- `invoices`. · `invoice_items`. · `payments`.
- `recurring_charges`. · `payment_documents` o referencia en `documents`.
### 10.6 Tablas del portfolio
- `portfolio_projects`. · `case_study_sections`. · `technologies`.
- `portfolio_project_technologies`. · `testimonials`. · `media_assets`.
### 10.7 Tablas operativas
- `contact_submissions`. · `notifications`. · `activity_events`.
- `audit_events` para acciones sensibles.
### 10.8 Bloques de caso de estudio
`case_study_sections` utilizará:
- `kind` controlado por enum o catálogo. · `position` numérica. · `content` JSONB validado.
- `schema_version`. · `is_visible`.
Tipos iniciales de bloque:
- `rich_text`. · `full_bleed_media`. · `media_grid`.
- `before_after`. · `quote`. · `metrics`.
- `technical_architecture`. · `process_steps`. · `credits`.
### 10.9 Estados principales
#### Proyecto
- `proposal`. · `approved`. · `planning`.
- `design`. · `development`. · `review`.
- `delivered`. · `maintenance`. · `archived`.
#### Tarea
- `backlog`. · `todo`. · `in_progress`.
- `review`. · `done`. · `cancelled`.
#### Factura
- `draft`. · `issued`. · `partial`.
- `paid`. · `overdue`. · `void`.
#### Portfolio
- `draft`. · `review`. · `scheduled`.
- `published`. · `archived`.
---
## 11. Seguridad y privacidad
### 11.1 Reglas fundamentales
- RLS activado en toda tabla expuesta por Data API. · Política deny-by-default. · Publishable key permitida en clientes cuando RLS protege los datos.
- Secret key o service role solo en servidor seguro. · Nunca registrar secretos en logs. · Nunca mostrar errores internos completos al usuario final.
- Validación en servidor para toda mutación. · Sanitización o render seguro de contenido enriquecido.
### 11.2 Sesiones
- Cookies seguras gestionadas según la integración oficial. · Redirección segura después de login. · Caducidad y renovación controladas.
- Logout invalida la sesión visible. · Acceso admin bloqueado si no existe membresía activa.
### 11.3 Storage
- Buckets separados por finalidad cuando mejore las políticas. · Portfolio publicado puede usar assets públicos optimizados. · Documentos de clientes deben permanecer privados.
- Rutas de storage incluirán organización y entidad. · Descargas privadas mediante autorización o URL firmada. · Tipos MIME y tamaño máximo validados.
### 11.4 Auditoría
Se registrarán como mínimo:
- Inicio de sesión relevante. · Cambio de rol. · Creación o eliminación de cliente.
- Cambio de estado de proyecto. · Publicación o despublicación. · Creación, anulación o marcado de pago.
- Eliminación de documentos. · Cambio de configuración sensible.
### 11.5 Datos que no deben almacenarse
- Números completos de tarjeta. · Contraseñas de clientes. · Tokens de acceso en texto plano.
- Secretos de infraestructura en notas. · Documentos personales sin necesidad operativa. · Datos financieros no requeridos para seguimiento.
---
## 12. Rendimiento y accesibilidad
### 12.1 Objetivos públicos
- LCP p75 ≤ 2,5 s. · INP p75 ≤ 200 ms. · CLS p75 ≤ 0,1.
- Navegación utilizable sin JavaScript para contenido esencial cuando sea razonable. · Imágenes responsive y formatos modernos. · Fuentes optimizadas y sin bloqueos innecesarios.
- Motion cargado solo en rutas o componentes que lo necesitan.
### 12.2 Presupuestos internos
- Cada PR visual debe reportar cambio de peso significativo. · El hero no debe obligar a descargar vídeo pesado en móvil. · Assets below-the-fold deben ser lazy.
- Un efecto nuevo no puede degradar métricas sin una decisión explícita. · Se establecerá baseline de JavaScript en la fase de foundations. · Regresiones superiores al 10 % requieren revisión.
### 12.3 Accesibilidad
- HTML semántico. · Orden lógico de encabezados. · Navegación completa por teclado.
- Focus visible. · Contraste verificado. · Texto alternativo contextual.
- Formularios con labels y mensajes asociados. · Anuncios accesibles de éxito y error. · Modales con foco controlado.
- Reduced motion completo. · Touch targets adecuados. · Sin contenido esencial solo en hover.
### 12.4 Admin
- Tablas navegables y legibles. · Acciones destructivas confirmadas. · Estados de carga y error explícitos.
- Formularios conservan datos ante errores recuperables. · Fechas y monedas muestran locale sin alterar el valor almacenado.
---
## 13. Estrategia de pruebas
### 13.1 Pirámide
- Validadores y utilidades con pruebas unitarias. · Componentes críticos con pruebas de interacción. · Flujos completos con Playwright.
- Capturas visuales para páginas y componentes seleccionados. · SQL y RLS con pruebas específicas.
### 13.2 E2E públicos
- Navegación principal. · Índice de proyectos. · Apertura de un caso.
- Envío válido de contacto. · Validación de contacto inválido. · Metadata y rutas canónicas básicas.
- Comportamiento reduced motion.
### 13.3 E2E admin
- Login permitido. · Login rechazado. · Crear y editar cliente.
- Crear proyecto. · Cambiar estado. · Crear tarea.
- Publicar caso de estudio. · Registrar pago parcial. · Bloquear acción sin permiso.
### 13.4 Regresión visual
- Home desktop y móvil. · Índice de proyectos. · Caso de estudio representativo.
- Header y menú. · Componentes core. · Dashboard admin.
- Formularios principales. · Diffs revisados, nunca aceptados automáticamente.
---
## 14. Observabilidad y operación
### 14.1 Logs
- Logs estructurados en operaciones del servidor. · Identificador de request o correlación cuando sea útil. · Sin PII innecesaria.
- Errores técnicos completos solo en observabilidad privada. · Mensajes públicos claros y no técnicos.
### 14.2 Métricas
- Web Vitals reales. · Errores de formulario. · Tasa de contacto completado.
- Rutas públicas más visitadas. · Consultas lentas relevantes. · Fallos de autenticación anómalos.
### 14.3 Backups y recuperación
- Migraciones versionadas desde el primer cambio. · Seed sin datos sensibles. · Runbook de restauración.
- Exportación periódica al pasar a operación real. · Plan de pago con backups automáticos antes de depender del sistema para cobros.
---
## 15. Decisiones de arquitectura
### ADR-001 — Monorepo único
**Decisión:** un repositorio con múltiples apps y paquetes. **Razón:** compartir tipos, tokens, validación, migraciones y componentes. **Consecuencia:** los límites entre apps deben mantenerse explícitos.
### ADR-002 — Dos proyectos Vercel
**Decisión:** `web` y `admin` se despliegan por separado. **Razón:** independencia de dominio, variables, build y evolución. **Consecuencia:** cada proyecto configura su Root Directory.
### ADR-003 — Supabase como backend inicial
**Decisión:** Postgres, Auth y Storage sobre Supabase. **Razón:** dominio relacional y necesidad de permisos por fila. **Consecuencia:** RLS y migraciones forman parte del producto, no de una fase opcional.
### ADR-004 — Sin API dedicada inicial
**Decisión:** usar capacidades de Next.js y Supabase antes de crear otro servicio. **Razón:** reducir complejidad operativa prematura. **Consecuencia:** se documentan disparadores concretos para extraer API o workers.
### ADR-005 — Design system antes de páginas
**Decisión:** foundations y componentes core preceden a la home final. **Razón:** evitar una suma de templates y valores improvisados. **Consecuencia:** el primer avance visible puede parecer más lento, pero reduce retrabajo.
### ADR-006 — Frontend-first, data-aware
**Decisión:** construir la web pública con fixtures tipados y contratos reales. **Razón:** avanzar visualmente sin acoplarse a objetos temporales. **Consecuencia:** el origen se sustituye por Supabase sin reescribir la UI.
### ADR-007 — Figma como referencia, no código final
**Decisión:** MCP aporta contexto; el repositorio define arquitectura. **Razón:** fidelidad visual no garantiza mantenibilidad. **Consecuencia:** cada implementación Figma debe pasar por componentes y tokens existentes.
### ADR-008 — Contenido flexible y validado
**Decisión:** metadata relacional más bloques JSONB versionados para casos. **Razón:** permitir narrativa variada sin crear una tabla por composición. **Consecuencia:** cada tipo de bloque requiere schema Zod y renderer controlado.
### ADR-009 — Finanzas como seguimiento
**Decisión:** registrar cuentas por cobrar, no procesar pagos. **Razón:** el objetivo es operación y visibilidad, no sustituir contabilidad. **Consecuencia:** se almacenan importes, estados y comprobantes, nunca tarjetas.
### ADR-010 — Calidad visual automatizada
**Decisión:** Storybook y Playwright forman parte del flujo. **Razón:** un frontend ambicioso necesita detectar regresiones. **Consecuencia:** los PR visuales incluyen evidencia y capturas.
---
## 16. Estrategia de ramas y PR
- Rama principal protegida. · Un PR por unidad coherente de entrega. · PRs pequeños frente a “construir toda la web”.
- Preview de Vercel obligatorio cuando el cambio es visible. · Migraciones revisables y reversibles cuando sea posible. · Descripción de PR con alcance, pruebas, capturas y riesgos.
- No mezclar refactor amplio con feature salvo necesidad documentada. · Los PRs de Figma indicarán archivo, nodo y decisiones de adaptación.
### 16.1 Plantilla mínima de PR
- Objetivo. · Problema resuelto. · Alcance incluido.
- Fuera de alcance. · Capturas o vídeo. · Rutas afectadas.
- Migraciones. · Pruebas ejecutadas. · Métricas de rendimiento cuando aplique.
- Riesgos y rollback.
---
## 17. Fases y pull requests
### Fase 0 — Descubrimiento y contrato
#### PR-001 — Bootstrap documental y decisiones base
- Crear estructura inicial de `docs/sdd`, `docs/adr` y `docs/runbooks`. · Guardar este SDD dentro del repositorio. · Registrar ADR-001 a ADR-010 como documentos separados.
- Definir owners técnicos y proceso de aprobación. · Documentar nombre técnico provisional y variables pendientes. · Añadir plantilla de PR e issue.
- Configurar protección conceptual de rama principal. · Criterio: toda decisión estructural importante tiene ADR. · Fuera: instalación completa del stack.
- Dependencias: ninguna.
#### PR-002 — Inventario de marca, contenido y licencias
- Inventariar templates, tipografías, imágenes, vídeos y texturas. · Verificar licencia comercial del pack y assets incluidos. · Definir qué proyectos reales pueden publicarse.
- Registrar qué materiales requieren permiso de cliente. · Definir idioma inicial y estrategia futura. · Crear matriz de contenido faltante.
- Identificar testimonios reales disponibles. · Criterio: ningún asset dudoso llega a producción. · Fuera: diseño final.
- Dependencias: PR-001.
#### PR-003 — Auditoría Figma MCP de referencias
- Conectar el servidor remoto de Figma MCP en el entorno autorizado. · Consultar los ocho nodos Arkkhe inventariados. · Consultar los templates prioritarios disponibles.
- Extraer layout, tokens, tipografía y assets relevantes. · Crear capturas comparables. · Completar matriz de puntuación.
- Seleccionar patrones y rechazar explícitamente los restantes. · Criterio: cada patrón elegido tiene justificación y fuente. · Fuera: código de producción de la home.
- Dependencias: PR-002 y acceso Figma.
#### PR-004 — Dirección artística v1
- Crear moodboard y principios de marca. · Definir balance entre superficies cálidas y oscuras. · Elegir combinación tipográfica preliminar.
- Definir acento y rango neutral preliminar. · Diseñar wireframe de home, work, case, studio y contact. · Crear motion storyboard de los momentos principales.
- Validar que la narrativa funciona sin animación. · Criterio: dirección aprobada por Máximo y Daniel. · Fuera: pixel-perfect final de todas las páginas.
- Dependencias: PR-003.
### Fase 1 — Fundación técnica
#### PR-005 — Monorepo y toolchain
- Inicializar pnpm workspace y Turborepo. · Crear `apps/web` y `apps/admin`. · Crear paquetes compartidos mínimos.
- Configurar TypeScript strict. · Configurar lint, format y scripts comunes. · Definir variables de entorno con ejemplos seguros.
- Configurar checks de CI básicos. · Criterio: ambas apps compilan desde raíz. · Fuera: UI final.
- Dependencias: PR-001.
#### PR-006 — Design tokens foundation
- Implementar tokens semánticos de color. · Implementar escalas de espacio y container. · Implementar tipo, radios, sombras y z-index.
- Implementar tokens de motion. · Exponer tokens a Tailwind y CSS. · Crear página de inspección interna.
- Evitar valores mágicos en componentes nuevos. · Criterio: tokens documentados y consumibles por ambas apps. · Fuera: elección irreversible de branding si aún está pendiente.
- Dependencias: PR-004 y PR-005.
#### PR-007 — UI Core accesible
- Construir Button, Link e IconButton. · Construir inputs y controles de formulario. · Construir Dialog, Drawer, Tooltip y Dropdown.
- Construir Badge, Avatar, Card y estados. · Documentar variantes y estados. · Agregar focus-visible y reduced motion.
- Crear historias Storybook. · Criterio: componentes pasan interacción y a11y. · Fuera: patterns específicos de marketing o admin.
- Dependencias: PR-006.
#### PR-008 — Testing y previews
- Configurar Vitest. · Configurar Storybook recomendado para Next.js. · Configurar Playwright en tres motores principales cuando CI lo permita.
- Crear baseline de snapshots visuales. · Configurar preview de ambas apps en Vercel. · Añadir reporte de pruebas en CI.
- Definir convención para actualizar snapshots. · Criterio: fallo de prueba bloquea merge. · Fuera: cobertura total.
- Dependencias: PR-005 y PR-007.
### Fase 2 — Web pública
#### PR-009 — App shell, navegación y footer
- Implementar layout global público. · Implementar skip link y landmarks. · Implementar header desktop y móvil.
- Implementar menú accesible. · Implementar footer editorial. · Añadir metadata base y favicon temporal.
- Crear snapshots responsive. · Criterio: navegación completa con teclado. · Fuera: hero y contenido final.
- Dependencias: PR-007 y PR-008.
#### PR-010 — Hero de la home
- Leer nuevamente el nodo Figma aprobado. · Describir la composición antes de implementar. · Construir StatementHero con tokens propios.
- Implementar media adaptable y fallback. · Añadir entrada cinemática controlada. · Añadir reduced motion.
- Medir LCP y JavaScript. · Criterio: fidelidad aprobada sin copiar arquitectura del template. · Fuera: otras secciones de home.
- Dependencias: PR-004 y PR-009.
#### PR-011 — Selected work en home
- Crear fixtures tipados de proyectos. · Implementar proyectos destacados full-bleed o editoriales. · Implementar hover preview solo donde exista hover real.
- Crear alternativa táctil. · Añadir metadata mínima. · Optimizar imágenes.
- Añadir navegación hacia casos. · Criterio: cada proyecto comunica problema y categoría. · Fuera: CMS real.
- Dependencias: PR-010.
#### PR-012 — Servicios, método y manifiesto
- Implementar lista editorial de servicios. · Implementar método de trabajo. · Incorporar sección de manifiesto.
- Usar scroll pinning solo si mejora comprensión. · Garantizar versión móvil lineal. · Mantener copy orientado a resultados.
- Añadir motion narrativo secundario. · Criterio: servicios se entienden sin jerga. · Fuera: pricing rígido.
- Dependencias: PR-011.
#### PR-013 — Equipo, confianza y CTA
- Implementar historia Máximo–Daniel. · Representar Uruguay–España sin clichés visuales. · Añadir capacidades individuales y complementarias.
- Incorporar testimonios solo si son reales. · Construir CTA final. · Conectar contacto.
- Cerrar ritmo visual de home. · Criterio: la home tiene narrativa completa. · Fuera: página Studio detallada.
- Dependencias: PR-012.
#### PR-014 — Índice de proyectos
- Crear ruta `/work`. · Implementar listado curatorial. · Añadir filtros si aportan valor con el volumen real.
- Definir interacción desktop y touch. · Implementar estados vacío y error. · Añadir metadata y canonical.
- Crear snapshots de diferentes cantidades. · Criterio: listado usable con 1, 4 y 12 proyectos. · Fuera: búsqueda avanzada.
- Dependencias: PR-011.
#### PR-015 — Plantilla de caso de estudio
- Crear ruta `/work/[slug]`. · Implementar hero y metadata. · Construir renderers de bloques tipados.
- Implementar sticky narrative con fallback. · Implementar métricas y citas. · Implementar arquitectura técnica visualizable.
- Crear next-project CTA. · Criterio: un caso completo funciona sin datos remotos. · Fuera: editor admin.
- Dependencias: PR-014.
#### PR-016 — Studio y contacto
- Crear `/studio`. · Crear `/contact`. · Implementar formulario validado en cliente y servidor.
- Añadir rate limiting o protección equivalente. · Implementar estados de éxito y error. · Añadir páginas legales placeholder marcadas para revisión.
- Evitar mensajes técnicos visibles. · Criterio: consulta válida llega al destino configurado. · Fuera: CRM automático.
- Dependencias: PR-013.
### Fase 3 — Calidad y lanzamiento público
#### PR-017 — Copy, SEO y contenido real
- Sustituir placeholders por contenido revisado. · Definir títulos y descripciones por ruta. · Añadir Open Graph y social images.
- Implementar sitemap y robots. · Añadir JSON-LD adecuado sin datos inventados. · Revisar slugs y redirects.
- Validar permisos de publicación de clientes. · Criterio: no quedan claims ni testimonios ficticios. · Fuera: estrategia editorial continua.
- Dependencias: PR-015 y PR-016.
#### PR-018 — Accesibilidad y reduced motion audit
- Auditar teclado en todas las rutas. · Auditar contraste. · Auditar semántica y headings.
- Auditar formularios y mensajes. · Verificar screen reader en flujos principales. · Verificar reduced motion.
- Corregir hover-only y focus traps. · Criterio: cero violaciones críticas conocidas. · Fuera: certificación externa.
- Dependencias: PR-017.
#### PR-019 — Performance hardening
- Medir Core Web Vitals en previews. · Optimizar hero media. · Aplicar LazyMotion o carga diferida.
- Reducir Client Components. · Optimizar fuentes e imágenes. · Revisar third-party scripts.
- Establecer baseline y presupuestos. · Criterio: objetivos de sección 12 cumplidos o excepción registrada. · Fuera: optimizaciones especulativas sin medición.
- Dependencias: PR-018.
#### PR-020 — Release web v1
- Configurar dominio público. · Configurar variables de producción. · Revisar analytics y consentimiento.
- Ejecutar smoke tests. · Verificar enlaces, sitemap y formularios. · Crear runbook de rollback.
- Marcar release y changelog. · Criterio: checklist de producción firmado. · Fuera: panel admin público.
- Dependencias: PR-019.
### Fase 4 — Persistencia y CMS
#### PR-021 — Supabase local y esquema base
- Inicializar Supabase CLI. · Crear migraciones de identidad y organización. · Crear tablas de portfolio y media.
- Crear enums y constraints. · Crear seed no sensible. · Generar tipos TypeScript.
- Documentar reset local. · Criterio: esquema reproducible desde cero. · Fuera: tablas financieras completas.
- Dependencias: PR-005.
#### PR-022 — RLS, Auth y Storage
- Configurar Supabase Auth. · Crear membership y roles. · Activar RLS.
- Crear políticas mínimas. · Crear buckets públicos y privados. · Crear pruebas de acceso permitido y denegado.
- Asegurar que secretos no llegan al navegador. · Criterio: usuario no miembro no obtiene datos privados. · Fuera: UI admin completa.
- Dependencias: PR-021.
#### PR-023 — Repositories y sustitución de fixtures
- Crear contratos de lectura de portfolio. · Implementar repository local para tests. · Implementar repository Supabase.
- Cambiar web pública al origen real. · Aplicar caché y revalidación. · Garantizar solo contenido publicado.
- Mantener tipos compatibles. · Criterio: no cambia la UI al cambiar el origen. · Fuera: edición desde admin.
- Dependencias: PR-022.
### Fase 5 — Admin core
#### PR-024 — Login y AdminShell
- Crear login privado. · Crear middleware o guard adecuado. · Implementar AdminShell.
- Implementar sidebar y navegación móvil. · Añadir estado de sesión. · Añadir logout.
- Crear páginas 403 y estados seguros. · Criterio: ruta admin no expone contenido sin autorización. · Fuera: módulos de negocio.
- Dependencias: PR-022.
#### PR-025 — Dashboard operativo
- Crear métricas de proyectos activos. · Mostrar vencimientos próximos. · Mostrar tareas que requieren atención.
- Mostrar cobros solo cuando el esquema exista. · Crear activity feed. · Implementar estados vacíos.
- Evitar métricas decorativas. · Criterio: cada tarjeta responde a una acción. · Fuera: analytics complejo.
- Dependencias: PR-024.
#### PR-026 — Clientes y contactos
- Crear tablas y migraciones comerciales necesarias. · Implementar listado y filtros. · Implementar alta y edición.
- Implementar detalle de cliente. · Vincular contactos. · Añadir proyectos relacionados.
- Registrar actividad. · Criterio: CRUD respeta organización y permisos. · Fuera: automatización de leads.
- Dependencias: PR-024.
#### PR-027 — Proyectos y etapas
- Crear listado de proyectos. · Crear detalle y edición. · Implementar estados y transiciones válidas.
- Asignar miembros. · Vincular servicios y enlaces. · Registrar historial de estado.
- Añadir fechas y prioridad. · Criterio: proyecto conserva historial relevante. · Fuera: gantt avanzado.
- Dependencias: PR-026.
#### PR-028 — Tareas, notas y documentos
- Implementar tareas por proyecto. · Implementar responsables y vencimientos. · Implementar notas internas.
- Implementar subida privada de documentos. · Validar tamaño y MIME. · Añadir URLs firmadas.
- Registrar acciones destructivas. · Criterio: documentos privados no son públicos por URL estable. · Fuera: edición colaborativa.
- Dependencias: PR-027.
#### PR-029 — CMS de portfolio
- Crear editor de metadata del proyecto público. · Crear editor ordenado de bloques. · Implementar draft y review.
- Implementar preview privado. · Implementar publicación y despublicación. · Gestionar tecnologías y media.
- Validar schema de bloques. · Criterio: un caso se publica sin editar código. · Fuera: editor WYSIWYG universal.
- Dependencias: PR-023 y PR-028.
### Fase 6 — Finanzas operativas
#### PR-030 — Esquema financiero
- Crear invoices, items, payments y recurring charges. · Usar amount_minor y currency. · Definir constraints de pagos parciales.
- Definir cálculo de saldo. · Crear políticas RLS financieras. · Crear datos seed de ejemplo.
- Añadir pruebas SQL. · Criterio: saldos consistentes ante pagos parciales. · Fuera: contabilidad fiscal.
- Dependencias: PR-026.
#### PR-031 — UI de cobros
- Crear listado de cuentas por cobrar. · Crear detalle de factura. · Registrar emisión y vencimiento.
- Registrar pagos. · Mostrar saldo y estado derivado. · Adjuntar comprobante.
- Filtrar por moneda y estado. · Criterio: no se mezclan monedas en totales sin indicarlo. · Fuera: conversión contable automática.
- Dependencias: PR-030.
#### PR-032 — Dashboard financiero y recurrencias
- Mostrar vencidos y próximos vencimientos. · Mostrar previsión por moneda. · Crear cargos recurrentes.
- Generar instancias sin duplicados. · Añadir alertas internas. · Implementar permisos financieros.
- Añadir exportación básica CSV si aporta valor. · Criterio: owner detecta qué cobrar y cuándo. · Fuera: facturación electrónica oficial.
- Dependencias: PR-031.
### Fase 7 — Integraciones y expansión
#### PR-033 — Notificaciones y jobs
- Definir mecanismo de tareas programadas. · Crear notificaciones internas idempotentes. · Notificar vencimientos próximos.
- Evitar mensajes duplicados. · Registrar ejecución y error. · Añadir preferencias básicas.
- Criterio: reintento no duplica efectos. · Fuera: múltiples canales antes de validar uno. · Dependencias: PR-032.
#### PR-034 — Google Workspace integrations
- Evaluar OAuth y scopes mínimos. · Crear eventos opcionales de Calendar. · Vincular carpetas de Drive.
- Preparar recordatorios por Gmail o proveedor elegido. · Guardar referencias, no secretos visibles. · Añadir revocación y manejo de expiración.
- Documentar límites y soporte. · Criterio: cada integración puede desactivarse. · Fuera: automatización total sin supervisión.
- Dependencias: PR-033.
#### PR-035 — Evaluación de portal de cliente
- Validar necesidad con clientes reales. · Definir información visible. · Diseñar permisos externos separados.
- Prototipar entregables y feedback. · Evaluar dominio o ruta. · Crear ADR go/no-go.
- No implementar si el uso esperado es bajo. · Criterio: decisión respaldada por evidencia. · Fuera: construcción automática del portal.
- Dependencias: uso real del admin.
---
## 18. Gates de salida por fase
### Gate Fase 0
- Dirección visual aprobada. · Licencias críticas identificadas. · Referencias Figma auditadas.
- Decisiones abiertas registradas.
### Gate Fase 1
- Monorepo estable. · Dos apps compilables. · Tokens disponibles.
- UI Core documentada. · CI y previews funcionando.
### Gate Fase 2
- Todas las rutas públicas implementadas. · Home narrativa completa. · Caso de estudio representativo.
- Contacto funcional. · Datos todavía pueden ser fixtures tipados.
### Gate Fase 3
- Contenido real. · Auditoría de accesibilidad. · Presupuestos de rendimiento.
- Dominio y release web v1.
### Gate Fase 4
- Esquema reproducible. · RLS probado. · Portfolio público desde Supabase.
- Storage separado por sensibilidad.
### Gate Fase 5
- Operación básica de clientes y proyectos. · CMS sin cambios manuales de código. · Documentos privados.
- Auditoría de acciones críticas.
### Gate Fase 6
- Cobros y pagos parciales consistentes. · Visibilidad por moneda. · Recurrencias idempotentes.
- Permisos financieros.
### Gate Fase 7
- Integraciones justificadas por uso real. · Jobs observables y reintentables. · Portal decidido por evidencia.
---
## 19. Definition of Done global
Un PR no está terminado solo porque compila. Para considerarse terminado debe cumplir, cuando aplique:
- Alcance del PR completo. · TypeScript sin errores. · Lint y format aprobados.
- Pruebas relevantes aprobadas. · Capturas desktop y móvil. · Navegación por teclado revisada.
- Reduced motion revisado. · Estados loading, empty y error. · Sin secretos ni variables expuestas.
- Migraciones versionadas. · RLS revisado. · Preview de Vercel disponible.
- Copy sin notas internas. · Sin mensajes técnicos visibles al usuario. · Documentación actualizada.
- Riesgos y decisiones no resueltas declarados.
---
## 20. Riesgos y mitigaciones
### R-001 — Mezcla de templates
**Riesgo:** identidad fragmentada. **Mitigación:** reconstrucción mediante tokens y auditoría de dirección artística.
### R-002 — Exceso de movimiento
**Riesgo:** peor rendimiento, accesibilidad y claridad. **Mitigación:** presupuesto cinematográfico, reduced motion y revisión por PR.
### R-003 — Dependencia del código generado
**Riesgo:** componentes duplicados y arquitectura inconsistente. **Mitigación:** reglas MCP, una sección por vez y revisión de paquetes existentes.
### R-004 — Construir admin demasiado pronto
**Riesgo:** retrasar la web pública y diseñar módulos sin uso real. **Mitigación:** frontend público primero y fases backend posteriores.
### R-005 — Diseñar con fixtures incompatibles
**Riesgo:** reescribir la UI al conectar Supabase. **Mitigación:** contratos, tipos y repository pattern desde la fase pública.
### R-006 — Políticas RLS incompletas
**Riesgo:** exposición o bloqueo accidental de datos. **Mitigación:** deny-by-default, tests de acceso y revisión por tabla.
### R-007 — Datos financieros tratados como contabilidad
**Riesgo:** confianza excesiva o errores regulatorios. **Mitigación:** posicionar el módulo como seguimiento operativo y exportable.
### R-008 — Falta de contenido real
**Riesgo:** diseño atractivo con narrativa vacía. **Mitigación:** inventario temprano, casos seleccionados y claims verificables.
### R-009 — Assets sin licencia clara
**Riesgo:** reclamaciones o reemplazos tardíos. **Mitigación:** PR específico de licencia antes de producción.
### R-010 — Monorepo sin límites
**Riesgo:** dependencias circulares y builds innecesarios. **Mitigación:** reglas de importación, packages por responsabilidad y Turbo filters.
### R-011 — Costes de infraestructura
**Riesgo:** pasar a planes pagos sin criterio. **Mitigación:** presupuestos, observabilidad y upgrade cuando el sistema sea operativo.
### R-012 — Sobrearquitectura
**Riesgo:** API, workers o multi-tenancy complejos sin demanda. **Mitigación:** ADR y disparadores objetivos antes de extraer servicios.
---
## 21. Decisiones pendientes no bloqueantes
- Nombre comercial del estudio. · Dominio principal. · Idioma de lanzamiento.
- Tipografía display definitiva. · Tipografía body definitiva. · Paleta final.
- Hero seleccionado o composición híbrida. · Lista inicial de proyectos publicados. · Permisos de publicación de clientes.
- Proveedor de email transaccional. · Proveedor de analytics. · Nivel de consentimiento requerido.
- Estructura legal de facturación. · Numeración de documentos financieros. · Política de backups al entrar en producción.
Cada decisión se asignará al PR más temprano que la necesite. No deben bloquear el bootstrap técnico cuando exista una alternativa provisional segura.
---
## 22. Criterios para crear servicios adicionales
Se puede proponer `apps/api` o `apps/worker` si se cumple al menos uno:
- El proceso excede límites razonables de request. · Se necesita cola y reintento robusto. · Existen varios consumidores externos.
- Se procesan archivos de forma intensiva. · Hay webhooks que requieren aislamiento. · Las dependencias del proceso degradan las apps Next.js.
- La observabilidad exige un runtime separado.
La propuesta debe incluir:
- Problema medido. · Alternativas descartadas. · Coste operativo.
- Modelo de despliegue. · Seguridad. · Rollback.
- ADR aprobado.
---
## 23. Estrategia de lanzamiento
### 23.1 Lanzamiento público
- Publicar primero la web con contenido real mínimo de alta calidad. · Priorizar pocos casos completos frente a muchas miniaturas. · Mantener proyectos adicionales como borradores.
- Recoger feedback de clientes y contactos. · Medir formularios y navegación, no vanity metrics únicamente.
### 23.2 Adopción del panel
- Empezar con los proyectos activos reales. · Evitar migrar información histórica sin uso. · Definir una rutina semanal de actualización.
- Registrar cobros futuros antes de importar años anteriores. · Ajustar estados según comportamiento real de Máximo y Daniel.
### 23.3 Criterio de éxito temprano
- La web explica claramente qué hacen y cómo trabajan. · Un visitante puede evaluar al menos dos casos. · El contacto funciona de extremo a extremo.
- Máximo y Daniel consultan el panel para decidir acciones. · Los vencimientos relevantes dejan de depender de memoria. · Publicar un nuevo caso no requiere tocar código.
---
## 24. Fuentes normativas y documentación técnica
### Material proporcionado
- The Design System Blueprint. · Kit: Cinematic Websites with AI. · Course: From Figma to Live Website — with Claude's MCP.
- GRIGOLETTO Templates Pack — 39 templates. · Enlaces Figma Arkkhe proporcionados por Máximo.
### Documentación oficial
- Next.js App Router: https://nextjs.org/docs/app · Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components · Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Vercel Monorepos: https://vercel.com/docs/monorepos · Vercel Turborepo: https://vercel.com/docs/monorepos/turborepo · Supabase Docs: https://supabase.com/docs
- Supabase Secure Data: https://supabase.com/docs/guides/database/secure-data · Figma MCP: https://developers.figma.com/docs/figma-mcp-server/ · Figma MCP Tools: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/
- Figma MCP Custom Rules: https://developers.figma.com/docs/figma-mcp-server/add-custom-rules/ · Motion for React: https://motion.dev/docs/react · Motion LazyMotion: https://motion.dev/docs/react-lazy-motion
- Playwright: https://playwright.dev/docs/intro · Playwright Visual Comparisons: https://playwright.dev/docs/test-snapshots · Storybook Next.js Vite: https://storybook.js.org/docs/get-started/frameworks/nextjs-vite
---
## 25. Aprobación
### Aprobaciones requeridas
- Dirección de producto: Máximo y Daniel. · Dirección artística: Máximo y Daniel tras auditoría Figma. · Arquitectura técnica: responsable del repositorio.
- Publicación de casos: owners y permiso del cliente cuando corresponda. · Release de producción: al menos un owner y checks automáticos aprobados.
### Estado de este SDD
Este documento está listo para revisión de alcance. La implementación puede comenzar por PR-001 y PR-005 en paralelo controlado. PR-003 requiere acceso activo a Figma MCP. PR-010 no debe comenzar hasta aprobar PR-004. Las fases 4 a 7 pueden ajustarse con aprendizaje real sin alterar el contrato del frontend público.
