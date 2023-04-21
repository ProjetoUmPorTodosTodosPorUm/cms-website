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

	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { getContext, onMount } from 'svelte';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['collected-offers'].add;
	$: sharedI18n = $LL.shared;

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = true;

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: i18n.appHeader.buttonText()
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
	$: schema = yup.object().shape({
		month: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.monthLabel() }))
			.integer(sharedI18n.yup.integer({ field: i18n.inputs.monthLabel() }))
			.min(
				1,
				sharedI18n.yup.minNumber({
					field: i18n.inputs.monthLabel(),
					value: 1
				})
			)
			.max(
				12,
				sharedI18n.yup.maxNumber({
					field: i18n.inputs.monthLabel(),
					value: 12
				})
			)
			.required(sharedI18n.yup.required({ field: i18n.inputs.monthLabel() })),
		year: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.yearLabel() }))
			.integer(sharedI18n.yup.integer({ field: i18n.inputs.yearLabel() }))
			.min(
				2000,
				sharedI18n.yup.minNumber({
					field: i18n.inputs.yearLabel(),
					value: 2000
				})
			)
			.max(
				2100,
				sharedI18n.yup.maxNumber({
					field: i18n.inputs.yearLabel(),
					value: 2100
				})
			)
			.required(sharedI18n.yup.required({ field: i18n.inputs.yearLabel() })),
		foodQnt: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.foodQntLabel() }))
			.integer(sharedI18n.yup.integer({ field: i18n.inputs.foodQntLabel() }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.foodQntLabel() })),
		monetaryValue: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.monetaryValueLabel() }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.monetaryValueLabel() })),
		othersQnt: yup
			.number()
			.typeError(sharedI18n.yup.number({ field: i18n.inputs.othersQntLabel() }))
			.integer(sharedI18n.yup.integer({ field: i18n.inputs.othersQntLabel() }))
			.required(sharedI18n.yup.required({ field: i18n.inputs.othersQntLabel() })),
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

		await loadNamespaceAsync(data.locale, 'collected-offers');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
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
				<Icon src={HiOutlineShoppingBag} />
				<input
					bind:value={foodQnt}
					name="foodQnt"
					placeholder={i18n.inputs.foodQntLabel()}
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCurrencyDollar} />
				<input
					bind:value={monetaryValue}
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
					bind:value={othersQnt}
					name="foodQnt"
					placeholder={i18n.inputs.othersQntLabel()}
					type="number"
					min="0"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<div class="number">
					<input
						bind:value={month}
						name="month"
						placeholder={i18n.inputs.monthLabel()}
						type="number"
						min="1"
						max="12"
					/>
				</div>
				<div class="number">
					<input
						bind:value={year}
						name="year"
						placeholder={i18n.inputs.yearLabel()}
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
						<option value={null} disabled selected>{sharedI18n.inputs.fieldLabel()}</option>

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
