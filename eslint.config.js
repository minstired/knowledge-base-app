// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import prettier from "eslint-config-prettier";

// export default [
//   {
//     files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
//   },
//   {
//     languageOptions: {
//       globals: globals.browser,
//     },
//   },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
//   prettier,
// ];

import js from "@eslint/js";

export default [
  {
   ignores: ["dist/*"]
  },
  js.configs.recommended,
  {
    rules: {
      // Ваши кастомные правила
      "no-unused-vars": "warn",
      // Другие настройки
    },
    // Дополнительные настройки
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
];

// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
//   { languageOptions: { globals: globals.browser } },
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
//   pluginJs.prettier.configsrecommended,
// ];
