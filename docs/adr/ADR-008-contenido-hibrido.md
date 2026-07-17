# ADR-008 — Contenido híbrido para casos de estudio

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
Los casos combinarán metadata relacional con bloques JSONB versionados y validados.

## Razón
La narrativa varía entre proyectos, pero los datos clave deben seguir consultables.

## Consecuencias
Cada bloque tendrá schema Zod, versión y renderer explícito.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
