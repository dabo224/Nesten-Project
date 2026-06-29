import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

const noUnusedVarsRule = {
  "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
};

export default defineConfig([
  // Fichiers source Node.js
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["**/*.test.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.node } },
    rules: noUnusedVarsRule,
  },
  // Fichiers de test Jest
  {
    files: ["**/*.test.js"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
    rules: noUnusedVarsRule,
  },
]);
