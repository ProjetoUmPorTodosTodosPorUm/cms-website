<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, InputTag } from '$components'
	import type { ActionData } from './$types'
	import { FIELDS_INPUT_LABELS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineGlobeAmericas, HiOutlineMinus } from 'svelte-icons-pack/hi'

	import type { CollectionPoint } from '$types'
	import { Loader } from '@googlemaps/js-api-loader'
	import { PUBLIC_GOOGLE_MAP_API } from '$env/static/public'

	// Map
	let googleMapRef: HTMLDivElement

	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		const loader = new Loader({
			apiKey: PUBLIC_GOOGLE_MAP_API,
			version: 'weekly',
			libraries: ['places']
		})

		const mapOptions = {
			center: {
				lat: 0,
				lng: 0
			},
			zoom: 4
		}

		const Core = await loader.importLibrary('core')
		const Maps = await loader.importLibrary('maps')
		const Places = await loader.importLibrary('places')

		const map = new Maps.Map(googleMapRef, mapOptions)

		// Create the search box and link it to the UI element.
		const input = document.getElementById('pac-input') as HTMLInputElement
		const searchBox = new Places.SearchBox(input)
		map.controls[Core.ControlPosition.TOP_LEFT].push(input)

		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', () => {
			// @ts-ignore as Core.LatLngBounds
			searchBox.setBounds(map.getBounds())
		})
	})

	async function postActionCallback() {
		// ignore first loading triggering
		if (messages.length > 0) {
			isLoading = false
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// App Header
	$: appHeader = {
		name: 'Adicionar Campo Missionário',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Campos Missionários</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineGlobeAmericas} />
				<input name="continent" placeholder={FIELDS_INPUT_LABELS.continent} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="country" placeholder={FIELDS_INPUT_LABELS.country} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="state" placeholder={FIELDS_INPUT_LABELS.state} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="abbreviation" placeholder={FIELDS_INPUT_LABELS.abbreviation} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="designation" placeholder={FIELDS_INPUT_LABELS.designation} />
			</div>
			<div class="input">
				<InputTag formName="streetRelation" placeholder={FIELDS_INPUT_LABELS.streetRelation} />
			</div>
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>

		<!-- TODO implement -->
		<!-- <div bind:this={googleMapRef} id="map" /> -->
	</AppContent>
</AppContainer>

<style lang="scss">
	#map {
		width: 100%;
		height: 60%;
	}
</style>
