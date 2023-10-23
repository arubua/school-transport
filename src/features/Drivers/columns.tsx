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
export type Driver = {
	id: string
	name: string
	phone_number: string
	bus: string
	image: string
}

export const columns: ColumnDef<Driver>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Driver Name
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let name = row.original.name
			let image = row.original.image

			return (
				<div className="flex items-center">
					<Avatar>
						<AvatarImage src={image} alt={name} />
						<AvatarFallback>{getInitials(name)}</AvatarFallback>
					</Avatar>
					<div className="ml-1">
						<div className=" text-left">{name}</div>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'phone_number',
		header: () => <div className="text-left">Phone Number</div>,
		cell: ({ row }) => {
			let phoneNumber = row.original.phone_number

			return (
				<div className="">
					<div className="text-left">{phoneNumber}</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'bus',
		header: () => <div className="text-left">Bus</div>,
		cell: ({ row }) => {
			let bus = row.original.bus
			return <div className="text-left">{bus}</div>
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
							Reassign Bus
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit driver details</DropdownMenuItem>
						<DropdownMenuItem>Delete Driver</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]