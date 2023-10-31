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
import { useNavigate } from 'react-router-dom'
import React, { useEffect } from 'react'
import { useDeleteStudent } from '../../hooks/api/students'
import { useForm } from 'react-hook-form'
import { Form } from '../../components/form'
import { Checkbox } from '../../components/ui/checkbox'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'
import { useDeleteStop } from '../../hooks/api/stops'

export type Stop = {
	id: string
	latitude: string
	longitude: string
	description: string
	zone_id: string
}

export const columns: ColumnDef<Stop>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				className="absolute left-6 top-2 h-[18px] w-[18px]"
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				className="h-[18px] w-[18px]"
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'description',
		header: () => <div className="text-left">Description</div>,
		cell: ({ row }) => {
			let description = row.original.description

			return <div className="text-left">{description}</div>
		},
	},
	{
		accessorKey: 'latitude',
		header: () => <div className="text-left">Latitude</div>,
		cell: ({ row }) => {
			let lat = row.original.latitude
			return <div className="text-left">{lat}</div>
		},
	},
	{
		accessorKey: 'longitude',
		header: () => <div className="text-left">Longitude</div>,
		cell: ({ row }) => {
			let long = row.original.longitude
			return <div className="text-left">{long}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const stop = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteStopMutation = useDeleteStop()

			const { isLoading, isError, data, isSuccess } = deleteStopMutation

			const form = useForm()

			async function onSubmit() {
				await deleteStopMutation.mutateAsync(stop.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Stop deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete stop!')
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
									onClick={() =>
										navigate(`editStop`, { state: { stop } })
									}
								>
									Update Stop
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete stop</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Stop</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete this stop ?
										</div>
									</div>
									<DialogFooter>
										<DialogClose />
										<Button
											disabled={isLoading}
											variant="destructive"
											size="sm"
											type="submit"
										>
											{isLoading && <Spinner showSpinner={isLoading} />}
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
