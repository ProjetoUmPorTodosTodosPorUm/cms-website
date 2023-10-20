<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import type { UserStore } from '$stores'
	import { goto } from '$app/navigation'
	import type { PageData } from './$types'

	export let data: PageData
	const userStore = getContext<UserStore>('user')

	onMount(async () => {
		userStore.eraseStore()
		await goto(`/${data.locale}/login`, { invalidateAll: true })
	})
</script>

<svelte:head>
	<title>Logout</title>
</svelte:head>
