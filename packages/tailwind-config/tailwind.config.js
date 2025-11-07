/** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "../../apps/**/*.{js,ts,jsx,tsx}",
//     "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
//   ],
//   theme: {},
//   plugins: [],
// };


import path from "path";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, "../../apps/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "../../packages/ui/src/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {},
  plugins: [],
};
