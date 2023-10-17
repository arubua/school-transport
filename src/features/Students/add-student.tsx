import { Spacer } from '../../components/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
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
import { cn } from '../../utils/misc'
import {
	BusStopSchema,
	GradeSchema,
	ImageFileSchema,
	NameSchema,
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

const StudentFormSchema = z.object({
	firstName: NameSchema,
	lastName: NameSchema,
	grade: z.string(),
	school: SchoolNameSchema,
	parent: z.string(),
	// bus_stop: BusStopSchema,
	avatarImage: z.string(),
})

const AddStudent = () => {
	const [parents, setParents] = useState<{ label: string; value: number }[]>([])
	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const addStudentMutation = useAddStudent()

	const { isLoading, isError, data, isSuccess } = addStudentMutation

	const { data: parentsRaw } = useParents()

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			grade: "",
			school: '',
			parent: "",
			avatarImage: '',
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		console.log('values', values)
		await addStudentMutation.mutateAsync(values)
	}

	useEffect(() => {
		if (Array.isArray(parentsRaw) && parentsRaw.length > 0) {
			const fParents = parentsRaw.map(parent => ({
				label: parent.name,
				value: parent.id,
			}))
			setParents(fParents)
		}
	}, [parentsRaw])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Personal Info</h4>
				<p className="text-muted-foreground">
					Update students photo and personal details here.
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
								<FormLabel>Grade</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="grade"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input type='number' {...field} />
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
								<FormLabel>School</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="school"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="NBBPS" {...field} />
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
								<FormLabel>Parent</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="parent"
								render={({ field }) => (
									<FormItem className="flex flex-col">
										{/* <FormLabel>parent</FormLabel> */}
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
															? parents.find(
																	parent => parent.value === field.value,
															  )?.label
															: 'Select parent'}
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
														placeholder="Search parent..."
														className="h-9"
													/>
													<CommandEmpty>No parent found.</CommandEmpty>
													<CommandGroup>
														{parents.map(parent => (
															<CommandItem
																value={parent.label}
																key={parent.value}
																onSelect={() => {
																	form.setValue('parent', parent.value)
																}}
															>
																{parent.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		parent.value === field.value
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
								<FormLabel>School</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="avatarImage"
								render={({ field }) => (
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
												{...field} // Pass the field props to FileUpload
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

export default AddStudent
