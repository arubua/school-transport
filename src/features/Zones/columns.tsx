'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { getInitials } from '../../utils/getInitials'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { Button } from '../../components/ui/button'
import { Icon } from '../../components/ui/icon'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Bus = {
	id: string
	reg_number: string
	capacity: string
	driver: string
	school: string
	image: string
}

export const columns: ColumnDef<Bus>[] = [
	{
		accessorKey: 'reg_number',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Registration No.
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let reg_number = row.original.reg_number
			let image = row.original.image
			let school = row.original.school

			return (
				<div className="flex items-center">
					<Avatar>
						<AvatarImage src={image} alt={reg_number} />
						<AvatarFallback>{getInitials(reg_number)}</AvatarFallback>
					</Avatar>
					<div className="ml-1">
						<div className=" text-left">{reg_number}</div>
						<div className="flex text-muted-foreground ">
							{/* <span>{`Grade ${grade}`}</span> */}
							<span>{`${school} School`}</span>
						</div>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'driver',
		header: () => <div className="text-left">Driver</div>,
		cell: ({ row }) => {
			let driver = row.original.driver

			return (
				<div className="text-left">
					{driver}
				</div>
			)
		},
	},
	{
		accessorKey: 'capacity',
		header: () => <div className="text-left">Capacity</div>,
		cell: ({ row }) => {
			let capacity = row.original.capacity
			return <div className="text-left">{capacity}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const parent = row.original

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Icon name="dots-horizontal" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(parent.id)}
						>
							View bus details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Change driver</DropdownMenuItem>
						<DropdownMenuItem>Deactivate Bus</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
