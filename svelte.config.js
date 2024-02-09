import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/kit/vite'
import * as child_process from 'node:child_process'

const csrf = process.env.NODE_ENV == 'development' ? false : { checkOrigin: true }
const baseDirectives = {
	'default-src': ['self', '*.projetoumportodostodosporum.org', '*.localhost'],
	'script-src': [
		'self',
		'https:',
		'unsafe-eval',
		'blob:',
		'*.projetoumportodostodosporum.org',
		'*.localhost'
	],
	'frame-src': ['self', 'youtube.com', 'www.youtube.com'],
	'style-src': [
		'self',
		'fonts.googleapis.com',
		'unsafe-inline',
		'*.projetoumportodostodosporum.org',
		'*.localhost'
	],
	'font-src': ['self', 'fonts.gstatic.com'],
	'img-src': ['self', 'data:', '*.projetoumportodostodosporum.org', '*.localhost'],
	'connect-src': [
		'self',
		'data:',
		'blob:',
		'*.projetoumportodostodosporum.org',
		'*.localhost',
		'wss://localhost'
	],
	'worker-src': ['self', 'blob:']
}
const cspDirectives = Object.keys(baseDirectives).reduce((acc, curr) => {
	if (['development', 'preview'].includes(process.env.NODE_ENV)) {
		return { ...acc, [curr]: baseDirectives[curr] }
	} else {
		return { ...acc, [curr]: baseDirectives[curr].filter((val) => val.indexOf('localhost') < 0) }
	}
}, {})

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
		csrf,
		alias: {
			$src: 'src',
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
			directives: cspDirectives,
			reportOnly: {
				...cspDirectives,
				'report-to': ['api.projetoumportodostodosporum.org/csp-report']
			}
		},
		version: {
			name: child_process.execSync('git rev-parse HEAD').toString().trim()
		}
	}
}

export default config
