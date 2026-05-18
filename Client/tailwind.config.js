export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e1f5ee",
          100: "#9fe1cb",
          500: "#1D9E75",
          600: "#0F6E56",
          700: "#085041",
        },
        danger: { 50: "#FCEBEB", 500: "#E24B4A", 700: "#A32D2D" },
        warning: { 50: "#FAEEDA", 500: "#EF9F27", 700: "#854F0B" },
      },
    },
  },
  plugins: [],
};
