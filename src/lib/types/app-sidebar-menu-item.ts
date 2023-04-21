import type { Role } from '../enums/role';

export type AppSidebarMenuItem = {
    name: string
    href: string
    icon: any
    role?: Role;
}