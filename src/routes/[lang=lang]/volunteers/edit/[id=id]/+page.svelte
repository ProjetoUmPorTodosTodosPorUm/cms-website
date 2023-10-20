<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, ImageInput, FieldSelect } from '$components'
	import type { VolunteerDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: i18n = $LL.volunteers.edit

	export let data: PageData
	export let form: ActionData
	$: volunteerData = (data.apiData as VolunteerDto) || (form?.apiData as VolunteerDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

	onMount(async () => {
		await loadNamespaceAsync(data.locale, 'volunteers')
		setLocale(data.locale)
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

	// App Header
	$: appHeader = {
		name: i18n.appHeader.name(),
		buttonText: ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.avatar || '') as FileDto
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
	]
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
		<form
			class="app-form"
			method="POST"
			action="?/put"
			use:enhance={editSubmitFunction}
			on:submit={onSubmit}
		>
			<ImageInput
				file={initialFile}
				formName="avatar"
				altText={i18n.profilePic.altText()}
				inputLabel={i18n.profilePic.editText()}
			/>

			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.firstName}
					name="firstName"
					type="text"
					placeholder={i18n.inputs.firstNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.lastName}
					name="lastName"
					type="text"
					placeholder={i18n.inputs.lastNameLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					value={volunteerData.email}
					name="email"
					type="email"
					placeholder={i18n.inputs.emailLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input value={volunteerData.joinedDate.split("T")[0]} name="joinedDate" type="date" autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select value={volunteerData.occupation} name="occupation">
					<option value="" disabled selected>{i18n.inputs.occupationLabel()}</option>

					{#each occupations as occupation}
						<option value={occupation.value}>{occupation.text}</option>
					{/each}
				</select>
			</div>
			<div class="input">
				<Icon src={HiOutlineLibrary} />
				<input
					value={volunteerData.church}
					name="church"
					type="text"
					placeholder={i18n.inputs.churchLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.priest}
					name="priest"
					type="text"
					placeholder={i18n.inputs.priestLabel()}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					value={volunteerData.observation}
					name="observation"
					placeholder={i18n.inputs.observationLabel()}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<FieldSelect value={volunteerData.fieldId} />
			<div class="input">
				<input
					on:click={onSubmit}
					class="submit"
					type="submit"
					value={i18n.appHeader.buttonText()}
				/>
			</div>
		</form>
	</AppContent>
</AppContainer>
