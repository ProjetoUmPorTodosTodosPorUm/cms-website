<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, InputTag } from '$components'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction } from '$utils'
	import { FIELDS_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe'
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus'

	import type { CollectionPoint, FieldDto } from '$types'
	import { Loader } from '@googlemaps/js-api-loader'
	import { PUBLIC_GOOGLE_MAP_API } from '$env/static/public'

	export let data: PageData
	export let form: ActionData
	$: fieldData = (data.apiData as FieldDto) || (form?.apiData as FieldDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		const google = await loader.load()
		const map = new google.maps.Map(googleMapRef, mapOptions)

		// Create the search box and link it to the UI element.
		const input = document.getElementById('pac-input') as HTMLInputElement
		const searchBox = new google.maps.places.SearchBox(input)
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input)

		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', () => {
			searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds)
		})
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

	// Map
	let googleMapRef: HTMLDivElement
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

	// App Header
	$: appHeader = {
		name: 'Editar Campo Missionário',
		buttonText: ''
	}
</script>

<svelte:head>
	<title>Campos Missionários</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent
		{...appHeader}
		{isLoading}
		showActions={false}
		showRefreshButton={false}
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
				<Icon src={HiOutlineGlobe} />
				<input
					bind:value={fieldData.continent}
					name="continent"
					placeholder={FIELDS_INPUT_LABELS.continent}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={fieldData.country}
					name="country"
					placeholder={FIELDS_INPUT_LABELS.country}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input bind:value={fieldData.state} name="state" placeholder={FIELDS_INPUT_LABELS.state} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={fieldData.abbreviation}
					name="abbreviation"
					placeholder={FIELDS_INPUT_LABELS.abbreviation}
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={fieldData.designation}
					name="designation"
					placeholder={FIELDS_INPUT_LABELS.designation}
				/>
			</div>
			<div class="input">
				<InputTag
					tags={fieldData.streetRelation}
					formName="streetRelation"
					placeholder={FIELDS_INPUT_LABELS.streetRelation}
				/>
			</div>
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
		<div bind:this={googleMapRef} id="map" />
	</AppContent>
</AppContainer>

<style lang="scss">
	#map {
		width: 100%;
		height: 60%;
	}
</style>
