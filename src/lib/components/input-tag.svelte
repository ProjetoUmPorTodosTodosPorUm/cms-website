<script lang="ts">
	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineCollection from 'svelte-icons-pack/hi/HiOutlineCollection'
	import HiOutlineX from 'svelte-icons-pack/hi/HiOutlineX'

	export let tags: string[] = []
	export let formName: string
	export let placeholder = 'Place your tags here...'

	let inputTagRef: HTMLInputElement

	function onKeyPress(event: KeyboardEvent) {
		if (event.key == ',' || event.key == 'Enter') {
			event.preventDefault()

			tags = [...tags, inputTagRef.value]
			inputTagRef.value = ''
		}
	}

	function onRemoveTag(index: number) {
		tags.splice(index, 1)
		tags = tags
	}
</script>

<Icon src={HiOutlineCollection} />
<input value={tags.join(',')} hidden={true} name={formName} type="text" autocomplete="off" />
<input bind:this={inputTagRef} on:keypress={onKeyPress} {placeholder} autocomplete="off" />
{#if tags?.length > 0}
	<div class="tags">
		{#each tags as tag, index}
			<div class="item">
				{tag}
				<button class="btn-close" on:click|preventDefault={() => onRemoveTag(index)}
					><Icon src={HiOutlineX} /></button
				>
			</div>
		{/each}
	</div>
{/if}
