# ADR-003 — Supabase como backend inicial

**Estado:** Aceptado provisionalmente  
**Fecha:** 17 de julio de 2026  
**Decisores:** Máximo y Daniel Roldán

## Contexto
La plataforma combina una web pública editorial-cinematográfica y un sistema operativo interno. La decisión debe minimizar complejidad accidental sin bloquear crecimiento real.

## Decisión
PostgreSQL, Auth y Storage de Supabase formarán el backend inicial.

## Razón
El modelo es relacional y necesita RLS, autenticación y almacenamiento sin mantener infraestructura propia.

## Consecuencias
Las migraciones SQL y políticas RLS serán parte del repositorio.

## Alternativas consideradas
- Resolverlo de forma distinta por aplicación.
- Posponer la decisión hasta implementación.
- Introducir una capa adicional desde el inicio.

## Revisión
Esta decisión se revisará solo cuando exista evidencia operativa que invalide sus supuestos.
