'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '../../../components/ui/avatar'
import { getInitials } from '../../../utils/getInitials'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
} from '../../../components/dialog'
import { Button } from '../../../components/ui/button'
import { Icon } from '../../../components/ui/icon'

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../components/ui/tooltip'
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form } from '../../../components/form'
import { toast } from 'sonner'
import { useDeleteRole } from '../../../hooks/api/settings/roles'

export type Student = {
	id: string
	image: string
	name: string
}

export type Role = {
	id: string
	name: string
}

export const columns: ColumnDef<Role>[] = [
	{
		accessorKey: 'name',
		header: () => <div className="text-left">Name</div>,
		cell: ({ row }) => {
			let name = row.original.name
			return <div className="text-left">{name}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const role = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteRoleMutation = useDeleteRole()
			const { isLoading, isError, data, isSuccess } = deleteRoleMutation

			const form = useForm()

			async function onSubmit() {
				await deleteRoleMutation.mutateAsync(role.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Role deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete role!')
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
									onClick={() => navigate(`editRole`, { state: { role } })}
								>
									Update Role
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete role</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Role</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {role.name} ?
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
