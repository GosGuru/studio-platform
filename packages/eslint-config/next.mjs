import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * Configuración ESLint compartida para aplicaciones Next.js del monorepo.
 * Basada en la guía oficial de Next.js 16 (flat config, ESLint 9).
 * `next lint` fue eliminado en Next 16: cada app ejecuta `eslint .`.
 */
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
