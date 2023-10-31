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
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useDeleteBus } from '../../hooks/api/buses'
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

			return <div className="text-left">{driver}</div>
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
			const bus = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteBusMutation = useDeleteBus()
			const { isLoading, isError, data, isSuccess } = deleteBusMutation

			const form = useForm()

			async function onSubmit() {
				await deleteBusMutation.mutateAsync(bus.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Bus deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete bus!')
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
									onClick={() => navigate(`editBus`, { state: { bus } })}
								>
									Update bus
								</DropdownMenuItem>
								<DialogTrigger>
									<DropdownMenuItem>Deactivate Bus</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Parent</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {bus.reg_number} ?
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
