# Runbook — Auditoría de referencias con Figma MCP

## Prerrequisitos
- Acceso legítimo a los archivos.
- Servidor remoto `https://mcp.figma.com/mcp` conectado en el entorno de desarrollo.
- Autorización realizada por el propietario de la cuenta.
- Enlaces de archivo y nodo registrados en `figma-reference-manifest.md`.

## Procedimiento por referencia
1. Abrir el enlace y confirmar que el nodo corresponde al frame esperado.
2. Ejecutar `get_design_context` sobre el nodo exacto.
3. Ejecutar `get_variable_defs`.
4. Obtener captura o representación visual comparable.
5. Registrar layout, tipografía, colores, spacing, componentes y assets.
6. Identificar dependencias o técnicas especiales.
7. Evaluar móvil, teclado, reduced motion y presupuesto de rendimiento.
8. Completar la matriz con evidencia.
9. Marcar `seleccionar`, `adaptar parcialmente` o `rechazar`.
10. Registrar cualquier patrón elegido y el componente propio al que se traducirá.

## Prompt base de lectura
```text
Use the Figma MCP to inspect this exact frame. Before writing code, list:
1) section structure, 2) layout constraints, 3) typography roles, 4) color and spacing variables,
5) reusable components, 6) assets, 7) responsive risks, 8) accessibility risks, and 9) motion implied by the prototype.
Do not generate implementation yet.
```

## Prohibiciones
- No generar toda la web en una sola ejecución.
- No aceptar valores crudos como tokens definitivos.
- No introducir una librería por un efecto aislado sin ADR.
- No subir credenciales o tokens al repositorio.
