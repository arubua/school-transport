'use client'

import { ColumnDef } from '@tanstack/react-table'
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
import { useForm } from 'react-hook-form'
import { Form } from '../../components/form'
import { Checkbox } from '../../components/ui/checkbox'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'
import { useDeleteRoute } from './../../hooks/api/routes'

export type Route = {
	id: string
	name: string
	description: string
	zone: {
		id: string
		name: string
	}
	stops: [
		{
			created_at: string
			stop: {
				id: string
				name: string
				description: string
				latitude: string
				longitude: string
			}
		},
	]
}

export const columns: ColumnDef<Route>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				className="absolute top-3 mx-auto h-[18px] w-[18px]"
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
		accessorKey: 'name',
		header: () => <div className="text-left">Route Name</div>,
		cell: ({ row }) => {
			let routeName = row.original.name

			return <div className="text-left">{routeName}</div>
		},
	},
	{
		accessorKey: 'zone',
		header: () => <div className="text-left">Zone</div>,
		cell: ({ row }) => {
			let zone = row.original.zone.name
			return <div className="text-left">{zone}</div>
		},
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
		accessorKey: 'stops',
		header: () => <div className="text-left">No. of Stops</div>,
		cell: ({ row }) => {
			let stops = row.original.stops
			return <div className="text-left">{stops.length}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const route = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteRouteMutation = useDeleteRoute()

			const { isLoading, isError, data, isSuccess } = deleteRouteMutation

			const form = useForm()

			async function onSubmit() {
				await deleteRouteMutation.mutateAsync(route.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Route deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete route!')
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
									onClick={() => navigate(`editRoute`, { state: { route } })}
								>
									Update Route
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete route</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Route</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete this route ?
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
