# ADR-010 — Calidad visual automatizada

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
Storybook, Playwright y pruebas de accesibilidad formarán parte del flujo de frontend.

## Razón
La ambición visual aumenta el riesgo de regresiones responsive, de interacción y de accesibilidad.

## Consecuencias
Los PR visuales incluirán previews, capturas comparables y actualización consciente de baselines.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
