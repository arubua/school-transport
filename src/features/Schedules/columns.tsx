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
import { useDeleteSchedule } from '../../hooks/api/schedules'
import { useForm } from 'react-hook-form'
import { Form } from '../../components/form'
import { Checkbox } from '../../components/ui/checkbox'
import { toast } from 'sonner'
import { Spinner } from '../../components/spinner'

export type Schedule = {
	id: string
	route: string
	driver: string
	bus: string
	start_time: string
	students: Array<string>
}

export const columns: ColumnDef<Schedule>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				className="absolute left-4 top-3 h-[18px] w-[18px]"
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
		accessorKey: 'route',
		header: () => <div className="text-left">Route</div>,
		cell: ({ row }) => {
			let route = row.original.route

			return <div className="text-left">{route}</div>
		},
	},
	{
		accessorKey: 'start_time',
		header: () => <div className="text-left">Time</div>,
		cell: ({ row }) => {
			let start_time = row.original.start_time

			return <div className="text-left">{start_time}</div>
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
			const schedule = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteScheduleMutation = useDeleteSchedule()

			const { isLoading, isError, data, isSuccess } = deleteScheduleMutation

			const form = useForm()

			async function onSubmit() {
				await deleteScheduleMutation.mutateAsync(schedule.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Schedule deleted successfuly')
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete schedule!')
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
										navigate(`editSchedule`, { state: { schedule } })
									}
								>
									Update Schedule
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete schedule</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Schedule</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete this schedule ?
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
