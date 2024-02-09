<script lang="ts">
	import '$scss/components/app-container.scss'
	import { AppNav, Toast } from '$components'

	export let messages: any[] = []
</script>

<div class="app-container">
	<AppNav />
	<slot />

	<div class="messages-container">
		{#each messages as message (message.id)}
			<Toast {...message} />
		{/each}
	</div>
</div>
