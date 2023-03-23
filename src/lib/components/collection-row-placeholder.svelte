<script lang="ts">
  import "$lib/scss/components/collection-row-placeholder.scss";
	import { goto } from "$app/navigation";

	export let description = 'Parece que ainda não há nenhum registro...';
	export let buttonText = 'Adicionar';
	export let buttonLink = '';

	async function onClick() {
		await goto(buttonLink);
	}
</script>

<div class="products-row-placehoder">
	<p>{description}</p>
	<button on:click={onClick}>{buttonText}</button>
</div>
