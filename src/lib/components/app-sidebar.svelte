<script lang="ts">
	import { USER_TEMPLATE } from '$lib/constants';
	import type { AppSidebarMenuItem } from '$lib/types';
	import { Role } from '$lib/enums';
	import type { UserStore } from '$lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import { fade } from 'svelte/transition';
	import { PUBLIC_STATIC_PATH } from '$env/static/public';

	import Icon from 'svelte-icons-pack';
	import HiOutlineHome from 'svelte-icons-pack/hi/HiOutlineHome';
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar';
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone';
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary';
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup';
	import HiOutlineHand from 'svelte-icons-pack/hi/HiOutlineHand';
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe';
	import HiOutlineFolderOpen from 'svelte-icons-pack/hi/HiOutlineFolderOpen';
	import HiOutlineArchive from 'svelte-icons-pack/hi/HiOutlineArchive';
	import HiOutlineChartSquareBar from 'svelte-icons-pack/hi/HiOutlineChartSquareBar';
	import HiOutlineChat from 'svelte-icons-pack/hi/HiOutlineChat';
	import HiOutlineTicket from 'svelte-icons-pack/hi/HiOutlineTicket';
	import HiOutlineUsers from 'svelte-icons-pack/hi/HiOutlineUsers';
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification';
	import HiOutlineHeart from 'svelte-icons-pack/hi/HiOutlineHeart';
	import HiSolidUserCircle from 'svelte-icons-pack/hi/HiSolidUserCircle';
	import { getContext, onMount } from 'svelte';
	import { VERSION } from 'svelte/compiler';
	import type { Locales } from '$src/i18n/i18n-types';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	$: i18n = $LL['app-sidebar'];

	export let locale: Locales;

	// @ts-ignore
	const APP_VERSION = __APP_VERSION__;

	let user = USER_TEMPLATE;
	let userStore = getContext<UserStore>('userStore');
	let active: string = 'painel';
	let isAccoutMenuOpen = false;
	let accountInfoRef: HTMLDivElement;

	onMount(async () => {
		user = userStore.get('user');
		accountInfoRef.classList.toggle('margin-top-auto');

		await loadNamespaceAsync(locale, 'app-sidebar');
		setLocale(locale);
	});

	afterNavigate(async (navigation: Navigation) => {
		const routeId = navigation.to?.route.id;
		if (routeId) {
			active = routeId;
		}
	});

	$: menu = [
		{
			name: i18n.menu.dashboard(),
			href: `/${locale}`,
			icon: HiOutlineHome
		},
		{
			name: i18n.menu.agenda(),
			href: `/${locale}/agenda`,
			icon: HiOutlineCalendar
		},
		{
			name: i18n.menu.announcements(),
			href: `/${locale}/announcements`,
			icon: HiOutlineSpeakerphone
		},
		{
			name: i18n.menu.churches(),
			href: `/${locale}/churches`,
			icon: HiOutlineLibrary
		},
		{
			name: i18n.menu.collaborators(),
			href: `/${locale}/collaborators`,
			icon: HiOutlineUserGroup
		},
		{
			name: i18n.menu.collectedOffers(),
			href: `/${locale}/collected-offers`,
			icon: HiOutlineHand
		},
		{
			name: i18n.menu.fields(),
			href: `/${locale}/fields`,
			icon: HiOutlineGlobe,
			role: Role.WEB_MASTER
		},
		{
			name: i18n.menu.files(),
			href: `/${locale}/files`,
			icon: HiOutlineFolderOpen,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.logs(),
			href: `/${locale}/logs`,
			icon: HiOutlineArchive,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.offerorFamilies(),
			href: `/${locale}/offeror-families`,
			icon: HiOutlineUserGroup
		},
		{
			name: i18n.menu.reports(),
			href: `/${locale}/reports`,
			icon: HiOutlineChartSquareBar
		},
		{
			name: i18n.menu.testimonials(),
			href: `/${locale}/testimonials`,
			icon: HiOutlineChat
		},
		{
			name: i18n.menu.tokens(),
			href: `/${locale}/tokens`,
			icon: HiOutlineTicket
		},
		{
			name: i18n.menu.users(),
			href: `/${locale}/users`,
			icon: HiOutlineUsers,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.volunteers(),
			href: `/${locale}/volunteers`,
			icon: HiOutlineIdentification
		},
		{
			name: i18n.menu.welcomedFamilies(),
			href: `/${locale}/welcomed-families`,
			icon: HiOutlineHeart
		}
	] as AppSidebarMenuItem[];

	$: menuFilteredByRole = filterMenuByRole(menu);

	function filterMenuByRole(menu: AppSidebarMenuItem[]) {
		return menu.filter((item) => {
			if (item.role) {
				return user.role === item.role || user.role === Role.WEB_MASTER;
			} else {
				return true;
			}
		});
	}

	async function toggleAccountMenu(event: MouseEvent) {
		isAccoutMenuOpen = !isAccoutMenuOpen;
		accountInfoRef.classList.toggle('margin-top-auto');
	}

	function isActive(itemHref: string) {
		let pageRootName = active.split('/')[2] || '';

		if (pageRootName) {
			return itemHref.match(pageRootName);
		} else {
			return itemHref.split('/').length == 2;
		}
	}
