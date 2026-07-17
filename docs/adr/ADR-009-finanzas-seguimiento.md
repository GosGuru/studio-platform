# ADR-009 — Finanzas como seguimiento operativo

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
El sistema registrará cuentas por cobrar, pagos, vencimientos y comprobantes; no procesará pagos.

## Razón
El objetivo es visibilidad operativa, no sustituir contabilidad ni custodiar medios de pago.

## Consecuencias
Nunca se almacenarán tarjetas; cualquier integración futura requerirá ADR y proveedor especializado.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
