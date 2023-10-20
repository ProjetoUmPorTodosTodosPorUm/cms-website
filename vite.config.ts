import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import copy from 'rollup-plugin-copy'

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
const file = fileURLToPath(new URL('package.json', import.meta.url))
const json = readFileSync(file, 'utf8')
const pkg = JSON.parse(json)

export default defineConfig(({ mode }) => {
	const serverSettings = mode === "development"
		? { server: { hmr: { path: '/ws' } } }
		: {}

	return {
		plugins: [
			sveltekit(),
			copy({
				targets: [{
					src: [
						'node_modules/tinymce/**/*.{min.js,min.css}',
						'node_modules/tinymce/**/index.js',
						'node_modules/tinymce/plugins/help/js/i18n/keynav/en.js',
						'node_modules/tinymce/plugins/help/js/i18n/keynav/pt_BR.js'
					],
					dest: 'static',
				}],
				flatten: false,
			})
		],
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}']
		},
		define: {
			__APP_VERSION__: JSON.stringify(pkg.version),
			__APP_SERVER_NAME__: "'Kyrie Eleison'"
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks(id) {
						if (id.includes('src/lib/utils')) return 'utils'
					}
				}
			}
		},
		...serverSettings
	}
})
