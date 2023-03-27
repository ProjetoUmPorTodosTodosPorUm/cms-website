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

	import { TEMPLATES } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { OfferorFamilyGroup } from '$src/lib/enums';

	export let data: PageData;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = true;

	// App Header
	const appHeader = {
		name: 'Adicionar Família Ofertante',
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

	let representative: string;
	let commitment: string;
	let churchDenomination: string;
	let group: OfferorFamilyGroup | null;
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
				{ representative, commitment, churchDenomination, group, field },
				{ abortEarly: false }
			);

			if (isValid) {
				const postData = {
					representative,
					commitment,
					churchDenomination,
					group,
					field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				if (!churchDenomination) {
					// @ts-ignore
					delete postData.churchDenomination;
				}
				const res = await axios.post('/offeror-family', postData);

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
		group = null;
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
					bind:value={representative}
					name="representative"
					placeholder="Representante"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineHand} />
				<input
					bind:value={commitment}
					name="commitment"
					placeholder="Compromisso"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={churchDenomination}
					name="churchDenomination"
					placeholder="Igreja"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUserGroup} />
				<select bind:value={group} name="group" required>
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
