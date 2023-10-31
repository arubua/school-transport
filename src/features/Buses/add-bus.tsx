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
import {
	ImageFileSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { useParents } from '../../hooks/api/parents'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import FileUpload from '../../components/ui/file-input'
import { FileRejection, DropzoneInputProps } from 'react-dropzone'
import {  useDrivers } from '../../hooks/api/drivers'
import { useAddBus } from '../../hooks/api/buses'

const BusFormSchema = z.object({
	reg_number: z.string(),
	capacity: z.string(),
	driver_id: z.string(),
	avatarImage: z.array(ImageFileSchema).optional(),
})

const AddBus = () => {
	const [drivers, setDrivers] = useState<{ label: string; value: number }[]>([])
	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const addBusMutation = useAddBus()

	const { isLoading, isError, data, isSuccess } = addBusMutation

	const { data: driversRaw } = useDrivers()

	const form = useForm<z.infer<typeof BusFormSchema>>({
		resolver: zodResolver(BusFormSchema),
		defaultValues: {
			reg_number: '',
			capacity: '',
			driver_id: '',
			avatarImage: [],
		},
	})

	async function onSubmit(values: z.infer<typeof BusFormSchema>) {
		await addBusMutation.mutateAsync(values)
	}

	useEffect(() => {
		if (Array.isArray(driversRaw) && driversRaw.length > 0) {
			const fDrivers = driversRaw.map(driver => ({
				label: driver.name,
				value: driver.id,
			}))
			setDrivers(fDrivers)
		}
	}, [driversRaw])

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
											<Input placeholder="33" {...field} />
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
								<FormLabel>Driver</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="driver_id"
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
																	form.setValue('driver_id', driver.value)
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
										{/* <FormDescription>
        This is the parent that will be used in the dashboard.
      </FormDescription> */}
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

export default AddBus
