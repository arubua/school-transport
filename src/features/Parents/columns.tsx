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
import z from 'zod'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../components/ui/tooltip'

export type Student = {
	id: string
	image: string
	name: string
}

export type Parent = {
	id: string
	name: string
	phone: number
	email: string
	image: string
	students: Array<Student>
}

export const columns: ColumnDef<Parent>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Parent Name
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
					<div className="ml-1 text-left">{name}</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'students',
		header: ({ column }) => {
			return <div className="text-left">Student(s)</div>
		},
		cell: ({ row }) => {
			const students = row.original.students // Assuming 'students' is an array of student objects

			return (
				<div className="flex gap-1">
					{students.map((student, index) => (
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Avatar key={index} className="h-6 w-6">
										<AvatarImage src={student.image} alt={student.name} />
										<AvatarFallback>{getInitials(student.name)}</AvatarFallback>
									</Avatar>
								</TooltipTrigger>
								<TooltipContent>
									<p>{student.name}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					))}
				</div>
			)
		},
	},
	{
		accessorKey: 'email',
		header: () => <div className="text-left">Email</div>,
		cell: ({ row }) => {
			let email = row.original.email
			return <div className="text-left">{email}</div>
		},
	},
	{
		accessorKey: 'phone',
		header: () => <div className="text-left">Phone Number</div>,
		cell: ({ row }) => {
			let phone = row.original.phone
			return <div className="text-left">{phone}</div>
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
							View student(s) details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit parent</DropdownMenuItem>
						<DropdownMenuItem>Delete parent</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
