const tailwindSafeList = require("./tailwind.purge_safelist");
module.exports = {
  purge: {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    options: { safelist: tailwindSafeList },
  },
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code::before": false,
            "code::after": false,

            ul: {
              "li::before": {
                "background-color": "#151515",
              },
            },

            pre: {
              "background-color": "#ffffff",
              "margin-top": "1px",
              "margin-bottom": "1px",
              padding: "10px",
              color: "black",
            },
            p: {
              "margin-top": "0.1rem",
              "margin-bottom": "0.5rem",
            },
            h1: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
            },
            h2: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
            },
            h3: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
            },
            h4: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
            },
            h5: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
              "font-weight": "500",
            },
            h6: {
              "margin-bottom": "0.5rem",
              "margin-top": "0rem",
              "font-weight": "400",
            },
            hr: {
              "border-color": "black",
              "margin-bottom": "2rem",
            },
            img: {
              margin: "0.5rem",
            },
          },
        },
      }),
      spacing: {
        144: "36rem",
        200: "50rem",
      },
      colors: {
        mango: {
          50: "#fbf7f0",
          100: "#fbeede",
          200: "#f9dcb8",
          300: "#f7c07e",
          400: "#f5963f",
          500: "#f56d1e",
          600: "#ea4914",
          700: "#ca3718",
          800: "#a32c1c",
          900: "#83241b",
        },
        "reddit-orange": "#FF5700",
        "twitter-blue": "#1DA1F2",
        "linkedin-blue": "#2867B2",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/line-clamp"),
    // ...
  ],
};
