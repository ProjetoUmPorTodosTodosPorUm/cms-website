import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import * as child_process from 'node:child_process'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			polyfill: false
		}),
		alias: {
			$src: 'src',
			$i18n: 'src/i18n',
			$assets: 'src/lib/assets',
			$stores: 'src/lib/stores',
			$classes: 'src/lib/classes',
			$components: 'src/lib/components',
			$scss: 'src/lib/scss',
			$enums: 'src/lib/enums',
			$types: 'src/lib/types',
			$constants: 'src/lib/constants',
			$utils: 'src/lib/utils'
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self'],
				'frame-src': ['self', 'youtube.com', 'www.youtube.com'],
				'style-src': ['self', 'fonts.googleapis.com', 'unsafe-inline'],
				'font-src': ['self', 'fonts.gstatic.com'],
				'img-src': ['self', 'data:'],
				'connect-src': [
					'*.localhost',
					'localhost:*',
					'ws://cms.localhost:*',
					'*.projetoumportodostodosporum.org',
					'projetoumportodostodosporum.org'
				]
			},
			reportOnly: {
				'default-src': ['self'],
				'script-src': ['self'],
				'frame-src': ['self', 'youtube.com', 'www.youtube.com'],
				'style-src': ['self', 'fonts.googleapis.com', 'unsafe-inline'],
				'font-src': ['self', 'fonts.gstatic.com'],
				'img-src': ['self', 'data:'],
				'connect-src': [
					'*.localhost',
					'localhost:*',
					'ws://cms.localhost:*',
					'*.projetoumportodostodosporum.org',
					'projetoumportodostodosporum.org'
				],
				'report-to': ['api.projetoumportodostodosporum.org/csp-report']
			}
		},
		version: {
			name: child_process.execSync('git rev-parse HEAD').toString().trim()
		}
	}
}

export default config
