<script lang="ts">
	import '$scss/components/auth-modal.scss'
	import { Toast } from '$components'
	import { createEventDispatcher } from 'svelte'
	import { enhance } from '$app/forms'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineArrowLeft } from 'svelte-icons-pack/hi'
	import { AiOutlineLoading } from 'svelte-icons-pack/ai'

	export let showBackButton = false

	// Form
	export let title: string
	export let subTitle: string
	export let buttonText: string
	export let isLoading = false
	export let isSubmitDisabled = true
	export let action: string

	// Toast Messages
	export let messages: any[] = []

	// Events
	const dispatch = createEventDispatcher()
	const onSubmit = () => dispatch('submit')
	const onBackButtonClick = () => history.back()
</script>

<div class="login-container">
	<div class="form-container">
		<div class="form-image">
			{#if showBackButton}
				<button on:click|preventDefault={onBackButtonClick}>
					<Icon src={HiOutlineArrowLeft} className="icon" />
				</button>
			{/if}
		</div>
		<div class="form">
			<h2>{title}</h2>
			<p>{subTitle}</p>
			<form method="POST" {action} on:submit|preventDefault|stopPropagation={onSubmit} use:enhance class="form-inputs">
				<slot name="body" />

				{#if isLoading}
					<!-- on:click={submit} -->
					<button disabled={true} type="submit"><Icon src={AiOutlineLoading} className="loading-icon" /></button>
				{:else}
					<button disabled={isSubmitDisabled} type="submit">{buttonText}</button>
				{/if}
			</form>

			<div class="form-links">
				<slot name="links" />
			</div>
		</div>
	</div>

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} />
		{/each}
	</div>
</div>
