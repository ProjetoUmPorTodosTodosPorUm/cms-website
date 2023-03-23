<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { UserStore } from '$lib/store/user';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { delay } from '$src/lib/utils/functions';

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');

	onMount(async () => {
		userStore.eraseStore();
		await delay(500);
		await goto(`/${data.locale}`);
	});
</script>

<svelte:head>
	<title>Logout</title>
</svelte:head>
