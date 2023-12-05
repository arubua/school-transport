import { Spacer } from '../../components/spacer'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/spinner'
import {
	AddressSchema,
	EmailSchema,
	ImageFileSchema,
	NameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddParent, useUpdateParent } from '../../hooks/api/parents'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileUpload from '../../components/ui/file-input'
import { useLocation } from 'react-router-dom'
import { useUpdateUser, useUserById } from '../../hooks/api/settings/users'
import { getUser } from '../../utils/storage'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../../components/popover'
import { cn } from '../../utils/misc'
import { Icon } from '../../components/ui/icon'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '../../components/command'
import { useRoles } from '../../hooks/api/settings/roles'

export const ProfileFormSchema = z.object({
	firstname: NameSchema,
	lastname: NameSchema,
	email: EmailSchema,
	phone_number: z.string(),
	role_id: z.string(),
})

// const UserSchema = z.object({
// 	id: z.string(),
// 	firstname: z.string(),
// 	lastname: z.string(),
// 	email: z.string(),
// 	phone_number: z.string(),
// 	role: z.string(),
// })
type User = {
	id: string
	firstname: string
	lastname: string
	email: string
	phone_number: string
	role: string
}

const ProfileForm = () => {
	const [user, setUser] = useState<User | null>(null)
	const [roles, setRoles] = useState<{ label: string; value: string }[]>([])

	const updateUserMutation = useUpdateUser()

	const { isLoading, isError, data, isSuccess } = updateUserMutation

	// const { data: rolesRaw } = useRoles()

	const form = useForm<z.infer<typeof ProfileFormSchema>>({
		resolver: zodResolver(ProfileFormSchema),
		defaultValues: {
			firstname: '',
			lastname: '',
			email: '',
			phone_number: '',
			role_id: '',
		},
	})

	async function onSubmit(values: z.infer<typeof ProfileFormSchema>) {
		if (user) {
			await updateUserMutation.mutateAsync({
				userId: user.id,
				updatedData: values,
			})
		}
	}

	useEffect(() => {
		async function init() {
			let userData = await getUser()

			setUser(userData)
			form.reset(userData)
		}

		init()
	}, [])

	// useEffect(() => {
	// 	if (Array.isArray(rolesRaw) && rolesRaw.length > 0) {
	// 		const fRoles = rolesRaw.map(role => ({
	// 			label: role.name,
	// 			value: role.id,
	// 		}))
	// 		setRoles(fRoles)
	// 	}
	// }, [rolesRaw])

	return (
		<div>
			<div className="flex flex-col items-start">
				<h4 className="font-semibold">Profile</h4>
				<p className="text-muted-foreground">
					This is how others will see you on the site.
				</p>
			</div>
			<Spacer size="4xs" />
			<Separator orientation="horizontal" />
			<Spacer size="4xs" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="m-4 space-y-8 md:m-0"
				>
					<div className=" text-left">
						<FormField
							control={form.control}
							name="firstname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input placeholder="James" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						<FormField
							control={form.control}
							name="lastname"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input placeholder="Omondi" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						<FormField
							control={form.control}
							name="phone_number"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone Number</FormLabel>
									<FormControl>
										<Input placeholder="+254710111111" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input placeholder="ojames@gmail.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						{/* <FormField
							control={form.control}
							name="role_id"
							render={({ field }) => {
								// console.log({field})
								
								return (
								<FormItem className="flex flex-col">
									<FormLabel>Role</FormLabel>

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
							)}}
						/> */}
						<Spacer size="3xs" />
						<div className="flex max-w-xl">
							<Button size="sm" type="submit" disabled={isLoading}>
								{isLoading && <Spinner showSpinner={isLoading} />}
								Update Profile
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default ProfileForm
