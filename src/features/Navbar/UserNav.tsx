import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Button } from '../../components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { getInitials } from '../../utils/getInitials'
import { useNavigate } from 'react-router-dom'

const UserProps = z.object({
	user: z.object({
		username: z.string(),
		email: z.string().email(),
		avatar: z.string().optional(), // optional string validation
	}),
})

type User = z.infer<typeof UserProps>

export const UserNav: React.FC<User> = ({ user }) => {
	const { avatar, username, email } = user

	const navigate = useNavigate()

	console.log({ user })

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative m-2 h-10 w-10 rounded-full">
					<Avatar className="h-10 w-10 ">
						<AvatarImage src={avatar} alt={username} />
						<AvatarFallback>{getInitials(username)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 border-border/20"
				align="end"
				forceMount
			>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{username}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup className="cursor-pointer">
					<DropdownMenuItem>
						Home
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Settings
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
					{/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						localStorage.clear()
						sessionStorage.clear()
						navigate('/auth/login')
					}}
					className="cursor-pointer"
				>
					Log out
					<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
