<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { getContext } from 'svelte'
	import { enhance } from '$app/forms'
	import { page } from '$app/stores'
	import { AppContainer, AppContent, ImageInput } from '$components'
	import type { FileDto, UserDto } from '$types'
	import type { PageData, ActionData } from './$types'
	import { editSubmitFunction, fromFilenameToFileDto } from '$utils'
	import type { UserStore } from '$stores'
	import { PROFILE_INPUT_LABELS } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineLockClosed from 'svelte-icons-pack/hi/HiOutlineLockClosed'
	import HiOutlineMinus from 'svelte-icons-pack/hi/HiOutlineMinus'

	export let data: PageData
	export let form: ActionData
	let isLoading = true
	const userStore = getContext<UserStore>('user')
	$: messages = form?.messages || (data.messages as any[])
	$: messages, postActionCallback()
	$: userData = (data.apiData as UserDto) || ((form?.apiData as any)?.user as UserDto)

	function postActionCallback() {
		// ignore first loading triggering
		if (isLoading && messages.length > 0) {
			isLoading = false

			// @TODO away to verify if an error occurred
			if ($page.status === 200) {
				userStore.updateUser(userData)
				erasePassword()
			}
		}
	}

	function onSubmit() {
		isLoading = true
	}

	// App Header
	$: appHeader = {
		name: 'Perfil',
		buttonText: ''
	}

	// Form
	let password: string
	let confirmPassword: string

	function erasePassword() {
		password = ''
		confirmPassword = ''
	}

	// Form
	const initialFile = fromFilenameToFileDto(data.apiData.avatar || '') as FileDto
</script>

<svelte:head>
	<title>Perfil</title>
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
					placeholder={PROFILE_INPUT_LABELS.firstName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					value={userData.lastName}
					name="lastName"
					type="text"
					placeholder={PROFILE_INPUT_LABELS.lastName}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					value={userData.email}
					name="email"
					type="email"
					placeholder={PROFILE_INPUT_LABELS.email}
					autocomplete="off"
					readonly
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineLockClosed} />
				<input
					bind:value={password}
					name="password"
					type="password"
					minlength={8}
					placeholder={PROFILE_INPUT_LABELS.password}
					autocomplete="new-password"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineMinus} />
				<input
					bind:value={confirmPassword}
					name="confirmPassword"
					type="password"
					minlength={8}
					placeholder={PROFILE_INPUT_LABELS.confirmPassword}
					autocomplete="new-password"
				/>
			</div>
			<div class="input">
				<input class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
