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
export type Student = {
	id: string
	name: string
	class: string
	school: string
	stop: string
	parent_phone: number
	parent_name: string
	image: string
}

export const columns: ColumnDef<Student>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Student Name
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let name = row.original.name
			let image = row.original.image
			let grade = row.original.class
			let school = row.original.school

			return (
				<div className="flex items-center">
					<Avatar>
						<AvatarImage src={image} alt={name} />
						<AvatarFallback>{getInitials(name)}</AvatarFallback>
					</Avatar>
					<div className="ml-1">
						<div className=" text-left">{name}</div>
						<div className="flex text-muted-foreground ">
							<span>{`Grade ${grade}`}</span>
							<span className="ml-2">{`${school} School`}</span>
						</div>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'parent_name',
		header: () => <div className="text-left">Parent Details</div>,
		cell: ({ row }) => {
			let parentName = row.original.parent_name
			let parentPhone = row.original.parent_phone

			return (
				<div className="">
					<div className="text-left">{parentName}</div>
					<div className="text-left text-muted-foreground">{parentPhone}</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'stop',
		header: () => <div className="text-left">Pickup Stop</div>,
		cell: ({ row }) => {
			let stop = row.original.stop
			return <div className="text-left">{stop}</div>
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
							View parent details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit Student details</DropdownMenuItem>
						<DropdownMenuItem>Delete Student</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
