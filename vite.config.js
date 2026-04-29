// import restart from 'vite-plugin-restart'
import glsl from "vite-plugin-glsl";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
	plugins: [
		// restart({ restart: [ '../public/**', ] }), // Restart server on static file change
		glsl(), // Handle shader files
	],
	resolve: {
		alias: {
			"@plugins": resolve(__dirname, "src/plugins"),
			"@shaders": resolve(__dirname, "src/shaders"),
		},
	},
});
