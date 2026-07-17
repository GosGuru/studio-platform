# ADR-004 — Sin API independiente en v1

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
No se creará `apps/api` ni un servidor Node separado en la primera versión.

## Razón
Route Handlers, Server Functions y Supabase cubren el alcance previsto con menos complejidad.

## Consecuencias
Se abrirá un ADR nuevo si aparecen colas, webhooks complejos, procesos largos o consumidores externos.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
