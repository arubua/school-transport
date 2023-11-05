import React from 'react'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Icon } from '../../components/ui/icon'

interface SidebarProps {
	title: string
	user: {
		firstName: string
		lastName: string
		email: string
		image: string
	}
	toggleSidebar: () => void
	isSidebarVisible: boolean
}

const NavBar: React.FC<SidebarProps> = ({
	title,
	user,
	toggleSidebar,
	isSidebarVisible,
}) => {

	const username = `${user.firstName} ${user.lastName}`
	return (
		<div className="flex w-full justify-between">
			<div className="title my-4 flex">
				{!isSidebarVisible && (
					<Icon
						name="hamburger"
						className="cursor-pointer"
						onClick={toggleSidebar}
					/>
				)}
				<h1 className="ml-1 text-lg font-medium">{title}</h1>
			</div>
			<div className="max-md: flex">
				<Avatar className="mr-1 mt-2">
					<AvatarImage src={user.image} />
					<AvatarFallback>TU</AvatarFallback>
				</Avatar>
				<div className="mt-1 flex flex-col">
					<h2 className="text-left">{username}</h2>
					<p>{user.email}</p>
				</div>
			</div>
		</div>
	)
}

export default NavBar
