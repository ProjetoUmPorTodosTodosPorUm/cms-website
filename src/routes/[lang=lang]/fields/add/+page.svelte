<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, InputTag } from '$components'
	import type { ActionData, PageData } from './$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe'
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus'

	import type { CollectionPoint } from '$types'
	import { Loader } from '@googlemaps/js-api-loader'
	import { PUBLIC_GOOGLE_MAP_API } from '$env/static/public'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.fields.add

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

	export let data: PageData
	export let form: ActionData
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

		await loadNamespaceAsync(data.locale, 'fields')
		setLocale(data.locale)
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
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineGlobe} />
				<input name="continent" placeholder={i18n.inputs.continentLabel()} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="country" placeholder={i18n.inputs.countryLabel()} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="state" placeholder={i18n.inputs.stateLabel()} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="abbreviation" placeholder={i18n.inputs.abbreviationLabel()} />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input name="designation" placeholder={i18n.inputs.designationLabel()} />
			</div>
			<div class="input">
				<InputTag formName="streetRelation" placeholder={i18n.inputs.streetRelationLabel()} />
			</div>
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
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
