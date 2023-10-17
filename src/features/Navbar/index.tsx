import React from 'react'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Icon } from '../../components/ui/icon'

interface SidebarProps {
	title: string
	user: {
		username: string
		email: string
	}
	toggleSidebar: () => void
	isSidebarVisible: boolean
}

const index: React.FC<SidebarProps> = ({
	title,
	user,
	toggleSidebar,
	isSidebarVisible,
}) => {
	return (
		<div className="flex w-full justify-between">
			<div className="flex title my-4">
				{!isSidebarVisible && <Icon
					name="hamburger"
					className="cursor-pointer"
					onClick={toggleSidebar}
				/>}
				<h1 className="ml-1 text-lg font-medium">{title}</h1>
			</div>
			<div className="max-md: flex">
				<Avatar className="mr-1 mt-2">
					<AvatarImage />
					<AvatarFallback>TU</AvatarFallback>
				</Avatar>
				<div className="mt-1 flex flex-col">
					<h2 className="text-left">{user.username}</h2>
					<p>{user.email}</p>
				</div>
			</div>
		</div>
	)
}

export default index
