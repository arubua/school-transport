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
import { Button } from '../../components/ui/button'
import { cn } from '../../utils/misc'
import { z } from 'zod'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import FileUpload from '../../components/ui/file-input'
import { FileRejection } from 'react-dropzone'
import { useDrivers } from '../../hooks/api/drivers'
import { useAddBus, useUpdateBus } from '../../hooks/api/buses'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/UserContext'
import { toast } from 'sonner'
import { getUser } from '../../utils/storage'

const BusFormSchema = z.object({
	reg_number: z.string(),
	capacity: z.union([z.number(), z.string()]),
	school_id: z.string(),
	// avatarImage: z.array(z.instanceof(File)),
})

const BusForm = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { user } = useUser()

	const [isUpdating] = useState(location.state && location.state.bus)

	const [drivers, setDrivers] = useState<{ label: string; value: string }[]>([])
	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
	const [busId, setBusId] = useState('')

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const addBusMutation = useAddBus()
	const updateBusMutation = useUpdateBus()

	const { isLoading, isError, data, isSuccess } = addBusMutation
	const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } =
		updateBusMutation

	const { data: driversRaw } = useDrivers()

	const form = useForm<z.infer<typeof BusFormSchema>>({
		resolver: zodResolver(BusFormSchema),
		defaultValues: {
			reg_number: '',
			capacity: 0,
			school_id: '',
			// avatarImage: undefined,
		},
	})

	async function onSubmit(values: z.infer<typeof BusFormSchema>) {
		const user = await getUser()

		if (isUpdating && user && 'school' in user) {
			let valsWithSchoolId = values
			valsWithSchoolId.school_id = user.school.id
			await updateBusMutation.mutateAsync({
				busId: busId,
				updatedData: valsWithSchoolId,
			})
		} else {
			if (user && 'school' in user) {
				let valsWithSchoolId = values
				valsWithSchoolId.school_id = user.school.id

				await addBusMutation.mutateAsync(valsWithSchoolId)
			}
		}
	}

	useEffect(() => {
		if (Array.isArray(driversRaw) && driversRaw.length > 0) {
			const fDrivers = driversRaw.map(driver => ({
				label: `${driver.firstname} ${driver.lastname}`,
				value: driver.id,
			}))
			setDrivers(fDrivers)
		}
	}, [driversRaw])

	useEffect(() => {
		if (isUpdating && user && location.state && location.state.bus) {
			const { bus } = location.state
			const school_id = user.school.id

			const updatedBusData = { ...bus, school_id }
			setBusId(location.state.busId)
			form.reset(updatedBusData)
		}
	}, [isUpdating, location.state])

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Bus created successfuly`)
			navigate('/app/buses')
		}
		if (isSuccessUpdate) {
			toast.success(`Bus updated successfuly`)
			navigate('/app/buses')
		}
	}, [isSuccess, isSuccessUpdate])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Bus Info</h4>
				<p className="text-muted-foreground">
					Update bus photo and details here.
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
								<FormLabel>Registration Number</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="reg_number"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="KBV 001A" {...field} />
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
								<FormLabel>Capacity</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="33" type="number" {...field} />
										</FormControl>
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
								<FormLabel>Driver</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="school_id"
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
															? drivers.find(
																	driver => driver.value === field.value,
															  )?.label
															: 'Select driver'}
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
														placeholder="Search drivers..."
														className="h-9"
													/>
													<CommandEmpty>No driver found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{drivers.map(driver => (
															<CommandItem
																value={driver.label}
																key={driver.value}
																onSelect={() => {
																	form.setValue('school_id', driver.value)
																}}
															>
																{driver.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		driver.value === field.value
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
						<Spacer size="4xs" /> */}
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
								{isLoading && <Spinner showSpinner={isLoading} />}
								{isLoadingUpdate && <Spinner showSpinner={isLoadingUpdate} />}
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default BusForm
