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

	import { TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = true;

	// App Header
	const appHeader = {
		name: 'Adicionar Ofertas Coletadas',
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
	let isLoading = false;
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

	let month: number;
	let year: number;
	let foodQnt: number;
	let monetaryValue: number;
	let othersQnt: number;
	let field: string | null;

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
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
				{ month, year, foodQnt, monetaryValue, othersQnt, field },
				{ abortEarly: false }
			);

			if (isValid) {
				const postData = {
					month,
					year,
					foodQnt,
					monetaryValue,
					othersQnt,
					field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.post('/monthly-offer', postData);

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
		field = null;
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
					bind:value={foodQnt}
					name="foodQnt"
					placeholder="Mantimentos (Qnt.)"
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCurrencyDollar} />
				<input
					bind:value={monetaryValue}
					name="monetaryValue"
					placeholder="Valores"
					type="number"
					min="0"
					step="any"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCube} />
				<input bind:value={othersQnt} name="foodQnt" placeholder="Outros" type="number" min="0" />
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input bind:value={month} name="month" placeholder="Mês" type="number" min="1" max="12" />
				</div>
				<div class="number">
					<input
						bind:value={year}
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
					<select bind:value={field} name="field" required>
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
