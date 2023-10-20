<script lang="ts">
	import '$assets/css/global.css'
	import '$scss/themes.scss'
	import { SettingsStore } from '$stores'
	import { UserStore } from '$stores'
	import { setContext } from 'svelte'

	export let data

	const userStore = new UserStore(data.user)
	$: userStore.updateUser(data.user)

	setContext('settings', new SettingsStore())
	setContext('user', userStore)
</script>

<slot />
