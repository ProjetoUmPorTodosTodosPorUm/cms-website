<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';
	import '$lib/scss/themes.scss';
	import { SettingsStore } from '$lib/store/settings';
	import { UserStore } from '$src/lib/store/user';
	import { delay } from '$src/lib/utils/functions';
	import type { Navigation } from '@sveltejs/kit';
	import { setContext } from 'svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	setContext('settingsStore', new SettingsStore());
	let userStore = setContext('userStore', new UserStore());

	const publicRouteIds = [
		'/[lang=lang]/login',
		'/[lang=lang]/signup',
		'/[lang=lang]/forgot-password'
	];
	const adminRouteIds = /(\/files.*|\/logs.*|\/users.*)/;
	const webmasterRouteId = /(\/fields.*)/;

	beforeNavigate(async (navigation: Navigation) => {
		const fromRouteId = navigation.from?.route.id;
		if (fromRouteId && ['/[lang=lang]/login', '/[lang=lang]/logout'].includes(fromRouteId)) {
			// needs to reload with new info after login
			userStore.init();
		}

		await redirectIfNotLogged(navigation);
		await redirectIfNotAdmin(navigation);
	});

	afterNavigate(async (navigation: Navigation) => {
		while (!userStore.get('isReady')) {
			console.log('isNotReady');
			await delay(50);
		}

		await userStore.isTokenValid();
		await redirectIfNotLogged(navigation);
		await redirectIfNotAdmin(navigation);
	});

	async function redirectIfNotLogged(navigation: Navigation) {
		const routeId = navigation.to?.route.id;

		if (routeId) {
			if (!isPublicRoute(routeId)) {
				if (!userStore.get('isUserLogged')) {
					await goto(`/${data.locale}/login`);
				}
			} else if (isPublicRoute(routeId)) {
				if (userStore.get('isUserLogged')) {
					await goto(`/${data.locale}`);
				}
			}
		}
	}

	async function redirectIfNotAdmin(navigation: Navigation) {
		const routeId = navigation.to?.route.id;
		const fromRouteId = navigation.from?.route.id;

		if (routeId && adminRouteIds.test(routeId)) {
			if (!userStore.isAdmin() && !userStore.isWebMaster()) {
				if (fromRouteId) {
					window.history.back();
				} else {
					await goto(`/${data.locale}`);
				}
			}
		} else if (routeId && webmasterRouteId.test(routeId)) {
			if (!userStore.isWebMaster()) {
				if (fromRouteId) {
					window.history.back();
				} else {
					await goto(`/${data.locale}`);
				}
			}
		}
	}

	function isPublicRoute(routeId: string) {
		return publicRouteIds.includes(routeId);
	}
</script>

<slot />
