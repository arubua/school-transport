'use client'
import react, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
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
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
	DialogDescription,
} from '../../components/dialog'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Form } from '../../components/form'
import ZoneForm from './zone-form'
import { Spinner } from '../../components/spinner'
import { useDeleteZone } from '../../hooks/api/zones'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Zone = {
	id: string
	name: string
}

export const columns: ColumnDef<Zone>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Name
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let name = row.original.name

			return <div className="text-left">{name}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const zone = row.original

			const [open, setOpen] = useState<null | 'update' | 'delete'>(null) // Use null to indicate no action initially

			function openDialog(action: 'update' | 'delete') {
				setOpen(action)
			}

			function closeDialog() {
				setOpen(null)
			}

			const deleteZoneMutation = useDeleteZone()

			const { isLoading, isError, data, isSuccess } = deleteZoneMutation

			const form = useForm()

			async function onSubmit() {
				await deleteZoneMutation.mutateAsync(zone.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success('Zone deleted successfuly')
					// setOpen(prevState => {
					// 	return { ...prevState, ['deleteZone']: false }
					// })
					closeDialog()
				}
				if (isError) {
					toast.error('Failed to delete zone!')
				}
			}, [isSuccess, isError])

			function DeleteDialogContent() {
				return (
					<DialogContent className="sm:max-w-[425px]">
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<DialogHeader>
									<DialogTitle>Delete Student</DialogTitle>
								</DialogHeader>
								<div className="py-4">
									<div className="text-destructive">
										Are you sure you want to delete {zone.name} ?
									</div>
								</div>
								<DialogFooter>
									{/* <DialogClose /> */}
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
				)
			}

			function UpdateDialogContent() {
				return (
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Update Zone</DialogTitle>
							<DialogDescription>
								Update the name of the zone here and submit changes.
							</DialogDescription>
						</DialogHeader>
						<ZoneForm zone={zone} closeDialog={closeDialog} />
					</DialogContent>
				)
			}

			return (
				<>
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<Icon name="dots-horizontal" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<div className="flex flex-col">
									<DropdownMenuLabel>Actions</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DialogTrigger>
										<DropdownMenuItem onClick={() => openDialog('update')}>
											Update Zone
										</DropdownMenuItem>
									</DialogTrigger>
									<DialogTrigger>
										<DropdownMenuItem onClick={() => openDialog('delete')}>
											Delete Zone
										</DropdownMenuItem>
									</DialogTrigger>
								</div>
							</DropdownMenuContent>
							{open === 'delete' && <DeleteDialogContent />}
							{open === 'update' && <UpdateDialogContent />}
						</DropdownMenu>
					</Dialog>
				</>
			)
		},
	},
]
