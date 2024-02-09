<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import type { UserStore } from '$stores'
	import { goto } from '$app/navigation'

	const userStore = getContext<UserStore>('user')

	onMount(async () => {
		userStore.eraseStore()
		await goto(`/login`, { invalidateAll: true })
	})
</script>

<svelte:head>
	<title>Logout</title>
</svelte:head>
