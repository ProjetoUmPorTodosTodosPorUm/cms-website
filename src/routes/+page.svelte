<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent } from '$components'
	import { friendlyDateString } from '$utils'
	import { getContext, onMount } from 'svelte'
	import type { UserStore } from '$stores'

	// App Content Options
	let isLoading = true

	// App Header
	$: appHeader = {
		name: 'Dashboard'
	}

	// Component Options
	const userStore = getContext<UserStore>('user')
	const user = userStore.get()

	let time = new Date()
	$: currentTime = friendlyDateString(time, 'pt-BR')

	onMount(async () => {
		isLoading = false

		setInterval(() => {
			time = new Date()
		}, 1000)
	})
</script>

<svelte:head>
	<title>Dashboard</title>
</svelte:head>

<AppContainer>
	<AppContent
		{...appHeader}
		{isLoading}
		showBackButton={false}
		showActions={false}
		showRefreshButton={false}
	>
		<div class="home">
			<h2>{`Bem-vindo, ${user.firstName}`}</h2>
			<p>{`Hoje é ${currentTime}`}</p>
		</div>
	</AppContent>
</AppContainer>
