import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '../../utils/misc'
import { Button, buttonVariants } from '../../components/ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
	items: {
		href: string
		title: string
	}[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
	const pathname = useLocation()

	return (
		<nav
			className={cn(
				'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
				className,
			)}
			{...props}
		>
			{items.map(item => {
				const lastSegment = location.pathname.split('/').pop()
				// const lastSegment = location.pathname

				const isMatch = lastSegment === item.href
				return (
					<NavLink
						key={item.href}
						to={item.href}
						className={({ isActive }) =>
							cn(
								buttonVariants({ variant: 'ghost' }),
								isActive
									? 'bg-muted hover:bg-muted'
									: 'hover:bg-transparent hover:underline',
								'justify-start',
							)
						}
					>
						{item.title}
					</NavLink>
				)
			})}
		</nav>
	)
}
