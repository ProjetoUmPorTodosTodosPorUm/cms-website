<script lang="ts">
  import '$lib/scss/components/app-content-loading.scss';
	import Icon from "svelte-icons-pack";
	import AiOutlineLoading from "svelte-icons-pack/ai/AiOutlineLoading";

  import { fade } from 'svelte/transition'

  export let isLoading = false;
</script>

{#if isLoading}
<div in:fade out:fade class="loading-overlay">
  <Icon src={AiOutlineLoading} className="loading-icon" />
</div>
{/if}