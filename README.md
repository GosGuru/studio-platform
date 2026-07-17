# Studio Platform

Monorepo del estudio: web pública (`apps/web`) y panel administrativo (`apps/admin`), con paquetes de configuración compartidos. Contrato técnico en `docs/sdd/SDD_Studio_Platform_v0.2.md` y `docs/adr/`.

## Estructura

```text
studio-platform/
├── apps/
│   ├── web/        # Sitio público (Next.js App Router, puerto 3000)
│   └── admin/      # Panel privado futuro (Next.js App Router, puerto 3001)
├── packages/
│   ├── eslint-config/      # ESLint flat config compartida (@studio/eslint-config)
│   └── typescript-config/  # TypeScript strict compartido (@studio/typescript-config)
├── docs/           # SDD, ADRs, producto y runbooks
└── .github/        # Plantillas y CI
```

## Requisitos

- Node.js >= 22 (fijado en `engines` y `.node-version`).
- pnpm 11 (versión fijada en `packageManager`; con Corepack: `corepack enable`).

## Uso

```bash
pnpm install        # instala todo el workspace
pnpm dev            # ambas apps en modo desarrollo (web:3000, admin:3001)
pnpm build          # build de ambas apps vía Turborepo
pnpm lint           # ESLint en todos los workspaces
pnpm typecheck      # tsc --noEmit en todos los workspaces
pnpm format         # Prettier (escritura)
pnpm format:check   # Prettier (verificación)
```

Para una sola app: `pnpm --filter web dev` o `pnpm --filter admin dev`.

## Variables de entorno

PR-005 no requiere variables. Cada app incluye un `.env.example` con la convención: copiar a `.env.local`, nunca versionar secretos, prefijo `NEXT_PUBLIC_` solo para valores expuestos al navegador. Supabase se incorpora recién en Fase 4.

## CI

`.github/workflows/ci.yml` ejecuta en cada push/PR: instalación con lockfile estricto, lint, typecheck y build.

---

# Paquete de Fase 0 (documental)

Este paquete convierte la Fase 0 del SDD en archivos listos para incorporar al monorepo.

## Incluye
- SDD v0.2.
- ADR-001 a ADR-010.
- Inventario de marca, contenido y licencias.
- Manifiesto y matriz de auditoría Figma.
- Dirección artística preliminar.
- Decisiones abiertas.
- Runbooks iniciales.
- Plantillas de pull request e issue.
- Gate de aceptación de Fase 0.

## Estado real
PR-001 queda documentalmente preparado. PR-002 está estructurado pero necesita evidencia y decisiones. PR-003 necesita Figma MCP. PR-004 tiene una dirección preliminar, no final.
