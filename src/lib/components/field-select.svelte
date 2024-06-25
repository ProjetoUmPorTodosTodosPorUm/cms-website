<script lang="ts">
	import { getContext } from 'svelte'
	import { page } from '$app/stores'
	import type { UserStore } from '$stores'
	import type { FieldDto } from '$types'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineGlobeAmericas } from 'svelte-icons-pack/hi'

	let userStore = getContext<UserStore>('user')

	export let value = ''
	$: fields = $page.data.fields || ([] as FieldDto[])
</script>

{#if userStore.isWebMaster()}
	<div class="input">
		<Icon src={HiOutlineGlobeAmericas} />
		<select {value} name="field">
			<option value="" disabled selected>Campo Missionário</option>

			{#each fields as field}
				<option value={field.id}>
					{field.abbreviation} - {field.designation}
				</option>
			{/each}
		</select>
	</div>
{/if}
