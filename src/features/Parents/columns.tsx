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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
} from '../../components/dialog'
import { Button } from '../../components/ui/button'
import { Icon } from '../../components/ui/icon'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../components/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDeleteParent } from '../../hooks/api/parents'
import { Form } from '../../components/form'
import { toast } from 'sonner'

export type Student = {
	id: string
	image: string
	name: string
}

export type Parent = {
	id: string
	firstName: string
	lastName: string
	phone: number
	email: string
	image: string
	students: Array<Student>
}

export const columns: ColumnDef<Parent>[] = [
	{
		id: 'name',
		accessorFn: row => `${row.firstName} ${row.lastName}`,
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
			let firstName = row.original.firstName
			let lastName = row.original.lastName
			let name = `${firstName} ${lastName}`
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
						<TooltipProvider key={index}>
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
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteParentMutation = useDeleteParent()
			const { isLoading, isError, data, isSuccess } = deleteParentMutation


			const form = useForm()

			async function onSubmit() {
				await deleteParentMutation.mutateAsync(parent.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success("Parent deleted successfuly")
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete parent!')
				}
			}, [isSuccess, isLoading])

			return (
				<div>
					<Dialog open={open} onOpenChange={setOpen}>
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
									onClick={() => navigate(`editParent`, { state: { parent } })}
								>
									Update Parent Details
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete parent</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
								>
									<DialogHeader>
										<DialogTitle>Delete Parent</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {parent.firstName}{' '}
											{parent.lastName} ?
										</div>
									</div>
									<DialogFooter>
										<DialogClose />
										<Button variant="destructive" size="sm" type="submit">
											Delete
										</Button>
									</DialogFooter>
								</form>
							</Form>
						</DialogContent>
					</Dialog>
				</div>
			)
		},
	},
]
