<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { friendlyDateString } from '$lib/utils/functions';
	import { getContext, onMount } from 'svelte';
	import type { UserStore } from '$src/lib/store/user';
	import type { PageData } from './$types';

	export let data: PageData;

	// App Content Options
	let isLoading = true;

	// App Header
	const appHeader = {
		name: 'Início'
	};

	// Component Options
	let userStore = getContext<UserStore>('userStore');
	let user = userStore.get('user');

	let time = new Date();
	$: currentTime = friendlyDateString(time);

	onMount(() => {
		isLoading = false;

		setInterval(() => {
			time = new Date();
		}, 1000);
	});
</script>

<svelte:head>
	<title>Dashboard | Início</title>
</svelte:head>

<AppContainer locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		showBackButton={false}
		showActions={false}
		showRefreshButton={false}
		locale={data.locale}
	>
		<div class="home">
			<h2>Bem-vindo, {user.firstName}!</h2>
			<p>Hoje é {currentTime}</p>
		</div>
	</AppContent>
</AppContainer>
