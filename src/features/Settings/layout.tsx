import React from 'react'
import { Separator } from '../../components/separator'
import { SidebarNav } from './SideNav'

const sidebarNavItems = [
	{
		title: 'Profile',
		href: '/app/settings/profile',
	},
	{
		title: 'School',
		href: '/app/settings/school',
	},
	{
		title: 'Users',
		href: '/app/settings/users',
	},
	{
		title: 'Roles',
		href: '/app/settings/roles',
	},
]

interface SettingsLayoutProps {
	children: React.ReactNode
}

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
	return (
		<div className="hidden space-y-6 p-10 pb-16 text-left md:block">
			<div className="space-y-0.5">
				<h2 className="text-2xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">
					Manage your account settings and set e-mail preferences.
				</p>
			</div>
			<Separator className="my-6" />
			<div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="-mx-4 lg:w-1/5">
					<SidebarNav items={sidebarNavItems} />
				</aside>
				<div className="flex-1 lg:max-w-5xl">{children}</div>
			</div>
		</div>
	)
}

export default SettingsLayout