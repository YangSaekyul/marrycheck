/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f04299", // 우리의 대표 핑크색
      },
      fontFamily: {
        // 기본 폰트를 'Plus Jakarta Sans'로 설정
        display: ["Plus Jakarta Sans", "sans-serif"], 
      },
    },
  },
  plugins: [],
};