</script>

<div class="sidebar">
	<div class="sidebar-header">
		<div class="app-icon">
			<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"
				><path
					fill="currentColor"
					d="M507.606 371.054a187.217 187.217 0 00-23.051-19.606c-17.316 19.999-37.648 36.808-60.572 50.041-35.508 20.505-75.893 31.452-116.875 31.711 21.762 8.776 45.224 13.38 69.396 13.38 49.524 0 96.084-19.286 131.103-54.305a15 15 0 004.394-10.606 15.028 15.028 0 00-4.395-10.615zM27.445 351.448a187.392 187.392 0 00-23.051 19.606C1.581 373.868 0 377.691 0 381.669s1.581 7.793 4.394 10.606c35.019 35.019 81.579 54.305 131.103 54.305 24.172 0 47.634-4.604 69.396-13.38-40.985-.259-81.367-11.206-116.879-31.713-22.922-13.231-43.254-30.04-60.569-50.039zM103.015 375.508c24.937 14.4 53.928 24.056 84.837 26.854-53.409-29.561-82.274-70.602-95.861-94.135-14.942-25.878-25.041-53.917-30.063-83.421-14.921.64-29.775 2.868-44.227 6.709-6.6 1.576-11.507 7.517-11.507 14.599 0 1.312.172 2.618.512 3.885 15.32 57.142 52.726 100.35 96.309 125.509zM324.148 402.362c30.908-2.799 59.9-12.454 84.837-26.854 43.583-25.159 80.989-68.367 96.31-125.508.34-1.267.512-2.573.512-3.885 0-7.082-4.907-13.023-11.507-14.599-14.452-3.841-29.306-6.07-44.227-6.709-5.022 29.504-15.121 57.543-30.063 83.421-13.588 23.533-42.419 64.554-95.862 94.134zM187.301 366.948c-15.157-24.483-38.696-71.48-38.696-135.903 0-32.646 6.043-64.401 17.945-94.529-16.394-9.351-33.972-16.623-52.273-21.525-8.004-2.142-16.225 2.604-18.37 10.605-16.372 61.078-4.825 121.063 22.064 167.631 16.325 28.275 39.769 54.111 69.33 73.721zM324.684 366.957c29.568-19.611 53.017-45.451 69.344-73.73 26.889-46.569 38.436-106.553 22.064-167.631-2.145-8.001-10.366-12.748-18.37-10.605-18.304 4.902-35.883 12.176-52.279 21.529 11.9 30.126 17.943 61.88 17.943 94.525.001 64.478-23.58 111.488-38.702 135.912zM266.606 69.813c-2.813-2.813-6.637-4.394-10.615-4.394a15 15 0 00-10.606 4.394c-39.289 39.289-66.78 96.005-66.78 161.231 0 65.256 27.522 121.974 66.78 161.231 2.813 2.813 6.637 4.394 10.615 4.394s7.793-1.581 10.606-4.394c39.248-39.247 66.78-95.96 66.78-161.231.001-65.256-27.511-121.964-66.78-161.231z"
				/></svg
			>
		</div>
	</div>
	<ul class="sidebar-list">
		{#each menuFilteredByRole as item}
			<li class={`sidebar-list-item ${isActive(item.href) ? 'active' : ''}`}>
				<a href={item.href}>
					<Icon src={item.icon} size="1.4rem" />
					<span>{item.name}</span>
				</a>
			</li>
		{/each}
	</ul>

	{#if isAccoutMenuOpen}
		<ul in:fade class="account-menu">
			<li><a href={`/${locale}/profile`}>{i18n.accountMenu.links.profile()}</a></li>
			<li><a href={`/${locale}/logout`}>{i18n.accountMenu.links.logout()}</a></li>
		</ul>
	{/if}

	<div bind:this={accountInfoRef} class="account-info">
		<div class="account-info-picture">
			{#if user.avatar}
				<img src={`${PUBLIC_STATIC_PATH}/${user.avatar}`} alt="Avatar" />
			{:else}
				<Icon src={HiSolidUserCircle} size="2rem" />
			{/if}
		</div>
		<div class="account-info-name" title={`${user.firstName} ${user.lastName || ''}`}>
			{`${user.firstName} ${user.lastName || ''}`}
		</div>
		<button class="account-info-more" on:click={toggleAccountMenu}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="feather feather-more-horizontal"
				><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle
					cx="5"
					cy="12"
					r="1"
				/></svg
			>
		</button>
	</div>
	<div class="app-info">
		<p>Panel v.{APP_VERSION} | Using Svelte {VERSION}</p>
	</div>
</div>
