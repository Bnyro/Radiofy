const konstaConfig = require("konsta/config");

const config = {
  konsta: {
    colors: {
      primary: "#ff7aff",
    },
  },

  content: ["./src/**/*.{html,js,svelte,ts}"],

  darkMode: "media",

  theme: {
    extend: {},
  },

  variants: {
    extend: {},
  },

  plugins: [],
};

module.exports = konstaConfig(config);
