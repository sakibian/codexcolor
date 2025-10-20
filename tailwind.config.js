/** @type {import('tailwindcss').Config} */
const fs = require("fs");
const path = require("path");
let primer = null;
try {
  const json5 = require("json5");
  const primerTokensPath = path.join(
    __dirname,
    "node_modules",
    "@primer",
    "primitives",
    "src",
    "tokens",
    "base",
    "color",
    "light",
    "light.json5"
  );
  const primerRaw = fs.readFileSync(primerTokensPath, "utf8");
  primer = json5.parse(primerRaw);
} catch (e) {
  // primer tokens not available; we'll continue with brand palettes only
  primer = null;
}

function extractScale(group) {
  if (
    !primer ||
    !primer.base ||
    !primer.base.color ||
    !primer.base.color[group]
  )
    return undefined;
  const items = primer.base.color[group];
  const out = {};
  Object.keys(items).forEach((k) => {
    const node = items[k];
    if (node && node.$value) out[k] = node.$value;
  });
  return out;
}

const primerNeutral = extractScale("neutral");
const primerBlue = extractScale("blue");

module.exports = {
  content: ["./**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        seasalt: {
          DEFAULT: "#f7f7f7",
          100: "#313131",
          200: "#636363",
          300: "#949494",
          400: "#c6c6c6",
          500: "#f7f7f7",
          600: "#f9f9f9",
          700: "#fafafa",
          800: "#fcfcfc",
          900: "#fdfdfd",
        },
        white: {
          DEFAULT: "#ffffff",
          100: "#333333",
          200: "#666666",
          300: "#999999",
          400: "#cccccc",
          500: "#ffffff",
        },
        fulvous: {
          DEFAULT: "#dd7d1a",
          100: "#2c1805",
          200: "#58310a",
          300: "#83490f",
          400: "#af6215",
          500: "#dd7d1a",
          600: "#e99541",
          700: "#eeaf71",
          800: "#f4caa0",
          900: "#f9e4d0",
        },
        bistre: {
          DEFAULT: "#291b11",
          100: "#080503",
          200: "#100a07",
          300: "#18100a",
          400: "#20150d",
          500: "#291b11",
          600: "#68442b",
          700: "#a86f46",
          800: "#c99e7f",
          900: "#e4cfbf",
        },
        "white-smoke": {
          DEFAULT: "#f4f4f4",
          100: "#313131",
          200: "#626262",
          300: "#939393",
          400: "#c4c4c4",
          500: "#f4f4f4",
        },
        // aliases for existing HTML usage
        primary: { 500: "#f97316", 600: "#dd7d1a" },
        secondary: { 500: "#dd7d1a" },
        accent: { 500: "#291b11" },
        // Primer scales (if available)
        ...(primerNeutral ? { "primer-neutral": primerNeutral } : {}),
        ...(primerBlue ? { "primer-blue": primerBlue } : {}),
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
      minHeight: {
        hero: "80vh",
      },
    },
  },
  plugins: [],
};
