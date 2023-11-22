import { Spacer } from '../../components/spacer'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '../../components/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '../../components/popover'
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
import { Checkbox } from '../../components/ui/checkbox'
import { Button } from '../../components/ui/button'
import { cn } from '../../utils/misc'
import {
	BusSchema,
	BusStopSchema,
	DriverStatusSchema,
	GradeSchema,
	ImageFileSchema,
	NameSchema,
	PhoneSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddStudent } from '../../hooks/api/students'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { useParents } from '../../hooks/api/parents'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import FileUpload from '../../components/ui/file-input'
import { FileRejection, DropzoneInputProps } from 'react-dropzone'
import {
	useAddDriver,
	useDrivers,
	useUpdateDriver,
} from '../../hooks/api/drivers'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/storage'
import { toast } from 'sonner'
import { useUser } from '../../hooks/UserContext'

type DriverStatus = z.infer<typeof DriverStatusSchema>

const DriversFormSchema = z.object({
	firstname: NameSchema,
	lastname: NameSchema,
	phone_number: PhoneSchema,
	school_id: z.string(),
	status: DriverStatusSchema,
})

const DriverForm = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useUser()

	const [isUpdating] = useState(location.state && location.state.driver)

	const [statusOptions, setStatusOptions] = useState<
		{ label: string; value: DriverStatus }[]
	>([
		{
			label: 'Active',
			value: 'active',
		},
		{
			label: 'Inactive',
			value: 'inactive',
		},
		{
			label: 'Suspended',
			value: 'suspended',
		},
	])
	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
	const [driverId, setDriverId] = useState('')

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const addDriverMutation = useAddDriver()
	const updateDriverMutation = useUpdateDriver()

	const { isLoading, isError, data, isSuccess } = addDriverMutation
	const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } =
		updateDriverMutation

	// const { data: statusOptionsRaw } = useBuses()

	const form = useForm<z.infer<typeof DriversFormSchema>>({
		resolver: zodResolver(DriversFormSchema),
		defaultValues: {
			firstname: '',
			lastname: '',
			phone_number: '',
			school_id: '',
			status: 'active',
		},
	})

	async function onSubmit(values: z.infer<typeof DriversFormSchema>) {
		const user = await getUser()

		if (isUpdating) {
			await updateDriverMutation.mutateAsync({
				driverId: driverId,
				updatedData: values,
			})
		} else {
			if (user && 'school' in user) {
				let valsWithSchoolId = values
				valsWithSchoolId.school_id = user.school.id

				addDriverMutation.mutateAsync(valsWithSchoolId)
			}
		}
	}

	useEffect(() => {
		if (isUpdating && user && location.state && location.state.driver) {
			const { driver } = location.state
			console.log({driver})
			const school_id = user.school.id

			const updatedDriverData = { ...driver, school_id }
			setDriverId(location.state.driverId)
			form.reset(updatedDriverData)
		}
	}, [isUpdating, location.state])

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Driver created successfuly`)
			navigate('/app/drivers')
		}
		if (isSuccessUpdate) {
			toast.success(`Driver updated successfuly`)
			navigate('/app/drivers')
		}
	}, [isSuccess, isSuccessUpdate])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Personal Info</h4>
				<p className="text-muted-foreground">
					Update drivers photo and personal details here.
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
							<div className="flex gap-2">
								<FormField
									control={form.control}
									name="firstname"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input placeholder="First name" {...field} />
											</FormControl>
											<FormMessage className="max-w-[250px]" />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="lastname"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Input
													className=""
													placeholder="Last name"
													{...field}
												/>
											</FormControl>
											<FormMessage className="max-w-[250px]" />
										</FormItem>
									)}
								/>
							</div>
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
											<Input {...field} />
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
								<FormLabel>Status</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="status"
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
															? statusOptions.find(
																	option => option.value === field.value,
															  )?.label
															: 'Select bus'}
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
														placeholder="Search status..."
														className="h-9"
													/>
													<CommandEmpty>No option found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{statusOptions.map(option => (
															<CommandItem
																value={option.label}
																key={option.value}
																onSelect={() => {
																	form.setValue('status', option.value)
																}}
															>
																{option.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		option.value === field.value
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
						{/* <Separator orientation="horizontal" />
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
												fileName="avatar" // Provide a file name if needed
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
						</div> */}
						<Spacer size="3xs" />
						<div className="flex max-w-xl justify-end">
							<Button
								className="w-4/6"
								size="sm"
								type="submit"
								disabled={isLoading || isLoadingUpdate}
							>
								{isLoading ||
									(isLoadingUpdate && (
										<Spinner showSpinner={isLoading || isLoadingUpdate} />
									))}
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default DriverForm
