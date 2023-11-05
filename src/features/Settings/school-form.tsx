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
import { z } from 'zod'
import { useAddParent, useUpdateParent } from '../../hooks/api/parents'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileUpload from '../../components/ui/file-input'
import { useLocation } from 'react-router-dom'
import {
	useUpdateSchool,
	useSchoolById,
} from '../../hooks/api/settings/schools'
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
import { useScheduleById } from '../../hooks/api/schedules'
import {
	AddressSchema,
	EmailSchema,
	NameSchema,
} from '../../utils/user-validation'
import { getUser } from '../../utils/storage'

export const SchoolFormSchema = z.object({
	name: NameSchema,
	address: AddressSchema,
	email: EmailSchema,
	phone_number: z.string(),
	contact_person: z.string(),
	contact_person_email: z.string(),
})

type School = {
	id: string
	name: string
	address: string
	email: string
	phone_number: string
	contact_person: string
	contact_person_email: string
}
type User = {
	id: string
	firstName: string
	lastName: string
	email: string
	phone_number: string
	role: string
	school_id: string
}

const SchoolForm = () => {
	const [user, setUser] = useState<User | null>(null)
	const [school, setSchool] = useState<School | null>(null)
	const [roles, setRoles] = useState<{ label: string; value: string }[]>([])

	const updateSchoolMutation = useUpdateSchool()

	const { isLoading, isError, data, isSuccess } = updateSchoolMutation

	const form = useForm<z.infer<typeof SchoolFormSchema>>({
		resolver: zodResolver(SchoolFormSchema),
		defaultValues: {
			name: '',
			address: '',
			email: '',
			phone_number: '',
			contact_person: '',
			contact_person_email: '',
		},
	})

	async function onSubmit(values: z.infer<typeof SchoolFormSchema>) {
		if (user) {
			await updateSchoolMutation.mutateAsync({
				schoolId: user.school_id,
				updatedData: values,
			})
		}
	}

	useEffect(() => {
		async function init() {
			let userData = await getUser()
			const { data: school } = await useSchoolById(userData.school_id)

			setUser(userData)
			setSchool(school)
			form.reset(school)
		}

		init()
	}, [])

	return (
		<div>
			<div className="flex flex-col items-start">
				<h4 className="font-semibold">School</h4>
				<p className="text-muted-foreground">
					These are the official details of your school.
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
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>School Name</FormLabel>
									<FormControl>
										<Input placeholder="City Primary" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Address</FormLabel>
									<FormControl>
										<Input placeholder="123 Nairobi" {...field} />
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
						<FormField
							control={form.control}
							name="contact_person"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Person</FormLabel>
									<FormControl>
										<Input placeholder="contact person name" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />
						<FormField
							control={form.control}
							name="contact_person_email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contact Person Email</FormLabel>
									<FormControl>
										<Input placeholder="jdoe@gmail.com" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Spacer size="4xs" />

						<Spacer size="3xs" />
						<div className="flex max-w-xl">
							<Button size="sm" type="submit" disabled={isLoading}>
								{isLoading && <Spinner showSpinner={isLoading} />}
								Update School
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default SchoolForm
