# ADR-005 — Frontend-first, full-stack-aware

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
La experiencia pública se implementará primero usando fixtures tipados y contratos de datos estables.

## Razón
Permite avanzar visualmente sin diseñar una UI incompatible con el modelo futuro.

## Consecuencias
La sustitución de fixtures por repositorios Supabase no debe exigir reescribir componentes.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
