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

export type Student = {
	id: string
	firstName: string
	lastName: string
	grade: string
	school: string
	stop: string
	parent_phone: number
	parent: string
	avatarImage: string
}

export const columns: ColumnDef<Student>[] = [
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
		id: 'name',
		accessorFn: row => `${row.firstName} ${row.lastName}`,
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
				>
					Student Name
					<Icon name="arrow-up-down" className="ml-2 h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			let firstName = row.original.firstName
			let lastName = row.original.lastName
			let name = `${firstName} ${lastName}`
			let image = row.original.avatarImage
			let grade = row.original.grade
			let school = row.original.school

			return (
				<div className="flex items-center">
					<Avatar>
						<AvatarImage src={image} alt={name} />
						<AvatarFallback>{getInitials(name)}</AvatarFallback>
					</Avatar>
					<div className="ml-1">
						<div className=" text-left">{name}</div>
						<div className="flex text-muted-foreground ">
							<span>{`Grade ${grade}`}</span>
							<span className="ml-2">{`${school} School`}</span>
						</div>
					</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'parent',
		header: () => <div className="text-left">Parent Details</div>,
		cell: ({ row }) => {
			let parentName = row.original.parent
			let parentPhone = row.original.parent_phone

			return (
				<div className="">
					<div className="text-left">{parentName}</div>
					<div className="text-left text-muted-foreground">{parentPhone}</div>
				</div>
			)
		},
	},
	{
		accessorKey: 'stop',
		header: () => <div className="text-left">Pickup Stop</div>,
		cell: ({ row }) => {
			let stop = row.original.stop
			return <div className="text-left">{stop}</div>
		},
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const student = row.original
			const navigate = useNavigate()

			const [open, setOpen] = React.useState(false)

			const deleteStudentMutation = useDeleteStudent()

			const { isLoading, isError, data, isSuccess } = deleteStudentMutation

			const form = useForm()

			async function onSubmit() {
				await deleteStudentMutation.mutateAsync(student.id)
			}

			useEffect(() => {
				if (isSuccess) {
					toast.success("Student deleted successfuly")
					setOpen(false)
				}
				if (isError) {
					toast.error('Failed to delete student!')
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
										navigate(`editStudent`, { state: { student } })
									}
								>
									Update Student Details
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DialogTrigger>
									<DropdownMenuItem>Delete student</DropdownMenuItem>
								</DialogTrigger>
							</DropdownMenuContent>
						</DropdownMenu>
						<DialogContent className="sm:max-w-[425px]">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)}>
									<DialogHeader>
										<DialogTitle>Delete Student</DialogTitle>
									</DialogHeader>
									<div className="py-4">
										<div className="text-destructive">
											Are you sure you want to delete {student.firstName}{' '}
											{student.lastName} ?
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
