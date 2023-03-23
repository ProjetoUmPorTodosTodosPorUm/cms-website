<script lang="ts">
	import AppSidebar from '$components/app-sidebar.svelte';
	import Toast from '$components/toast.svelte';
	import type { Locales } from '$src/i18n/i18n-types';

	export let messages: any[] = [];

	// Component Data - forwarding
	export let locale: Locales;
</script>

<div class="app-container">
	<AppSidebar {locale} />
	<slot />

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} />
		{/each}
	</div>
</div>
