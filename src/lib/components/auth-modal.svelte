<script lang="ts">
	import Toast from '$components/toast.svelte';
	import { createEventDispatcher } from 'svelte';
	import '$lib/scss/components/auth-modal.scss';

	import Icon from 'svelte-icons-pack/Icon.svelte';
	import HiOutlineArrowSmLeft from 'svelte-icons-pack/hi/HiOutlineArrowSmLeft';
	import AiOutlineLoading from 'svelte-icons-pack/ai/AiOutlineLoading';

	export let showBackButton = false;

	// Form
	export let title: string;
	export let subTitle: string;
	export let buttonText: string;
	export let isSending = false;
	export let isSubmitDisabled = true;

	// Toast Messages
	export let messages: any[] = [];

	// Events
	const dispatch = createEventDispatcher();
	const submit = () => dispatch('submit');
	const toastClose = (id: number) => dispatch('toastClose', id);
	const onBackButtonClick = () => history.back();
</script>

<div class="login-container">
	<div class="form-container">
		<div class="form-image">
			{#if showBackButton}
				<button on:click|preventDefault={onBackButtonClick}>
					<Icon src={HiOutlineArrowSmLeft} className="icon" />
				</button>
			{/if}
		</div>
		<div class="form">
			<h2>{title}</h2>
			<p>{subTitle}</p>
			<form on:submit|preventDefault|stopPropagation={submit} class="form-inputs">
				<slot name="body" />

				{#if isSending}
					<button on:click={submit} disabled={true} type="submit"
						><Icon src={AiOutlineLoading} className="icon" /></button
					>
				{:else}
					<button on:click={submit} disabled={isSubmitDisabled} type="submit">{buttonText}</button>
				{/if}
			</form>

			<div class="form-links">
				<slot name="links" />
			</div>
		</div>
	</div>

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} on:close={() => toastClose(message.id)} />
		{/each}
	</div>
</div>
