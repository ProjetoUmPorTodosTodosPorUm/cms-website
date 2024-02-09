<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, ImageInput, FieldSelect } from '$components'
	import type { FileDto, UserDto } from '$types'
	import type { PageData, ActionData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import { USERS_INPUT_LABELS, USERS_ROLES } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification'

	export let data: PageData
	export let form: ActionData
	let isLoading = false
	$: messages = form?.messages || (data.messages as any[])
	$: messages, postActionCallback()
	$: userData = (data.apiData as UserDto) || (form?.apiData as UserDto)

	function postActionCallback() {
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
		name: 'Editar Usuário',
		buttonText: ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.avatar || '') as FileDto
	$: roles = [
		{ value: 'VOLUNTEER', text: USERS_ROLES.volunteer },
		{ value: 'ADMIN', text: USERS_ROLES.admin },
		{ value: 'WEB_MASTER', text: USERS_ROLES.webMaster }
	]
</script>

<svelte:head>
	<title>Usuários</title>
</svelte:head>

<AppContainer {messages}>
	<AppContent {...appHeader} {isLoading} showActions={false} showRefreshButton={false}>
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
					value={userData.firstName}
					name="firstName"
					type="text"
					placeholder={USERS_INPUT_LABELS.firstName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input
					value={userData.lastName}
					name="lastName"
					type="text"
					placeholder={USERS_INPUT_LABELS.lastName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<select value={userData.role} name="role">
					<option value="" disabled selected>{USERS_INPUT_LABELS.role}</option>
					{#each roles as role}
						<option value={role.value}>
							{role.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect value={userData.fieldId} />
			<div class="input">
				<input class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
