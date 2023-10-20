<script lang="ts">
	import '$scss/components/app-nav.scss'
	import imageAsset from '$assets/images/logo.png'
	import type { AppNavMenuItem, Pagination } from '$types'
	import { Role } from '$enums'
	import type { UserStore } from '$stores'
	import { SwitchLocale } from '$components'

	import Icon from 'svelte-icons-pack'
	import HiOutlineMenu from 'svelte-icons-pack/hi/HiOutlineMenu'
	import HiOutlineMenuAlt2 from 'svelte-icons-pack/hi/HiOutlineMenuAlt2'
	import HiOutlineHome from 'svelte-icons-pack/hi/HiOutlineHome'
	import HiOutlineCalendar from 'svelte-icons-pack/hi/HiOutlineCalendar'
	import HiOutlineSpeakerphone from 'svelte-icons-pack/hi/HiOutlineSpeakerphone'
	import HiOutlineLibrary from 'svelte-icons-pack/hi/HiOutlineLibrary'
	import HiOutlineUserGroup from 'svelte-icons-pack/hi/HiOutlineUserGroup'
	import HiOutlineHand from 'svelte-icons-pack/hi/HiOutlineHand'
	import HiOutlineGlobe from 'svelte-icons-pack/hi/HiOutlineGlobe'
	import HiOutlineFolderOpen from 'svelte-icons-pack/hi/HiOutlineFolderOpen'
	import HiOutlineArchive from 'svelte-icons-pack/hi/HiOutlineArchive'
	import HiOutlineChartSquareBar from 'svelte-icons-pack/hi/HiOutlineChartSquareBar'
	import HiOutlineChat from 'svelte-icons-pack/hi/HiOutlineChat'
	import HiOutlineTicket from 'svelte-icons-pack/hi/HiOutlineTicket'
	import HiOutlineUsers from 'svelte-icons-pack/hi/HiOutlineUsers'
	import HiOutlineIdentification from 'svelte-icons-pack/hi/HiOutlineIdentification'
	import HiOutlineHeart from 'svelte-icons-pack/hi/HiOutlineHeart'
	import HiSolidUserCircle from 'svelte-icons-pack/hi/HiSolidUserCircle'
	import HiOutlineLogout from 'svelte-icons-pack/hi/HiOutlineLogout'

	import { getContext, onMount } from 'svelte'
	import { VERSION } from 'svelte/compiler'
	import { fromPaginationToQuery } from '$utils'

	// i18n
	import { loadNamespaceAsync } from '$i18n/i18n-util.async'
	import type { Locales, Namespaces } from '$i18n/i18n-types'
	import LL, { setLocale } from '$i18n/i18n-svelte'
	import SwitchTheme from './switch-theme.svelte'
	import { page } from '$app/stores'
	$: i18n = $LL['app-nav']

	export let locale: Locales

	const pagination: Pagination = {
		page: 1,
		deleted: false,
		itemsPerPage: 20,
		orderKey: 'updatedAt',
		orderValue: 'desc',
		search: ''
	}
	const queryString = fromPaginationToQuery(pagination)

	const createdAtPagination: Pagination = {
		page: 1,
		deleted: false,
		itemsPerPage: 20,
		orderKey: 'createdAt',
		orderValue: 'desc',
		search: ''
	}
	const createdAtQueryString = fromPaginationToQuery(createdAtPagination)

	// @ts-ignore
	const APP_VERSION = __APP_VERSION__

	const userStore = getContext<UserStore>('user')
	$: user = userStore.get()
	$: userFullname = `${user.firstName} ${user.lastName || ''}`

	$: active = $page.route.id || ''

	let navListRef: HTMLElement
	let navToggleIconRef: HTMLDivElement
	let navIconComponentRef: Icon
	let currentMenuIcon = HiOutlineMenuAlt2

	onMount(async () => {
		await loadNamespaceAsync(locale, 'app-nav')
		setLocale(locale)
	})

	$: menu = [
		{
			name: i18n.menu.dashboard(),
			href: `/${locale}`,
			icon: HiOutlineHome
		},
		{
			name: i18n.menu.agenda(),
			href: `/${locale}/agenda?${queryString}`,
			icon: HiOutlineCalendar
		},
		{
			name: i18n.menu.announcements(),
			href: `/${locale}/announcements?${queryString}`,
			icon: HiOutlineSpeakerphone
		},
		{
			name: i18n.menu.churches(),
			href: `/${locale}/churches?${queryString}`,
			icon: HiOutlineLibrary
		},
		{
			name: i18n.menu.collaborators(),
			href: `/${locale}/collaborators?${queryString}`,
			icon: HiOutlineUserGroup
		},
		{
			name: i18n.menu.collectedOffers(),
			href: `/${locale}/collected-offers?${queryString}`,
			icon: HiOutlineHand
		},
		{
			name: i18n.menu.fields(),
			href: `/${locale}/fields?${queryString}`,
			icon: HiOutlineGlobe,
			role: Role.WEB_MASTER
		},
		{
			name: i18n.menu.files(),
			href: `/${locale}/files?${createdAtQueryString}`,
			icon: HiOutlineFolderOpen,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.logs(),
			href: `/${locale}/logs?${createdAtQueryString}`,
			icon: HiOutlineArchive,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.offerorFamilies(),
			href: `/${locale}/offeror-families?${queryString}`,
			icon: HiOutlineUserGroup
		},
		{
			name: i18n.menu.reports(),
			href: `/${locale}/reports?${queryString}`,
			icon: HiOutlineChartSquareBar
		},
		{
			name: i18n.menu.testimonials(),
			href: `/${locale}/testimonials?${queryString}`,
			icon: HiOutlineChat
		},
		{
			name: i18n.menu.tokens(),
			href: `/${locale}/tokens?${createdAtQueryString}`,
			icon: HiOutlineTicket,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.users(),
			href: `/${locale}/users?${queryString}`,
			icon: HiOutlineUsers,
			role: Role.ADMIN
		},
		{
			name: i18n.menu.volunteers(),
			href: `/${locale}/volunteers?${queryString}`,
			icon: HiOutlineIdentification
		},
		{
			name: i18n.menu.welcomedFamilies(),
			href: `/${locale}/welcomed-families?${queryString}`,
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
	] as AppNavMenuItem[]

	$: menuFilteredByRole = filterMenuByRole(menu)

	function filterMenuByRole(menu: AppNavMenuItem[]) {
		return menu.filter((item) => {
			if (item.role) {
				return user.role === item.role || user.role === Role.WEB_MASTER
			} else {
				return true
			}
		})
	}

	function isActive(itemHref: string) {
		let pageRootName = active.split('/')[2] || ''

		if (pageRootName) {
			return itemHref.match(pageRootName)
		} else {
			return itemHref.split('/').length == 2
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
		] as Namespaces[]
		if (activePage) {
			namespaces.push(activePage as Namespaces)
		}

		return namespaces
	}

	function onNavToggle() {
		navToggleIconRef.classList.toggle('open')
		navListRef.classList.toggle('open')

		currentMenuIcon = currentMenuIcon == HiOutlineMenu ? HiOutlineMenuAlt2 : HiOutlineMenu
		navIconComponentRef.$set({ src: currentMenuIcon })
	}

	function isLogoutHref(item: AppNavMenuItem) {
		return item.href === `/${locale}/logout`
	}
</script>

<nav class="app-nav">
	<div class="app-nav-header">
		<div class="app-icon">
			<a href={`/${locale}`}>
				<img src={imageAsset} alt="logo" title={'Panel | Projeto "Um Por Todos! Todos Por Um."'} />
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
				<li class="app-nav-list-item" class:active={isActive(item.href)}>
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
