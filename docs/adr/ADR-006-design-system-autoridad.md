# ADR-006 — Design system como autoridad

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
Los tokens y componentes propios prevalecen sobre templates, prompts y código sugerido por Figma MCP.

## Razón
Evita una web compuesta por decisiones visuales incompatibles.

## Consecuencias
Todo patrón importado se reconstruye con tokens semánticos y componentes del repositorio.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
