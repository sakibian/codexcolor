import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        dataLayer: true,
        gtag: true,
      },
      sourceType: "module",
      ecmaVersion: 2022,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      indent: ["error", 2],
    },
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
];
