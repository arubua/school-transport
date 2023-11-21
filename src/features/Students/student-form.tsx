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
	FormDescription,
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
	GradeSchema,
	ImageFileSchema,
	NameSchema,
	SchoolNameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddStudent, useUpdateStudent } from '../../hooks/api/students'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { useParents } from '../../hooks/api/parents'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import FileUpload from '../../components/ui/file-input'
import { FileRejection } from 'react-dropzone'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/storage'
import { useStops } from '../../hooks/api/stops'
import { toast } from 'sonner'

const StudentFormSchema = z.object({
	firstname: NameSchema,
	lastname: NameSchema,
	admission_no: z.string(),
	class_name: GradeSchema,
	school_id: z.string(),
	parent_id: z.string(),
	stop_id: z.string(),
})

type User = {
	id: string
	firstname: string
	lastname: string
	email: string
	phone_number: string
	role: string
	school: {
		id: string
		name: string
	}
}

const StudentForm = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const [parents, setParents] = useState<{ label: string; value: string }[]>([])
	const [stops, setStops] = useState<{ label: string; value: string }[]>([])

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
	const [studentId, setStudentId] = useState('')

	const [isUpdating] = useState(location.state && location.state.student)

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const addStudentMutation = useAddStudent()
	const updateStudentMutation = useUpdateStudent()

	const { isLoading, isError, data, isSuccess } = addStudentMutation
	const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } =
		updateStudentMutation

	const { data: parentsRaw } = useParents()
	const { data: stopsRaw } = useStops()

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			firstname: '',
			lastname: '',
			admission_no: '',
			class_name: '',
			parent_id: '',
			stop_id: '',
			school_id: '',
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		const user = await getUser()
		if (isUpdating) {
			await updateStudentMutation.mutateAsync({
				studentId: studentId,
				updatedData: values,
			})
		} else {
			if (user && 'school' in user) {
				let valsWithSchoolId = values
				valsWithSchoolId.school_id = user.school.id

				addStudentMutation.mutateAsync(valsWithSchoolId)
			}
		}
	}

	useEffect(() => {
		if (
			isUpdating &&
			location.state &&
			location.state.student &&
			location.state.student.parent
		) {
			const { student } = location.state
			const parent_id = student.parent.id
			const stop_id = student.stop.id
			const school_id = student.school.id

			const updatedStudentData = { ...student, parent_id, stop_id, school_id }
			setStudentId(student.id)
			form.reset(updatedStudentData)
		}
	}, [isUpdating, location.state])

	useEffect(() => {
		if (Array.isArray(parentsRaw) && parentsRaw.length > 0) {
			const fParents = parentsRaw.map(parent => ({
				label: `${parent.user.firstname} ${parent.user.lastname}`,
				value: parent.id,
			}))
			setParents(fParents)
		}
	}, [parentsRaw])

	useEffect(() => {
		if (Array.isArray(stopsRaw) && stopsRaw.length > 0) {
			const fStops = stopsRaw.map(stop => ({
				label: stop.description,
				value: stop.id,
			}))
			setStops(fStops)
		}
	}, [stopsRaw])

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Student created successfuly`)
			navigate('/app/students')
		}
		if (isSuccessUpdate) {
			toast.success(`Student updated successfuly`)
			navigate('/app/students')
		}
	}, [isSuccess, isSuccessUpdate])

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
								<FormLabel>Admission Number</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="admission_no"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input type="text" {...field} />
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
								<FormLabel>Grade/Class</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="class_name"
								render={({ field }) => (
									<FormItem className="max-w-[490px]">
										<FormControl>
											<Input type="text" {...field} />
										</FormControl>
										<FormMessage />
										<FormDescription>
											Please provide the academic level in the following format:
											Class [number][stream] or Grade [number]. For example,
											Class 5B or Grade 3.
										</FormDescription>
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Stop</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="stop_id"
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
															? stops.find(stop => stop.value === field.value)
																	?.label
															: 'Select stop'}
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
														placeholder="Search stop..."
														className="h-9"
													/>
													<CommandEmpty>No stop found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{stops.map(stop => (
															<CommandItem
																value={stop.value}
																key={stop.value}
																onSelect={() => {
																	form.setValue('stop_id', stop.value)
																}}
															>
																{stop.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		stop.value === field.value
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
								<FormLabel>Parent</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="parent_id"
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
											<PopoverContent className="w-[200px p-0">
												<Command>
													<CommandInput
														placeholder="Search parent..."
														className="h-9"
													/>
													<CommandEmpty>No parent found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{parents.map(parent => (
															<CommandItem
																value={parent.value}
																key={parent.value}
																onSelect={() => {
																	form.setValue('parent_id', parent.value)
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
							<Button className="w-5/6" type="submit" disabled={isLoading}>
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

export default StudentForm
