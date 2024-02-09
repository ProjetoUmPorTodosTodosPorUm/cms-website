<script lang="ts">
	import '$scss/dashboard.scss'
	import '$scss/dashboard-form.scss'
	import { enhance } from '$app/forms'
	import { AppContainer, AppContent, FieldSelect } from '$components'
	import type { ActionData } from './$types'
	import { USERS_INPUT_LABELS, USERS_ROLES } from '$constants'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineMail from 'svelte-icons-pack/hi/HiOutlineMail'
	import HiOutlineUser from 'svelte-icons-pack/hi/HiOutlineUser'
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification'

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
		name: 'Adicionar Usuário',
		buttonText: ''
	}

	// Form
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
		<form class="app-form" method="POST" action="?/post" use:enhance on:submit={onSubmit}>
			<div class="input">
				<Icon src={HiOutlineUser} />
				<input name="name" type="text" placeholder={USERS_INPUT_LABELS.name} autocomplete="off" />
			</div>
			<div class="input">
				<Icon src={HiOutlineMail} />
				<input
					name="email"
					type="email"
					placeholder={USERS_INPUT_LABELS.email}
					autocomplete="off"
				/>
			</div>
			<div class="input">
				<Icon src={HiOutlineIdentification} />
				<select name="role">
					<option value="" disabled selected>{USERS_INPUT_LABELS.role}</option>
					{#each roles as role}
						<option value={role.value}>
							{role.text}
						</option>
					{/each}
				</select>
			</div>
			<FieldSelect />
			<div class="input">
				<input class="submit" type="submit" value="Salvar" />
			</div>
		</form>
	</AppContent>
</AppContainer>
