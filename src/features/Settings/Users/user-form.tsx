import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import { useLocation, useNavigate } from 'react-router-dom'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/form'
import { Spacer } from '../../../components/spacer'
import {
	AddressSchema,
	EmailSchema,
	NameSchema,
	PhoneSchema,
} from '../../../utils/user-validation'
import { Separator } from '../../../components/separator'
import { Input } from '../../../components/ui/input'
import FileUpload from '../../../components/ui/file-input'
import { Button } from '../../../components/ui/button'
import { Spinner } from '../../../components/spinner'
import { useAddUser, useUpdateUser } from '../../../hooks/api/settings/users'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../../../components/popover'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '../../../components/command'
import { cn } from '../../../utils/misc'
import { useRoles } from '../../../hooks/api/settings/roles'
import { Icon } from '../../../components/ui/icon'

export const UserFormSchema = z.object({
	firstName: NameSchema,
	lastName: NameSchema,
	email: EmailSchema,
	phone_number: PhoneSchema,
	role_id: z.string().min(3, { message: 'Please select a role' }),
	avatarImage: z.array(z.instanceof(File)),
})

const UserForm = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const [isUpdating] = useState(location.state && location.state.user)

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
	const [userId, setUserId] = useState('')

	const [roles, setRoles] = useState<{ label: string; value: string }[]>([])
	const { data: rolesRaw } = useRoles()

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const AddUserMutation = useAddUser()
	const updateUserMutation = useUpdateUser()

	const { isLoading, isError, data, isSuccess } = AddUserMutation

	const form = useForm<z.infer<typeof UserFormSchema>>({
		resolver: zodResolver(UserFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone_number: '',
			role_id: '',
			avatarImage: undefined,
		},
	})

	useEffect(() => {
		if (isUpdating) {
			const userData = location.state.user
			setUserId(userData.id)
			form.reset(userData)
		}
	}, [isUpdating, location.state, form])

	async function onSubmit(values: z.infer<typeof UserFormSchema>) {
		if (isUpdating) {
			await updateUserMutation.mutateAsync({
				userId: userId,
				updatedData: values,
			})
		} else {
			await AddUserMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (Array.isArray(rolesRaw) && rolesRaw.length > 0) {
			const fRoles = rolesRaw.map(role => ({
				label: role.name,
				value: role.id,
			}))
			setRoles(fRoles)
		}
	}, [rolesRaw])

	return (
		<div>
			<div className="flex justify-between">
				<div className="flex flex-col items-start">
					<h4 className="font-semibold">User Info</h4>
					<p className="text-muted-foreground">
						Update users photo and personal details here.
					</p>
				</div>
				<Button variant="link" onClick={() => navigate(-1)}>
					<Icon name="arrow-left" className='mr-2' />
					Back to Users
				</Button>
			</div>

			<Spacer size="4xs" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="m-4 space-y-8 md:m-0"
				>
					<div className=" text-left">
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col gap-2 md:flex-row md:gap-0">
							<div className="w-64">
								<FormLabel>Name</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="First name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className="ml-0 md:ml-2"
												placeholder="Last name"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Email</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="jdoe@gmail.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Phone Number</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="+254710000000" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Role</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="role_id"
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
															? roles.find(role => role.value === field.value)
																	?.label
															: 'Select role'}
														<Icon
															name="caret-sort"
															className="ml-2 h-4 w-4 shrink-0 opacity-50"
														/>
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[200px p-0">
												<Command>
													<CommandInput
														placeholder="Search role..."
														className="h-9"
													/>
													<CommandEmpty>No role found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{roles.map(role => (
															<CommandItem
																value={role.value}
																key={role.value}
																onSelect={() => {
																	form.setValue('role_id', role.value)
																}}
															>
																{role.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		role.value === field.value
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
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Avatar</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="avatarImage"
								render={({ field: { onChange } }) => (
									<FormItem>
										<FormControl>
											<FileUpload
												accept={{
													'image/png': ['.png'],
													'image/jpg': ['.jpg'],
													'image/jpeg': ['.jpeg'],
												}}
												multiple={false} // Set this to true if you want to allow multiple files
												onDrop={(acceptedFiles, rejectedFiles) => {
													setAcceptedFiles(acceptedFiles)
													setRejectedFiles(rejectedFiles)
													onChange(acceptedFiles)
												}}
												// error={'upload files error'}
												format="PNG JPG JPEG"
												size={5}
												onDownload={() => {
													// Handle the download action here
												}}
												downloading={false}
												acceptedFiles={acceptedFiles}
												fileName="avatar"
												delete={file => {
													handleDeleteImage(file)
												}}
												rejectedFiles={rejectedFiles}
												// {...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="3xs" />
						<div className="flex max-w-xl justify-end">
							<Button size="sm" type="submit" disabled={isLoading}>
								{isLoading && <Spinner showSpinner={isLoading} />}
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default UserForm
