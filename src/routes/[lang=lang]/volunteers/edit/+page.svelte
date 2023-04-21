<script lang="ts">
	import '$lib/scss/dashboard.scss';
	import '$lib/scss/dashboard-form.scss';
	import AppContainer from '$components/app-container.svelte';
	import AppContent from '$components/app-content.svelte';
	import { generateMessages } from '$components/toast.svelte';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser';
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag';
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';

	import { getContext, onMount } from 'svelte';
	import { VOLUNTEER_TEMPLATE } from '$src/lib/constants';
	import * as yup from 'yup';
	import axios from '$lib/axios';
	import Axios from 'axios';
	import type { PageData } from '../../users/add/$types';
	import type { FieldDto, FileDto, Pagination } from '$src/lib/types';
	import { fromPaginationToQuery, idMatcher } from '$src/lib/utils/functions';
	import type { UserStore } from '$src/lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { Occupation } from '$src/lib/enums';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL.volunteers.edit;
	$: sharedI18n = $LL.shared;

	export let data: PageData;

	let isLoading = true;
	let volunteerData = VOLUNTEER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let isAdminOrVolunteer = true;

	// App Content Options
	const showActions = false;
	const showRefreshButton = false;

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
	let fields: FieldDto[] = [];

	const defaultAvatarSrc = '/images/fallback-avatar.webp';
	$: occupations = [
		{ value: 'PRESIDENT', text: i18n.occupations.president() },
		{ value: 'VICE_PRESIDENT', text: i18n.occupations.vicePresident() },
		{ value: 'GENERAL_COORDINATOR', text: i18n.occupations.geralCoordinator() },
		{ value: 'COORDINATOR_01', text: i18n.occupations.coordinator01() },
		{ value: 'COUNSELOR_01', text: i18n.occupations.counselor01() },
		{ value: 'COUNSELOR_02', text: i18n.occupations.counselor02() },
		{ value: 'COUNSELOR_03', text: i18n.occupations.counselor03() },
		{ value: 'WEB_MASTER', text: i18n.occupations.webMaster() },
		{ value: 'TREASURER_01', text: i18n.occupations.treasurer01() },
		{ value: 'TREASURER_02', text: i18n.occupations.treasurer02() },
		{ value: 'ACADEMIC_INSTRUCTOR_01', text: i18n.occupations.academicInstructor01() },
		{ value: 'ACADEMIC_INSTRUCTOR_02', text: i18n.occupations.academicInstructor02() },
		{ value: 'EXECUTIVE_SECRETARY', text: i18n.occupations.executiveSecretary() },
		{ value: 'AUXILIARY_SECRETARY', text: i18n.occupations.auxiliarySecretary() },
		{ value: 'COORDINATOR_02', text: i18n.occupations.coordinator02() },
		{ value: 'INFIELD_COORDINATOR', text: i18n.occupations.infieldCoordinator() },
		{ value: 'OUTFIELD_COORDINATOR', text: i18n.occupations.outfieldCoordinator() },
		{ value: 'COLLECTOR', text: i18n.occupations.collector() },
		{ value: 'SUPPORT_SERVICE', text: i18n.occupations.supportService() }
	];

	$: schema = yup.object().shape({
		firstName: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.firstNameLabel() })),
		lastName: yup.string().nullable().optional(),
		email: yup
			.string()
			.nullable()
			.email(sharedI18n.yup.email({ field: i18n.inputs.emailLabel() }))
			.optional(),
		avatar: yup.string().nullable().optional(),
		joinedDate: yup
			.string()
			.required(sharedI18n.yup.required({ field: i18n.inputs.joinedDateLabel() })),
		occupation: yup
			.string()
			.oneOf(
				Object.values(Occupation),
				sharedI18n.yup.oneOf({ enums: occupations.map((r) => r.text).join(', ') })
			)
			.required(sharedI18n.yup.required({ field: i18n.inputs.occupationLabel() })),
		church: yup.string().nullable().optional(),
		priest: yup.string().nullable().optional(),
		observation: yup.string().nullable().optional(),
		field: yup.string().nullable().optional()
	});

	let avatarImageRef: HTMLImageElement;
	let avatarInputRef: HTMLInputElement;
	let avatarToUpload: File | null;
	let avatarToRemove = '';

	let messages: any[] = [];

	onMount(async () => {
		await loadData();
		isAdminOrVolunteer = userStore.isVolunteer() || userStore.isAdmin();
		avatarImageRef.src = defaultAvatarSrc;

		await loadNamespaceAsync(data.locale, 'volunteers');
		await loadNamespaceAsync(data.locale, 'shared');
		setLocale(data.locale);
	});

	afterNavigate(async (navigation: Navigation) => {
		const accessToken = userStore.get('accessToken');
		const id = navigation.to?.url.searchParams.get('id');

		if (id && idMatcher(id) && accessToken) {
			axios.setAuth(accessToken);
			volunteerData = (await axios.get(`/volunteer/${id}`)).data.data;
			volunteerData.joinedDate = volunteerData.joinedDate.split('T')[0];
			volunteerData.field = volunteerData.fieldId;
			avatarImageRef.src = volunteerData.avatar
				? `${PUBLIC_STATIC_PATH}/${volunteerData.avatar}`
				: defaultAvatarSrc;
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
					firstName: volunteerData.firstName,
					lastName: volunteerData.lastName,
					email: volunteerData.email,
					avatar: volunteerData.avatar,
					joinedDate: volunteerData.joinedDate,
					occupation: volunteerData.occupation,
					church: volunteerData.church,
					priest: volunteerData.priest,
					observation: volunteerData.observation,
					field: volunteerData.field
				},
				{ abortEarly: false }
			);

			if (isValid) {
				if (avatarToUpload) {
					await uploadFile(avatarToUpload);
				}

				const postData = {
					firstName: volunteerData.firstName,
					lastName: volunteerData.lastName,
					email: volunteerData.email,
					avatar: volunteerData.avatar,
					joinedDate: volunteerData.joinedDate,
					occupation: volunteerData.occupation,
					church: volunteerData.church,
					priest: volunteerData.priest,
					observation: volunteerData.observation,
					field: volunteerData.field
				};
				if (isAdminOrVolunteer) {
					// @ts-ignore
					delete postData.field;
				}
				const res = await axios.put(`/volunteer/${volunteerData.id}`, postData);

				if (avatarToRemove) {
					await removeFile(avatarToRemove);
				}

				isLoading = false;
				messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			}
		} catch (error) {
			isLoading = false;

			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message ?? error.message }]);
			} else if (error instanceof yup.ValidationError) {
				messages = generateMessages(error.inner.map((err) => ({ message: err.message })));
			} else {
				console.warn(error);
			}
		}
	}

	function onAvatarInput(event: Event) {
		event.preventDefault();
		event.stopPropagation();

		avatarInputRef.click();
	}

	function onAvatarChange(event: Event) {
		const file = (event.target as any).files[0] as File;
		if (file) {
			avatarToUpload = file;
			avatarImageRef.src = URL.createObjectURL(file);

			if (volunteerData.avatar) {
				avatarToRemove = volunteerData.avatar;
			}
		} else {
			avatarToUpload = null;
			avatarImageRef.src = defaultAvatarSrc;
		}
	}

	async function uploadFile(file: File) {
		try {
			let formData = new FormData();
			formData.append('file', file);
			const res = await axios.post('/file', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			messages = generateMessages([{ message: res.data.message, variant: 'success' }]);
			volunteerData.avatar = res.data.data.name;
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				throw new Axios.AxiosError(sharedI18n.axios.fileSizeError());
			} else {
				console.warn(error);
			}
		}
	}

	async function removeFile(avatarToRemove: string) {
		try {
			await axios.delete('/file/bulk', {
				data: {
					files: [avatarToRemove]
				}
			});
		} catch (error) {
			if (error instanceof Axios.AxiosError) {
				messages = generateMessages([{ message: error.response?.data.message ?? error.message }]);
			} else {
				console.warn(error);
			}
		}
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
		<form on:submit|preventDefault|stopPropagation={onSubmit} class="app-form">
			<div class="image-preview">
				<img bind:this={avatarImageRef} src="" alt={i18n.profilePic.altText()} />
				<div class="overlay">
					<!-- svelte-ignore a11y-invalid-attribute -->
					<a href="#" on:click={onAvatarInput}>{i18n.profilePic.editText()}</a>
					<input
						bind:this={avatarInputRef}
						on:change={onAvatarChange}
						name="avatar"
						type="file"
						accept=".jpg,.jpeg,.png"
					/>
				</div>
			</div>

			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.firstName}
					name="firstName"
					type="text"
					placeholder={i18n.inputs.firstNameLabel()}
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.lastName}
					name="lastName"
					type="text"
					placeholder={i18n.inputs.lastNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					bind:value={volunteerData.email}
					name="email"
					type="email"
					placeholder={i18n.inputs.emailLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input
					bind:value={volunteerData.joinedDate}
					name="joinedDate"
					type="date"
					autocomplete="off"
					required
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select bind:value={volunteerData.occupation} name="occupation" required>
					<option value={null} disabled selected>{i18n.inputs.occupationLabel()}</option>

					{#each occupations as occupation}
						<option value={occupation.value}>{occupation.text}</option>
					{/each}
				</select>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					bind:value={volunteerData.church}
					name="church"
					type="text"
					placeholder={i18n.inputs.churchLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					bind:value={volunteerData.priest}
					name="priest"
					type="text"
					placeholder={i18n.inputs.priestLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					bind:value={volunteerData.observation}
					name="observation"
					placeholder={i18n.inputs.observationLabel()}
					autocomplete="off"
					rows="5"
					required
				/>
			</div>
			{#if !isAdminOrVolunteer}
				<div class="input">
					<Icon src={HiOutlineGlobe} />
					<select bind:value={volunteerData.field} name="field" required>
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
