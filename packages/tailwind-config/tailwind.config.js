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
    // app content
    `src/**/*.{js,ts,jsx,tsx}`,
    // include packages if not transpiling
    "../../packages/ui/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [],
};
