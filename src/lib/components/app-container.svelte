<script lang="ts">
	import '$lib/scss/components/app-container.scss';
	import AppNav from '$src/lib/components/app-nav.svelte';
	import Toast from '$components/toast.svelte';
	import type { Locales } from '$src/i18n/i18n-types';

	export let messages: any[] = [];

	// Component Data - forwarding
	export let locale: Locales;
</script>

<div class="app-container">
	<AppNav {locale} />
	<slot />

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} {locale} />
		{/each}
	</div>
</div>
