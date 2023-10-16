import { Spacer } from '../../components/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../components/ui/input'
import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/spinner'
import { Icon } from '../../components/ui/icon'
import {
	BusStopSchema,
	EmailSchema,
	GradeSchema,
	ImageFileSchema,
	NameSchema,
	PhoneSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddParent } from '../../hooks/api/parents'
import { Separator } from '../../components/separator'

const StudentFormSchema = z.object({
	firstName: NameSchema,
	lastName: NameSchema,
	email: EmailSchema,
	phone: PhoneSchema,
	// bus_stop: BusStopSchema,
	// image: ImageFileSchema,
})

const AddParent = () => {
	const AddParentMutation = useAddParent()

	const { isLoading, isError, data, isSuccess } = AddParentMutation

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: undefined,
			// bus_stop: {},
			// image: {},
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		await AddParentMutation.mutateAsync(values)
	}

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Personal Info</h4>
				<p className="text-muted-foreground">
					Update parents photo and personal details here.
				</p>
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
								name="phone"
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
						{/* <Button className="w-full" type="submit" disabled={isLoading}>
										<Spinner showSpinner={isLoading} />
										Submit
									</Button> */}
					</div>
				</form>
			</Form>
		</div>
	)
}

export default AddParent
