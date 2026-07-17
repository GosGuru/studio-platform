# Runbook — Dos proyectos de Vercel desde un monorepo

## Objetivo
Desplegar `apps/web` y `apps/admin` de manera independiente desde el mismo repositorio.

## Configuración esperada
- Proyecto público: Root Directory `apps/web`.
- Proyecto admin: Root Directory `apps/admin`.
- Variables separadas por proyecto y entorno.
- Preview deployments habilitados para pull requests.
- Dominio público y subdominio admin separados.

## Verificación
- Un cambio exclusivo de web no debe romper admin.
- Un cambio exclusivo de admin no debe romper web.
- Un cambio en paquete compartido debe validar ambas aplicaciones.
- Nunca se copiarán valores DNS fijos desde un tutorial; se usarán los registros mostrados por Vercel para el proyecto.
