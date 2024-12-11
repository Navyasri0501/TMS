// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all files in the src folder
  ],
  theme: {
    extend: {
      colors: {
        "trello-blue": "#0079bf",
        "trello-gray": "#ebecf0",
        "trello-dark": "#172b4d",
        "trello-light-gray": "#f4f5f7",
      },
    },
  },
  plugins: [],
};
