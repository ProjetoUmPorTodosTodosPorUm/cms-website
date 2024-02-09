<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, ImageInput, FieldSelect } from '$components'
	import type { VolunteerDto, FileDto } from '$types'
	import type { ActionData, PageData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import { VOLUNTEERS_INPUT_LABELS, VOLUNTEERS_OCCUPATIONS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'
	import HiOutlineTag from 'svelte-icons-pack/hi/HiOutlineTag'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2'

	export let data: PageData
	export let form: ActionData
	$: volunteerData = (data.apiData as VolunteerDto) || (form?.apiData as VolunteerDto)
	let isLoading = false
	$: messages = form?.messages ?? []
	$: messages, postActionCallback()

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
		name: 'Editar Voluntário',
		buttonText: ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.avatar || '') as FileDto
	$: occupations = [
		{ value: 'PRESIDENT', text: VOLUNTEERS_OCCUPATIONS.president },
		{ value: 'VICE_PRESIDENT', text: VOLUNTEERS_OCCUPATIONS.vicePresident },
		{ value: 'GENERAL_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.geralCoordinator },
		{ value: 'COORDINATOR_01', text: VOLUNTEERS_OCCUPATIONS.coordinator01 },
		{ value: 'COUNSELOR_01', text: VOLUNTEERS_OCCUPATIONS.counselor01 },
		{ value: 'COUNSELOR_02', text: VOLUNTEERS_OCCUPATIONS.counselor02 },
		{ value: 'COUNSELOR_03', text: VOLUNTEERS_OCCUPATIONS.counselor03 },
		{ value: 'WEB_MASTER', text: VOLUNTEERS_OCCUPATIONS.webMaster },
		{ value: 'TREASURER_01', text: VOLUNTEERS_OCCUPATIONS.treasurer01 },
		{ value: 'TREASURER_02', text: VOLUNTEERS_OCCUPATIONS.treasurer02 },
		{ value: 'ACADEMIC_INSTRUCTOR_01', text: VOLUNTEERS_OCCUPATIONS.academicInstructor01 },
		{ value: 'ACADEMIC_INSTRUCTOR_02', text: VOLUNTEERS_OCCUPATIONS.academicInstructor02 },
		{ value: 'EXECUTIVE_SECRETARY', text: VOLUNTEERS_OCCUPATIONS.executiveSecretary },
		{ value: 'AUXILIARY_SECRETARY', text: VOLUNTEERS_OCCUPATIONS.auxiliarySecretary },
		{ value: 'COORDINATOR_02', text: VOLUNTEERS_OCCUPATIONS.coordinator02 },
		{ value: 'INFIELD_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.infieldCoordinator },
		{ value: 'OUTFIELD_COORDINATOR', text: VOLUNTEERS_OCCUPATIONS.outfieldCoordinator },
		{ value: 'COLLECTOR', text: VOLUNTEERS_OCCUPATIONS.collector },
		{ value: 'SUPPORT_SERVICE', text: VOLUNTEERS_OCCUPATIONS.supportService }
	]
</script>

<svelte:head>
	<title>Voluntários</title>
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
			<ImageInput
				file={initialFile}
				formName="avatar"
				altText="Imagem de Perfil"
				inputLabel="Editar"
			/>

			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.firstName}
					name="firstName"
					type="text"
					placeholder={VOLUNTEERS_INPUT_LABELS.firstName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.lastName}
					name="lastName"
					type="text"
					placeholder={VOLUNTEERS_INPUT_LABELS.lastName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					value={volunteerData.email}
					name="email"
					type="email"
					placeholder={VOLUNTEERS_INPUT_LABELS.email}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input
					value={volunteerData.joinedDate.split('T')[0]}
					name="joinedDate"
					type="date"
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select value={volunteerData.occupation} name="occupation">
					<option value="" disabled selected>{VOLUNTEERS_INPUT_LABELS.occupation}</option>

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
					placeholder={VOLUNTEERS_INPUT_LABELS.church}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={volunteerData.priest}
					name="priest"
					type="text"
					placeholder={VOLUNTEERS_INPUT_LABELS.priest}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMenuAlt2} />
				<textarea
					value={volunteerData.observation}
					name="observation"
					placeholder={VOLUNTEERS_INPUT_LABELS.observation}
					autocomplete="off"
					rows="5"
				/>
			</div>
			<FieldSelect value={volunteerData.fieldId} />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
