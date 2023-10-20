<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { MonthlyOfferDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineShoppingBag from 'svelte-icons-pack/hi/HiOutlineShoppingBag'
	import HiOutlineCurrencyDollar from 'svelte-icons-pack/hi/HiOutlineCurrencyDollar'
	import HiOutlineCube from 'svelte-icons-pack/hi/HiOutlineCube'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL['collected-offers'].edit

	export let data: PageData
	export let form: ActionData
	$: collectedOfferData = (data.apiData as MonthlyOfferDto) || (form?.apiData as MonthlyOfferDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'collected-offers')
		setLocale(data.locale)
	})

	async function postActionCallback() {
		// ignore first loading triggering
		if (isLoading && messages.length > 0) {
			isLoading = false
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: ''
	}
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
		locale={data.locale}
		on:click={onSubmit}
	>
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<div class="input">
				<Icon src={HiOutlineShoppingBag} />
				<input
					bind:value={collectedOfferData.foodQnt}
					name="foodQnt"
					placeholder={i18n.inputs.foodQntLabel()}
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCurrencyDollar} />
				<input
					bind:value={collectedOfferData.monetaryValue}
					name="monetaryValue"
					placeholder={i18n.inputs.monetaryValueLabel()}
					type="number"
					min="0"
					step="any"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCube} />
				<input
					bind:value={collectedOfferData.othersQnt}
					name="othersQnt"
					placeholder={i18n.inputs.othersQntLabel()}
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						bind:value={collectedOfferData.month}
						name="month"
						placeholder={i18n.inputs.monthLabel()}
						type="number"
						min="1"
						max="12"
					/>
				</div>
				<div class="number">
					<input
						bind:value={collectedOfferData.year}
						name="year"
						placeholder={i18n.inputs.yearLabel()}
						type="number"
						min="2000"
						max="2100"
						
					/>
				</div>
			</div>
			<FieldSelect value={collectedOfferData.fieldId} />
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
