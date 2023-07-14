<script lang="ts">
	import '$lib/scss/components/app-nav.scss';
	import type { AppNavMenuItem } from '$lib/types';
	import { Role } from '$lib/enums';
	import type { UserStore } from '$lib/store/user';
	import { afterNavigate } from '$app/navigation';
	import type { Navigation } from '@sveltejs/kit';
	import SwitchLocale from '$components/switch-locale.svelte';

	import Icon from 'svelte-icons-pack';
	import HiOutlineMenu from 'svelte-icons-pack/hi/HiOutlineMenu';
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2';
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
	import HiOutlineLogout from 'svelte-icons-pack/hi/HiOutlineLogout';
	import { getContext, onMount } from 'svelte';
	import { VERSION } from 'svelte/compiler';
	import type { Locales, Namespaces } from '$src/i18n/i18n-types';

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async';
	import LL, { setLocale } from '$i18n/i18n-svelte';
	import SwitchTheme from './switch-theme.svelte';
	$: i18n = $LL['app-nav'];

	export let locale: Locales;

	// @ts-ignore
	const APP_VERSION = __APP_VERSION__;

	let userStore = getContext<UserStore>('userStore');
	let user = userStore.get('user');
	$: userFullname = `${user.firstName} ${user.lastName || ''}`;

	let active: string = 'painel';

	let navListRef: HTMLElement;
	let navToggleIconRef: HTMLDivElement;
	let navIconComponentRef: Icon;
	let currentMenuIcon = HiOutlineMenuAlt2;

	onMount(async () => {
		await loadNamespaceAsync(locale, 'app-nav');
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
		},
		{
			name: 'separator'
		},
		{
			name: i18n.accountMenu.links.profile(),
			href: `/${locale}/profile`,
			icon: HiSolidUserCircle
		},
		{
			name: i18n.accountMenu.links.logout(),
			href: `/${locale}/logout`,
			icon: HiOutlineLogout
		}
	] as AppNavMenuItem[];

	$: menuFilteredByRole = filterMenuByRole(menu);

	function filterMenuByRole(menu: AppNavMenuItem[]) {
		return menu.filter((item) => {
			if (item.role) {
				return user.role === item.role || user.role === Role.WEB_MASTER;
			} else {
				return true;
			}
		});
	}

	function isActive(itemHref: string) {
		let pageRootName = active.split('/')[2] || '';

		if (pageRootName) {
			return itemHref.match(pageRootName);
		} else {
			return itemHref.split('/').length == 2;
		}
	}

	function namespacesByActivePage(activePage: string) {
		let namespaces = [
			'app-actions',
			'app-header',
			'app-nav',
			'collection-header',
			'collection-row',
			'collection-row-placeholder',
			'shared',
			'toast'
		] as Namespaces[];
		if (activePage) {
			namespaces.push(activePage as Namespaces);
		}

		return namespaces;
	}

	function onNavToggle() {
		navToggleIconRef.classList.toggle('open');
		navListRef.classList.toggle('open');

		currentMenuIcon = currentMenuIcon == HiOutlineMenu ? HiOutlineMenuAlt2 : HiOutlineMenu;
		navIconComponentRef.$set({ src: currentMenuIcon });
	}
</script>

<nav class="app-nav">
	<div class="app-nav-header">
		<div class="app-icon">
			<a href={`/${locale}`}>
				<img
					src="/images/logo.png"
					alt="logo"
					title='Projeto "Um Por Todos! Todos Por Um." '
				/>
			</a>
		</div>

		<div bind:this={navToggleIconRef} class="toggle-icon">
			<a href="#icon" on:click={onNavToggle}>
				<Icon bind:this={navIconComponentRef} src={HiOutlineMenuAlt2} /></a
			>
		</div>
	</div>
	<ul bind:this={navListRef} class="app-nav-list">
		{#each menuFilteredByRole as item}
			{#if item.name !== 'separator'}
				<li class={`app-nav-list-item ${isActive(item.href) ? 'active' : ''}`}>
					<a href={item.href}>
						<Icon src={item.icon} />
						<span>{item.name}</span>
					</a>
				</li>
			{:else}
				<hr class="app-nav-list-separator" />
			{/if}
		{/each}
	</ul>

	<div class="app-info">
		<span>{i18n.userMessage({ name: userFullname })}</span>
		<span>Panel v.{APP_VERSION} | Using Svelte {VERSION}</span>
	</div>

	<div class="app-choices">
		<SwitchLocale namespaces={namespacesByActivePage(active.split('/')[2] || '')} />
		<SwitchTheme {locale} />
	</div>
</nav>
