<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineShoppingBag from 'svelte-icons-pack/hi/HiOutlineShoppingBag';
	import HiOutlineCurrencyDollar from 'svelte-icons-pack/hi/HiOutlineCurrencyDollar';
	import HiOutlineCube from 'svelte-icons-pack/hi/HiOutlineCube';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';

	import { COLLECTED_OFFER_TEMPLATE, TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';

	export let data: PageData;

	let isLoading = true;
	let collectedOffferData = COLLECTED_OFFER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Ofertas Coletadas',
		buttonText: 'Salvar'
	};

	const query = {
		itemsPerPage: 100,
		page: 1,
		deleted: false,
		orderKey: 'designation',
		orderValue: 'asc'
	} as Pagination;
	$: queryString = fromPaginationToQuery(query);

	// Form
	let formRef: HTMLFormElement;
	let fields: FieldDto[] = [];

	const schema = yup.object().shape({
		month: yup
			.number()
			.integer()
			.min(1, TEMPLATES.YUP.MIN_NUMBER('Mês', 1))
			.max(12, TEMPLATES.YUP.MAX_NUMBER('Mês', 12))
			.required(TEMPLATES.YUP.REQUIRED('Mês')),
		year: yup
			.number()
			.integer()
			.min(2000, TEMPLATES.YUP.MIN_NUMBER('Ano', 2000))
			.max(2100, TEMPLATES.YUP.MAX_NUMBER('Ano', 2100))
			.required(TEMPLATES.YUP.REQUIRED('Ano')),
		foodQnt: yup.number().integer().required(TEMPLATES.YUP.REQUIRED('Mantimentos')),
		monetaryValue: yup.number().required(TEMPLATES.YUP.REQUIRED('Valores')),
		othersQnt: yup.number().integer().required(TEMPLATES.YUP.REQUIRED('Outros')),
		field: yup.string().nullable().optional()
	});

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');
		const id = navigation.to?.url.searchParams.get('id');

		if (id && idMatcher(id) && accessToken) {
			axios.setAuth(accessToken);
			collectedOffferData = (await axios.get(`/monthly-offer/${id}`)).data.data;
			collectedOffferData.field = collectedOffferData.fieldId;
		}
		isLoading = false;
	});

	async function loadData() {
		try {
			isLoading = true;
			fields = (await axios.get(`/field?${queryString}`)).data.data;
			isLoading = false;
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

	async function onSubmit(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		isLoading = true;

		try {
			const isValid = schema.validateSync(
				{
					month: collectedOffferData.month,
					year: collectedOffferData.year,
					foodQnt: collectedOffferData.foodQnt,
					monetaryValue: collectedOffferData.monetaryValue,
					othersQnt: collectedOffferData.othersQnt,
					field: collectedOffferData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				const postData = {
					month: collectedOffferData.month,
					year: collectedOffferData.year,
					foodQnt: collectedOffferData.foodQnt,
					monetaryValue: collectedOffferData.monetaryValue,
					othersQnt: collectedOffferData.othersQnt,
					field: collectedOffferData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/monthly-offer/${collectedOffferData.id}`, postData);

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
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
</script>

<svelte:head>
	<title>Collected Offers</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineShoppingBag} />
				<input
					bind:value={collectedOffferData.foodQnt}
					name="foodQnt"
					placeholder="Mantimentos (Qnt.)"
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCurrencyDollar} />
				<input
					bind:value={collectedOffferData.monetaryValue}
					name="monetaryValue"
					placeholder="Valores"
					type="number"
					min="0"
					step="any"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCube} />
				<input
					bind:value={collectedOffferData.othersQnt}
					name="foodQnt"
					placeholder="Outros"
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						bind:value={collectedOffferData.month}
						name="month"
						placeholder="Mês"
						type="number"
						min="1"
						max="12"
					/>
				</div>
				<div class="number">
					<input
						bind:value={collectedOffferData.year}
						name="year"
						placeholder="Ano"
						type="number"
						min="2000"
						max="2100"
						required
					/>
				</div>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={collectedOffferData.field} name="field" required>
						<option value={null} disabled selected>Campo Missionário</option>

						{#each fields as field}
							<option value={field.id}>
								{field.abbreviation} - {field.designation}
							</option>
						{/each}
					</select>
				</div>
			{/if}
		</form>
	</AppContent>
</AppContainer>
