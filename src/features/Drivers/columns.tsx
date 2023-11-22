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
import React, { useEffect, useState } from 'react'
import { useAssignBus, useDeleteDriver } from '../../hooks/api/drivers'
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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../../components/popover'
import { cn } from '../../utils/misc'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '../../components/command'
import { useBuses } from '../../hooks/api/buses'
import { Spacer } from '../../components/spacer'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Driver = {
	id: string
	bus: string
	user: {
		firstname: string
		lastname: string
		phone_number: string
		bus: string
		image: string
		status: string
	}
}

export const columns: ColumnDef<Driver>[] = [
	{
		id: 'name',
		accessorFn: row => `${row.user.firstname} ${row.user.lastname}`,
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
			let firstname = row.original.user.firstname
			let lastname = row.original.user.lastname
			let name = `${firstname} ${lastname}`
			// let image = row.original.image

			return (
				<div className="flex items-center">
					<Avatar>
						{/* <AvatarImage src={image} alt={name} /> */}
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
			let phoneNumber = row.original.user.phone_number

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
			return (
				<div className="text-left">{bus === null ? 'Not Assigned' : bus}</div>
			)
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const driver = row.original.user
			const driverId = row.original.id

			const navigate = useNavigate()

			const [buses, setBuses] = useState<{ label: string; value: string }[]>([])

			const [open, setOpen] = useState<null | 'assign' | 'delete'>(null) // Use null to indicate no action initially

			function openDialog(action: 'assign' | 'delete') {
				setOpen(action)
			}

			function closeDialog() {
				setOpen(null)
			}

			const deleteDriverMutation = useDeleteDriver()
			const busesQuery = useBuses()
			const assignBusMutation = useAssignBus()

			const { isLoading, isError, data, isSuccess } = deleteDriverMutation
			const { data: busesRaw } = busesQuery
			const {
				isLoading: isLoadingAssign,
				isSuccess: isSuccessAssign,
				isError: isErrorAssign,
			} = assignBusMutation

			const form = useForm()

			async function onSubmit(values: any) {
				if (open === 'delete') {
					await deleteDriverMutation.mutateAsync(driverId)
				} else {
					await assignBusMutation.mutateAsync(values)
				}
			}

			useEffect(() => {
				if (Array.isArray(busesRaw) && busesRaw.length > 0) {
					const fBuses = busesRaw.map(bus => ({
						label: bus.reg_number,
						value: bus.id,
					}))
					setBuses(fBuses)
				}
			}, [busesRaw])

			useEffect(() => {
				if (isSuccess) {
					toast.success('Driver deleted successfuly')
					closeDialog()
				}
				if (isSuccessAssign) {
					toast.success('Bus assigned to driver successfuly')
					closeDialog()
				}
				if (isError) {
					toast.error('Failed to delete driver!')
				}
				if (isErrorAssign) {
					toast.error('Failed to assign bus to driver!')
				}
			}, [isSuccess, isLoading, isSuccessAssign, isErrorAssign])

			function DeleteDialogContent() {
				return (
					<DialogContent className="sm:max-w-[425px]">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<DialogHeader>
									<DialogTitle>Delete Driver</DialogTitle>
								</DialogHeader>
								<div className="py-4">
									<div className="text-destructive">
										Are you sure you want to delete {driver.firstname}{' '}
										{driver.lastname} ?
									</div>
								</div>
								<DialogFooter>
									{/* <DialogClose /> */}
									<Button variant="destructive" size="sm" type="submit">
										Delete
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				)
			}

			function AssignDialogContent() {
				return (
					<DialogContent className="sm:max-w-[425px]">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<DialogHeader>
									<DialogTitle>Assign Bus</DialogTitle>
								</DialogHeader>
								<div className="py-4">
									<div className="flex flex-col">
										<div className="w-64">
											<FormLabel>Bus</FormLabel>
										</div>
										<Spacer size="4xs" />
										<FormField
											control={form.control}
											name="bus_id"
											render={({ field }) => (
												<FormItem className="flex flex-col">
													<Popover>
														<PopoverTrigger asChild>
															<FormControl>
																<Button
																	variant="outline"
																	role="combobox"
																	className={cn(
																		'w-[200px] justify-between',
																		!field.value && 'text-muted-foreground',
																	)}
																>
																	{field.value
																		? buses.find(
																				bus => bus.value === field.value,
																		  )?.label
																		: 'Select bus'}
																	<Icon
																		name="caret-sort"
																		className="ml-2 h-4 w-4 shrink-0 opacity-50"
																	/>
																</Button>
															</FormControl>
														</PopoverTrigger>
														<PopoverContent className="w-[200px] p-0">
															<Command>
																<CommandInput
																	placeholder="Search bus..."
																	className="h-9"
																/>
																<CommandEmpty>No bus found.</CommandEmpty>
																<CommandGroup className="max-h-[250px] overflow-y-scroll">
																	{buses.map(bus => (
																		<CommandItem
																			className="mx-auto"
																			value={bus.value}
																			key={bus.value}
																			onSelect={() => {
																				form.setValue('bus_id', bus.value)
																			}}
																		>
																			{bus.label}
																			<Icon
																				name="check"
																				className={cn(
																					'ml-auto h-4 w-4',
																					bus.value === field.value
																						? 'opacity-100'
																						: 'opacity-0',
																				)}
																			/>
																		</CommandItem>
																	))}
																</CommandGroup>
															</Command>
														</PopoverContent>
													</Popover>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
								<DialogFooter>
									{/* <DialogClose /> */}
									<Button variant="default" size="sm" type="submit">
										Assign
									</Button>
								</DialogFooter>
							</form>
						</Form>
					</DialogContent>
				)
			}

			return (
				<div>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<Icon name="dots-horizontal" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DialogTrigger>
									<DropdownMenuItem onClick={() => openDialog('assign')}>
										Assign Bus
									</DropdownMenuItem>
								</DialogTrigger>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										navigate(`editDriver`, { state: { driver, driverId } })
									}
								>
									Update driver
								</DropdownMenuItem>
								<DialogTrigger>
									<DropdownMenuItem onClick={() => openDialog('delete')}>
										Delete Driver
									</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
							{open === 'delete' && <DeleteDialogContent />}
							{open === 'assign' && <AssignDialogContent />}
						</DropdownMenu>
					</Dialog>
				</div>
			)
		},
	},
]
