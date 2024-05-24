import React from 'react'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Icon } from '../../components/ui/icon'
import { UserNav } from './UserNav'

interface SidebarProps {
	title: string
	user: {
		username: string
		email: string
		avatar:string
	}
	toggleSidebar: () => void
	isSidebarVisible: boolean
}

// const SidebarProps = z.object({
// 	title: z.string(),
// 	user: z.object({
// 		username: z.string(),
// 		email: z.string().email(),
// 		avatar: z.string().optional(), // optional string validation
// 	}),
// 	toggleSidebar: z.function(),
// 	isSidebarVisible: z.function(),
// })

const index: React.FC< SidebarProps> = ({
	title,
	user,
	toggleSidebar,
	isSidebarVisible,
}) => {
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
				{/* <Avatar className="mr-1 mt-2">
					<AvatarImage />
					<AvatarFallback>TU</AvatarFallback>
				</Avatar> */}
				<UserNav user={user} />
			</div>
		</div>
	)
}

export default index
