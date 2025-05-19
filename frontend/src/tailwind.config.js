import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			// Optional: Add custom colors, fonts, etc.
			colors: {
				primary: {
					DEFAULT: "#3B82F6", // Example: Customize primary color
					dark: "#2563EB",
				},
			},
		},
	},
	plugins: [daisyui],
	daisyui: {
		themes: ["dark", "light", "cupcake"],
		darkTheme: "dark", // Automatically use "dark" theme for dark mode
		base: true, // Apply DaisyUI base styles
		styled: true, // Apply DaisyUI component styles
		utils: true, // Include DaisyUI utility classes
	},
};
