import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
    {
    files: ["src/domain/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["react", "react-dom", "next", "next/*"], message: "Domain is pure TypeScript: no React or Next." },
          { group: ["@/app/*", "@/features/*", "@/infrastructure/*", "@/state/*", "@/shared/ui/*"], message: "Domain only imports Zod and pure utils from @/shared/lib." },
        ],
      }],
    },
  },
  {
    files: ["src/shared/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["@/app/*", "@/features/*", "@/domain/*", "@/infrastructure/*", "@/state/*"], message: "Shared has no business knowledge." },
        ],
      }],
    },
  },
  {
    files: ["src/features/**"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [
          { group: ["@/infrastructure/*"], message: "Features call ports. Only the app wires adapters." },
        ],
      }],
    },
  },
]);

export default eslintConfig;
