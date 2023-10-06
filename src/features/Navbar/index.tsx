import React from 'react'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'

interface SidebarProps {
	title: string
	user: object
	onToggle: () => void
}

const index: React.FC<SidebarProps> = ({ title, user, onToggle }) => {
	return (
		<div className="flex w-full justify-between">
			<div className="title my-4">
				<h1 className="ml-1 text-lg font-medium">App Title Here</h1>
			</div>
			<div className="max-md: flex">
				<Avatar className="mr-1 mt-2">
					<AvatarImage />
					<AvatarFallback>TU</AvatarFallback>
				</Avatar>
				<div className="mt-1 flex flex-col">
					<h2 className="text-left">Test User</h2>
					<p>testuser@gmail.com</p>
				</div>
			</div>
		</div>
	)
}

export default index
