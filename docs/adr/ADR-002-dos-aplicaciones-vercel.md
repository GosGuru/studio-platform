# ADR-002 — Dos aplicaciones y dos despliegues

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
`apps/web` y `apps/admin` serán aplicaciones independientes con variables, dominios y ciclos de despliegue propios.

## Razón
La web pública y el panel tienen objetivos, carga y riesgo operativo diferentes.

## Consecuencias
Los cambios compartidos pueden disparar ambos builds; se configurarán filtros cuando aporten valor.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
