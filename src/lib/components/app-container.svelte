<script lang="ts">
	import '$scss/components/app-container.scss'
	import { AppNav, Toast } from '$components'
	import type { Locales } from '$i18n/i18n-types'

	export let messages: any[] = []

	// Component Data - forwarding
	export let locale: Locales
</script>

<div class="app-container">
	<AppNav {locale} />
	<slot />

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} />
		{/each}
	</div>
</div>
