'use client'

import { ColumnDef } from '@tanstack/react-table'

import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/button'
import { Icon } from '../../../components/ui/icon'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../components/ui/avatar'
import { getInitials } from '../../../utils/getInitials'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../../components/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import { Form } from '../../../components/form'
import { useDeleteUser } from '../../../hooks/api/settings/users'

export type Student = {
	id: string
	image: string
	name: string
}

export type User = {
	id: string
	firstName: string
	lastName: string
	phone_number: string
	email: string
	role: string
}

export const columns: ColumnDef<User>[] = [
	{
		id: 'name',
		accessorFn: row => `${row.firstName} ${row.lastName}`,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					User Name
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let firstName = row.original.firstName
			let lastName = row.original.lastName
			let name = `${firstName} ${lastName}`
			// let image = row.original.image

			return (
				<div className="flex items-center">
					<Avatar>
						<AvatarImage alt={name} />
						<AvatarFallback>{getInitials(name)}</AvatarFallback>
					</Avatar>
					<div className="ml-1 text-left">{name}</div>
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
		accessorKey: 'phone_number',
		header: () => <div className="text-left">Phone Number</div>,
		cell: ({ row }) => {
			let phone = row.original.phone_number
			return <div className="text-left">{phone}</div>
		},
	},
	{
		accessorKey: 'role',
		header: () => <div className="text-left">Role</div>,
		cell: ({ row }) => {
			let role = row.original.role
			return <div className="text-left">{role}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const user = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteUserMutation = useDeleteUser()
			const { isLoading, isError, data, isSuccess } = deleteUserMutation

			const form = useForm()

			async function onSubmit() {
				await deleteUserMutation.mutateAsync(user.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('User deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete user!')
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
									onClick={() => navigate(`editUser`, { state: { user } })}
								>
									Update User
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete user</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete User</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {user.firstName}{' '}
											{user.lastName} ?
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
