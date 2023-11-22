import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import {viteStaticCopy} from "vite-plugin-static-copy";
import jsonServer from "vite-plugin-simple-json-server";
import { getMockHandlers } from './src/mockApi/handlersMock/mock';
import { mockPlugin } from './vite-mock-plugin';

const MOCK_DIR_PATH = "src/mockApi/jsonMock";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		base: "/",
		publicDir: "pubDir",
		mode: mode === "prod" ? "production" : "development",
		plugins: [
			react(),
			mockPlugin(true),
			jsonServer({
				disable: false,
				mockDir: MOCK_DIR_PATH,
				logLevel: "info",
				delay: 1000,
				urlPrefixes: ["/api-file", "/api"],
				handlers: getMockHandlers(),
			})
		],
		server: {
			host: true,
			port: 5173,
			strictPort: true,
			open: false,
			// proxy: {
			// 	'/api': {
			// 		target: `http://localhost:5173`,
			// 		changeOrigin: false,
			// 		secure: false,
			// 		rewrite: (path) => path.replace(/^\/api/, ''),
			// 		configure: (proxy, _options) => {
			// 			proxy.on('error', (err, _req, _res) => {
			// 				console.log(`\x1b[31mProxy error: ${err} ${_req}\n\x1b[0m`);
			// 			});
			// 			proxy.on('proxyReq', (proxyReq, req, _res) => {
			// 				console.log(`\x1b[33mSending Request to the Target: ${req.method} ${req.url}\n\x1b[0m`);
			// 			});
			// 			proxy.on('proxyRes', (proxyRes, req, _res) => {
			// 				let outString = `\x1b[33mResponse from Target for: ${req.method} ${req.url}\x1b[0m`;
			// 				if (proxyRes.statusCode === 200) {
			// 					outString += `\x1b[32m 200\n\x1b[0m`;
			// 				} else {
			// 					outString += `\x1b[31m ${proxyRes.statusCode}\n    statusMessage: ${proxyRes.statusMessage}\n    statusText: ${proxyRes.statusMessage}\n    headers:\n    ${Object.entries(proxyRes.headers).map(el => {
			// 						const [key, values] = el;
			// 						return `    ${key}: ${(Array.isArray(values) ? values : [values]).join(",")}`
			// 					}).join("\n    ")
			// 						}
			// 					\x1b[0m\n`;
			// 				}
			// 				console.log(outString);
			// 			});
			// 		},
			// 	},
			// },
		},
		build: {
			outDir: `public`,
			manifest: false,
			minify: mode === "prod" ? 'esbuild' : false,
			copyPublicDir: true,
			rollupOptions: {
				output: {
					chunkFileNames: 'dist/assets/js/[name]-[hash].js',
					entryFileNames: 'dist/assets/js/[name]-[hash].js',
					assetFileNames: ({ name }) => {
						if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
							return 'dist/assets/images/[name]-[hash][extname]';
						}

						if (/\.css$/.test(name ?? '')) {
							return 'dist/assets/css/[name]-[hash][extname]';
						}

						if (/\.(woff2|woff|ttf)$/.test(name ?? '')) {
							return 'dist/assets/fonts/[name]-[hash][extname]';
						}

						// default value
						// ref: https://rollupjs.org/guide/en/#outputassetfilenames
						return 'dist/assets/[name]-[hash][extname]';
					},
				},
			}
		}
	}
})
