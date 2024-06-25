<script lang="ts">
	import '$lib/scss/dashboard.scss'
	import '$lib/scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, ImageInput, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { VOLUNTEERS_INPUT_LABELS, VOLUNTEERS_OCCUPATIONS } from '$constants'

	import { Icon } from 'svelte-icons-pack'
	import {
		HiOutlineUser,
		HiOutlineEnvelope,
		HiOutlineCalendar,
		HiOutlineTag,
		HiOutlineBuildingLibrary,
		HiOutlineBars3
	} from 'svelte-icons-pack/hi'

	export let form: ActionData
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
		name: 'Adicionar Voluntário',
		buttonText: ''
	}

	// Form
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
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false} on:click={onSubmit}>
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<ImageInput formName="avatar" altText="Imagem de Perfil" inputLabel="Editar" />
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="firstName" type="text" placeholder={VOLUNTEERS_INPUT_LABELS.firstName} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="lastName" type="text" placeholder={VOLUNTEERS_INPUT_LABELS.lastName} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineEnvelope} />
				<input name="email" type="email" placeholder={VOLUNTEERS_INPUT_LABELS.email} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineCalendar} />
				<input name="joinedDate" type="date" autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineTag} />
				<select name="occupation">
					<option value="" disabled selected>{VOLUNTEERS_INPUT_LABELS.occupation}</option>

					{#each occupations as occupation}
						<option value={occupation.value}>{occupation.text}</option>
					{/each}
				</select>
			</div>
			<div class="input">
				<Icon src={HiOutlineBuildingLibrary} />
				<input name="church" type="text" placeholder={VOLUNTEERS_INPUT_LABELS.church} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="priest" type="text" placeholder={VOLUNTEERS_INPUT_LABELS.priest} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineBars3} />
				<textarea name="observation" placeholder={VOLUNTEERS_INPUT_LABELS.observation} autocomplete="off" rows="5" />
			</div>
			<FieldSelect />
			<div class="input">
				<input on:click={onSubmit} class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
