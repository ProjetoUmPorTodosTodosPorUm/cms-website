<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { COLLECT_OFFERS_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineShoppingBag, HiOutlineCurrencyDollar, HiOutlineCube, HiOutlineCalendar } from 'svelte-icons-pack/hi'

	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

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
		name: 'Adicionar Ofertas Coletadas',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Ofertas Coletadas</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineShoppingBag} />
				<input name="foodQnt" placeholder={COLLECT_OFFERS_INPUT_LABELS.foodQnt} type="number" min="0" />
			</div>
			<div class="input">
				<Icon src={HiOutlineCurrencyDollar} />
				<input
					name="monetaryValue"
					placeholder={COLLECT_OFFERS_INPUT_LABELS.monetaryValue}
					type="number"
					min="0"
					step="any"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCube} />
				<input name="othersQnt" placeholder={COLLECT_OFFERS_INPUT_LABELS.othersQnt} type="number" min="0" />
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input name="month" placeholder={COLLECT_OFFERS_INPUT_LABELS.month} type="number" min="1" max="12" />
				</div>
				<div class="number">
					<input name="year" placeholder={COLLECT_OFFERS_INPUT_LABELS.year} type="number" min="2000" max="2100" />
				</div>
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
