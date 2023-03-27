<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineHand from 'svelte-icons-pack/hi/HiOutlineHand';
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary';
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';

	import { OFFEROR_FAMILY_TEMPALTE, TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { OfferorFamilyGroup } from '$src/lib/enums';

	export let data: PageData;

	let isLoading = true;
	let offerorFamilyData = OFFEROR_FAMILY_TEMPALTE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

	// App Header
	const appHeader = {
		name: 'Editar Família Ofertante',
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
	const groups = [
		{ value: 'CHURCH', text: 'Igreja' },
		{ value: 'COMMUNITY', text: 'Comunidade' },
		{ value: 'EXTERNAL', text: 'Externo' }
	];

	const schema = yup.object().shape({
		representative: yup.string().required(TEMPLATES.YUP.REQUIRED('Representante')),
		commitment: yup.string().required(TEMPLATES.YUP.REQUIRED('Compromisso')),
		churchDenomination: yup.string().nullable().optional(),
		group: yup
			.string()
			.oneOf(Object.values(OfferorFamilyGroup), TEMPLATES.YUP.ONE_OF(groups.map((g) => g.text)))
			.required(TEMPLATES.YUP.REQUIRED('Grupo')),
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
			offerorFamilyData = (await axios.get(`/offeror-family/${id}`)).data.data;
			offerorFamilyData.field = offerorFamilyData.fieldId;
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
					representative: offerorFamilyData.representative,
					commitment: offerorFamilyData.commitment,
					churchDenomination: offerorFamilyData.churchDenomination,
					group: offerorFamilyData.group,
					field: offerorFamilyData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				const postData = {
					representative: offerorFamilyData.representative,
					commitment: offerorFamilyData.commitment,
					churchDenomination: offerorFamilyData.churchDenomination,
					group: offerorFamilyData.group,
					field: offerorFamilyData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				if (!offerorFamilyData.churchDenomination) {
					// @ts-ignore
					delete postData.churchDenomination;
				}
				const res = await axios.put(`/offeror-family/${offerorFamilyData.id}`, postData);

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
	<title>Offeror Families</title>
</svelte:head>

<AppContainer {messages} locale={data.locale}>
	<AppContent {...appHeader} {isLoading} on:click={onSubmit} {showActions} {showRefreshButton}>
		<form bind:this={formRef} on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={offerorFamilyData.representative}
					name="representative"
					placeholder="Representante"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineHand} />
				<input
					bind:value={offerorFamilyData.commitment}
					name="commitment"
					placeholder="Compromisso"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={offerorFamilyData.churchDenomination}
					name="churchDenomination"
					placeholder="Igreja"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<select bind:value={offerorFamilyData.group} name="group" required>
					<option value={null} disabled selected>Grupo</option>

					{#each groups as group}
						<option value={group.value}>
							{group.text}
						</option>
					{/each}
				</select>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={offerorFamilyData.field} name="field" required>
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
