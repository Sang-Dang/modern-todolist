/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  singleQuote: true,
  printWidth: 100,
  proseWrap: "always",
  tabWidth: 4,
  useTabs: false,
  trailingComma: "none",
  bracketSpacing: true,
  jsxBracketSameLine: false,
  semi: false,
};

module.exports = config;
