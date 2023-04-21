<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus';
	import HiOutlineCollection from 'svelte-icons-pack/hi/HiOutlineCollection';
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX';

	import { onMount } from 'svelte';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { CollectionPoint } from '$lib/types';
	import { Loader } from '@googlemaps/js-api-loader';
	import { PUBLIC_GOOGLE_MAP_API } from '$env/static/public';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.fields.add;
	$: sharedI18n = $LL.shared;

	// Map
	let googleMapRef: HTMLDivElement;
	const loader = new Loader({
		apiKey: PUBLIC_GOOGLE_MAP_API,
		version: 'weekly',
		libraries: ['places']
	});

	const mapOptions = {
		center: {
			lat: 0,
			lng: 0
		},
		zoom: 4
	};

	export let data: PageData;
	let inputTagRef: HTMLInputElement;

	// App Content Options
	const showActions = false;
	const showRefreshButton = true;

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText()
	};

	// Form
	let formRef: HTMLFormElement;
	let isLoading = false;

	$: schema = yup.object().shape({
		continent: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.continentLabel() })),
		country: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.countryLabel() })),
		state: yup.string().required(sharedI18n.yup.required({ field: i18n.inputs.stateLabel() })),
		abbreviation: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.abbreviationLabel() })),
		designation: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.designationLabel() })),
		mapLocation: yup.object().nullable().optional(),
		mapArea: yup.array().nullable().optional(),
		collectionPoints: yup.array().nullable().optional(),
		streetRelation: yup.array(yup.string()).optional()
	});

	let continent: string;
	let country: string;
	let state: string;
	let abbreviation: string;
	let designation: string;
	let mapLocation: google.maps.MapOptions;
	let mapArea: google.maps.PolygonOptions[];
	let collectionPoints: CollectionPoint[];
	let streetRelation: string[] = [];

	let messages: any[] = [];

	onMount(async () => {
		const google = await loader.load();
		const map = new google.maps.Map(googleMapRef, mapOptions);

		// Create the search box and link it to the UI element.
		const input = document.getElementById('pac-input') as HTMLInputElement;
		const searchBox = new google.maps.places.SearchBox(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		// Bias the SearchBox results towards current map's viewport.
		map.addListener('bounds_changed', () => {
			searchBox.setBounds(map.getBounds() as google.maps.LatLngBounds);
		});

		await loadNamespaceAsync(data.locale, 'fields');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isLoading = true;

		try {
			const isValid = schema.validateSync(
				{
					continent,
					country,
					state,
					abbreviation,
					designation,
					mapLocation,
					mapArea,
					collectionPoints,
					streetRelation
				},
				{ abortEarly: false }
			);

			if (isValid) {
				const postData: {
					continent: string;
					country: string;
					state: string;
					abbreviation: string;
					designation: string;
					mapLocation?: google.maps.MapOptions;
					mapArea?: google.maps.PolygonOptions[];
					collectionPoints?: CollectionPoint[];
					streetRelation?: string[];
				} = {
					continent,
					country,
					state,
					abbreviation,
					designation,
					mapLocation,
					mapArea,
					collectionPoints,
					streetRelation
				};
				if (!mapLocation) delete postData.mapLocation;
				if (!mapArea) delete postData.mapArea;
				if (!collectionPoints) delete postData.collectionPoints;
				if (!streetRelation || streetRelation.length == 0) delete postData.streetRelation;

				const res = await axios.post('/field', postData);

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
				eraseForm();
			}
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message }]);
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	function eraseForm() {
		formRef.reset();
		streetRelation = [];
	}

	function onKeyPress(event: KeyboardEvent) {
		if (event.key == ',' || event.key == 'Enter') {
			event.preventDefault();

			streetRelation = [...streetRelation, inputTagRef.value];
			inputTagRef.value = '';
			inputTagRef.blur();
		}
	}

	function onRemoveStreet(index: number) {
		streetRelation.splice(index, 1);
		streetRelation = streetRelation;
	}
</script>

<svelte:head>
	<title>{i18n.pageTitle()}</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent
		{...appHeader}
		{isLoading}
		{showActions}
		{showRefreshButton}
		locale={data.locale}
		on:click={onSubmit}
	>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineGlobe} />
				<input
					bind:value={continent}
					name="continent"
					placeholder={i18n.inputs.continentLabel()}
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={country}
					name="country"
					placeholder={i18n.inputs.countryLabel()}
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input bind:value={state} name="state" placeholder={i18n.inputs.stateLabel()} required />
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={abbreviation}
					name="abbreviation"
					placeholder={i18n.inputs.abbreviationLabel()}
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={designation}
					name="designation"
					placeholder={i18n.inputs.designationLabel()}
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCollection} />
				<input
					bind:this={inputTagRef}
					on:keypress={onKeyPress}
					name="streetRelation"
					placeholder={i18n.inputs.streetRelationLabel()}
					autocomplete="off"
				/>
				{#if streetRelation?.length > 0}
					<div class="tags">
						{#each streetRelation as street, index}
							<div class="item">
								{street}
								<button class="btn-close" on:click|preventDefault={() => onRemoveStreet(index)}
									><Icon src={HiOutlineX} /></button
								>
							</div>
						{/each}
					</div>
				{/if}
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
