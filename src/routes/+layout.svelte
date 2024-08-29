<script lang="ts">
	import '$assets/css/global.css'
	import '$scss/themes.scss'
	import { SettingsStore } from '$stores'
	import { setContext } from 'svelte'

	setContext('settings', new SettingsStore())
</script>

<slot />
