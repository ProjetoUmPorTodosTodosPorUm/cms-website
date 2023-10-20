<script lang="ts">
	import { getContext, onMount } from 'svelte'
	import { page } from '$app/stores'
	import type { UserStore } from '$stores'
	import type { FieldDto } from '$types'

	import Icon from 'svelte-icons-pack/Icon.svelte'
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe'

	let userStore = getContext<UserStore>('user')

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	$: sharedI18n = $LL.shared

	export let value = ''
	$: fields = $page.data.fields || ([] as FieldDto[])

	onMount(async () => {
		await loadNamespaceAsync($page.data.locale, 'shared')
		setLocale($page.data.locale)
	})
</script>

{#if userStore.isWebMaster()}
	<div class="input">
		<Icon src={HiOutlineGlobe} />
		<select {value} name="field">
			<option value="" disabled selected>{sharedI18n.inputs.fieldLabel()}</option>

			{#each fields as field}
				<option value={field.id}>
					{field.abbreviation} - {field.designation}
				</option>
			{/each}
		</select>
	</div>
{/if}
