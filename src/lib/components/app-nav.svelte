<script lang="ts">
	import '$scss/components/app-nav.scss'
	import imageAsset from '$assets/images/logo.png'
	import type { AppNavMenuItem, Pagination } from '$types'
	import { Role } from '$enums'
	import type { UserStore } from '$stores'

	import { Icon } from 'svelte-icons-pack'
	import {
		HiOutlineBars3CenterLeft,
		HiOutlineBars3,
		HiOutlineHome,
		HiOutlineCalendar,
		HiOutlineMegaphone,
		HiOutlineBuildingLibrary,
		HiOutlineUserGroup,
		HiOutlineHandRaised,
		HiOutlineGlobeAmericas,
		HiOutlineFolderOpen,
		HiOutlineArchiveBox,
		HiOutlineChartBarSquare,
		HiOutlineChatBubbleBottomCenterText,
		HiOutlineTicket,
		HiOutlineUsers,
		HiOutlineIdentification,
		HiOutlineHeart,
		HiSolidUserCircle,
		HiOutlineArrowRightOnRectangle
	} from 'svelte-icons-pack/hi'
	import { BsHouseHeart } from 'svelte-icons-pack/bs'

	import { getContext } from 'svelte'
	import { VERSION } from '@sveltejs/kit'
	import { fromPaginationToQuery } from '$utils'
	import SwitchTheme from './switch-theme.svelte'
	import { page } from '$app/stores'

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
	let currentMenuIcon = HiOutlineBars3

	$: menu = [
		{
			name: 'Dashboard',
			href: `/`,
			icon: HiOutlineHome
		},
		{
			name: 'Agenda',
			href: `/agenda?${queryString}`,
			icon: HiOutlineCalendar
		},
		{
			name: 'Arquivos',
			href: `/files?${createdAtQueryString}`,
			icon: HiOutlineFolderOpen,
			role: Role.ADMIN
		},
		{
			name: 'Avisos',
			href: `/announcements?${queryString}`,
			icon: HiOutlineMegaphone
		},
		{
			name: 'Campos Missionários',
			href: `/fields?${queryString}`,
			icon: HiOutlineGlobeAmericas,
			role: Role.WEB_MASTER
		},
		{
			name: 'Casas de Recuperação',
			href: `/recovery-houses?${queryString}`,
			icon: BsHouseHeart
		},
		{
			name: 'Colaboradores',
			href: `/collaborators?${queryString}`,
			icon: HiOutlineUserGroup
		},
		{
			name: 'Contatos',
			href: `/contacts?${queryString}`,
			icon: HiOutlineChatBubbleBottomCenterText
		},
		{
			name: 'Famílias Acolhidas',
			href: `/welcomed-families?${queryString}`,
			icon: HiOutlineHeart
		},
		{
			name: 'Famílias Ofertantes',
			href: `/offeror-families?${queryString}`,
			icon: HiOutlineUserGroup
		},
		{
			name: 'Igrejas',
			href: `/churches?${queryString}`,
			icon: HiOutlineBuildingLibrary
		},
		{
			name: 'Logs',
			href: `/logs?${createdAtQueryString}`,
			icon: HiOutlineArchiveBox,
			role: Role.ADMIN
		},

		{
			name: 'Ofertas Coletadas',
			href: `/collected-offers?${queryString}`,
			icon: HiOutlineHandRaised
		},

		{
			name: 'Relatórios',
			href: `/reports?${queryString}`,
			icon: HiOutlineChartBarSquare
		},
		{
			name: 'Testemunhos',
			href: `/testimonials?${queryString}`,
			icon: HiOutlineChatBubbleBottomCenterText
		},
		{
			name: 'Tokens',
			href: `/tokens?${createdAtQueryString}`,
			icon: HiOutlineTicket,
			role: Role.ADMIN
		},
		{
			name: 'Usuários',
			href: `/users?${queryString}`,
			icon: HiOutlineUsers,
			role: Role.ADMIN
		},
		{
			name: 'Voluntários',
			href: `/volunteers?${queryString}`,
			icon: HiOutlineIdentification
		},
		{
			name: 'separator'
		},
		{
			name: 'Perfil',
			href: `/profile`,
			icon: HiSolidUserCircle
		},
		{
			name: 'Logout',
			href: `/logout`,
			icon: HiOutlineArrowRightOnRectangle
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
		let pageRootName = active.split('/')[1] || ''

		if (pageRootName) {
			return itemHref.match(pageRootName)
		} else {
			return itemHref == '/'
		}
	}

	function onNavToggle() {
		navToggleIconRef.classList.toggle('open')
		navListRef.classList.toggle('open')

		currentMenuIcon = currentMenuIcon == HiOutlineBars3 ? HiOutlineBars3CenterLeft : HiOutlineBars3
		navIconComponentRef.$set({ src: currentMenuIcon })
	}
</script>

<nav class="app-nav">
	<div class="app-nav-header">
		<div class="app-icon">
			<a href={`/`}>
				<img src={imageAsset} alt="logo" title={'Panel | Projeto "Um Por Todos! Todos Por Um."'} />
			</a>
		</div>

		<div bind:this={navToggleIconRef} class="toggle-icon">
			<a href="#icon" on:click={onNavToggle}> <Icon bind:this={navIconComponentRef} src={HiOutlineBars3} /></a>
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
		<span>Olá, {userFullname}</span>
		<span>Panel v.{APP_VERSION} | Using Svelte Kit {VERSION}</span>
	</div>

	<div class="app-choices">
		<SwitchTheme />
	</div>
</nav>
