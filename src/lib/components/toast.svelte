<script context="module" lang="ts">
	export function generateMessages(messages: { message: string; variant?: string }[]) {
		return messages.map((msg) => ({
			id: `${Math.floor(Math.random() * Date.now())}`,
			message: msg.message,
			variant: msg.variant ?? 'danger'
		}));
	}
</script>

<script lang="ts">
	import "$lib/scss/components/toast.scss";
	import { createEventDispatcher } from 'svelte';
	import { fade } from 'svelte/transition';

	export let isOpen = true;
	export let id = 0;
	export let message = '';
	export let variant = 'danger';
	export let autoHide = true;
	export let duration = 5;

	const dispatch = createEventDispatcher();

	function close() {
		isOpen = false;
		dispatch('close', id);
	}

	if (autoHide) {
		setTimeout(() => {
			close();
		}, duration * 1000);
	}
</script>

{#if isOpen}
	<div in:fade out:fade class={`toast bg-${variant}`}>
		<div class="toast-body text-white">
			<p>{message}</p>
		</div>
		<button on:click={close} class={`toast-close text-${variant}`}>Fechar</button>
	</div>
{/if}