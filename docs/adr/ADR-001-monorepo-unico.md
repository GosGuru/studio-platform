# ADR-001 — Monorepo único

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
Se utilizará un único repositorio con `apps/web`, `apps/admin` y paquetes compartidos.

## Razón
Evita duplicación de configuración, tipos y componentes, manteniendo despliegues independientes.

## Consecuencias
Ambas aplicaciones se desplegarán como proyectos separados de Vercel apuntando al mismo repositorio.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
