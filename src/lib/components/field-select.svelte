<script lang="ts">
	import { page } from '$app/stores'
	import type { FieldDto } from '$types'
	import { Role } from '$enums'

	import { Icon } from 'svelte-icons-pack'
	import { HiOutlineGlobeAmericas } from 'svelte-icons-pack/hi'

	export let value = ''
	$: fields = $page.data.fields || ([] as FieldDto[])
	$: user = $page.data.user
</script>

{#if user?.role === Role.WEB_MASTER}
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
