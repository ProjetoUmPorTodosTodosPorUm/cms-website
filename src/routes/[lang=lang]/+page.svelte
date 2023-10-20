<script lang="ts">
	import '$scss/dashboard.scss'
	import { AppContainer, AppContent } from '$components'
	import { friendlyDateString } from '$utils'
	import { getContext, onMount } from 'svelte'
	import type { UserStore } from '$stores'
	import type { PageData } from './$types'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.dashboard

	export let data: PageData

	// App Content Options
	let isLoading = true

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name()
	}

	// Component Options
	const userStore = getContext<UserStore>('user')
	const user = userStore.get()

	let time = new Date()
	$: currentTime = friendlyDateString(time, data.locale)

	onMount(async () => {
		isLoading = false

		setInterval(() => {
			time = new Date()
		}, 1000)

		await loadNamespaceAsync(data.locale, 'dashboard')
		setLocale(data.locale)
	})
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
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
			<h2>{i18n.welcomedText({ name: user.firstName })}</h2>
			<p>{i18n.todayDate({ date: currentTime })}</p>
		</div>
	</AppContent>
</AppContainer>
