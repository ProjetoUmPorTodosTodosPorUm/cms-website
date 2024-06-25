<script lang="ts">
	import '$scss/components/app-content-loading.scss'
	import { fade } from 'svelte/transition'

	import { Icon } from 'svelte-icons-pack'
	import { AiOutlineLoading } from 'svelte-icons-pack/ai'

	export let isLoading = false
</script>

{#if isLoading}
	<div in:fade out:fade class="loading-overlay">
		<Icon src={AiOutlineLoading} className="loading-icon" />
	</div>
{/if}
