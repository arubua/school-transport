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
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDeleteDriver } from '../../hooks/api/drivers'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
} from '../../components/dialog'
import { Form } from '../../components/form'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Driver = {
	id: string
	firstName: string
	lastName: string
	phone_number: string
	bus: string
	image: string
}

export const columns: ColumnDef<Driver>[] = [
	{
		id: 'name',
		accessorFn: row => `${row.firstName} ${row.lastName}`,
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
			const driver = row.original

			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteDriverMutation = useDeleteDriver()
			const { isLoading, isError, data, isSuccess } = deleteDriverMutation

			const form = useForm()

			async function onSubmit() {
				await deleteDriverMutation.mutateAsync(driver.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Driver deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete driver!')
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
								<DropdownMenuItem>Add to Schedule</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() => navigate(`editDriver`, { state: { driver } })}
								>
									Edit driver details
								</DropdownMenuItem>
								<DialogTrigger>
									<DropdownMenuItem>Delete Driver</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Driver</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {driver.firstName}{' '}
											{driver.lastName} ?
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
