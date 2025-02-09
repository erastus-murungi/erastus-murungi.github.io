/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],

  printWidth: 80,

  tabWidth: 4,

  semi: true,

  singleQuote: true,

  quoteProps: "as-needed",

  jsxSingleQuote: false,

  trailingComma: "es5",

  bracketSpacing: true,

  bracketSameLine: false,

  arrowParens: "always",

  embeddedLanguageFormatting: "auto",
};

export default config;
