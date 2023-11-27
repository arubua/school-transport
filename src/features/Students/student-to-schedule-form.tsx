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
import { useAddStudentsToSchedule } from '../../hooks/api/schedules'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import FileUpload from '../../components/ui/file-input'
import { FileRejection } from 'react-dropzone'
import { useLocation, useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/storage'
import { useStops } from '../../hooks/api/stops'
import { toast } from 'sonner'
import { useSchedules } from '../../hooks/api/schedules'
import { DialogFooter } from '../../components/dialog'

const StudentFormSchema = z.object({
	schedule_id: z.string(),
	student_ids: z.array(z.string()),
})

interface StudentInfo {
	id: string
	index: number
	original: {
		id: string
		// Add other properties if needed
	}
	// Include other properties if present in the row object
}

interface SelectedData {
	rows?: StudentInfo[]
	// Include other properties if present in the selected object
}

const AddToScheduleForm = ({ selected }: any) => {
	const location = useLocation()
	const navigate = useNavigate()

	const [schedules, setSchedules] = useState<
		{ label: string; value: string }[]
	>([])

	const [scheduleId, setScheduleId] = useState('')

	// const [isUpdating] = useState(location.state && location.state.student)

	const addStudentToScheduleMutation = useAddStudentsToSchedule()

	const { isLoading, isError, data, isSuccess } = addStudentToScheduleMutation

	const { data: schedulesRaw } = useSchedules()

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			schedule_id: '',
			student_ids: [],
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		addStudentToScheduleMutation.mutateAsync(values)
	}

	useEffect(() => {
		if (Array.isArray(selected?.rows)) {
			const studentIds = selected.rows.map(
				(row: StudentInfo) => row.original.id,
			)
			form.setValue('student_ids', studentIds)
		}
	}, [selected.rows])

	useEffect(() => {
		if (Array.isArray(schedulesRaw) && schedulesRaw.length > 0) {
			const fSchedules = schedulesRaw.map(schedule => ({
				label: `${schedule.start_time}-${schedule.route.name}-${schedule.bus.reg_number}-${schedule.driver.user.firstname} ${schedule.driver.user.lastname}`,
				value: schedule.id,
			}))
			setSchedules(fSchedules)
		}
	}, [])

	useEffect(() => {
		if (isSuccess) {
			toast.success(`Students added to schedule successfuly`)
			navigate('/app/schedules')
		}
	}, [isSuccess])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="text-h6 font-semibold">Add Students to Schedule</h4>
				<p className="text-body-xs text-muted-foreground">
					Choose a schedule to add the student(s) to:
				</p>
			</div>
			<Spacer size="3xs" />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="m-4 space-y-4 md:m-0"
				>
					<div className="flex flex-col gap-2">
						<div className="w-64">
							<FormLabel>Schedule</FormLabel>
						</div>
						<FormField
							control={form.control}
							name="schedule_id"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														'w-full justify-between',
														!field.value && 'text-muted-foreground',
													)}
												>
													{field.value
														? schedules.find(
																schedule => schedule.value === field.value,
														  )?.label
														: 'Select schedule'}
													<Icon
														name="caret-sort"
														className="ml-2 h-4 w-4 shrink-0 opacity-50"
													/>
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-full p-0">
											<Command>
												<CommandInput
													placeholder="Search stop..."
													className="h-9"
												/>
												<CommandEmpty>No schedule found.</CommandEmpty>
												<CommandGroup className="max-h-[250px] overflow-y-scroll">
													{schedules.map(schedule => (
														<CommandItem
															value={schedule.value}
															key={schedule.value}
															onSelect={() => {
																form.setValue('schedule_id', schedule.value)
															}}
														>
															{schedule.label}
															<Icon
																name="check"
																className={cn(
																	'ml-auto h-4 w-4',
																	schedule.value === field.value
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
									<FormDescription className="text-body-2xs">
										Select a schedule from the list to assign the student(s) to
										a specific route and time.
									</FormDescription>
								</FormItem>
							)}
						/>
					</div>
					<Separator orientation="horizontal" />

					<div className="flex max-w-xl justify-end">
						<DialogFooter>
							<Button type="submit" disabled={isLoading}>
								{isLoading && <Spinner showSpinner={isLoading} />}
								Submit
							</Button>
						</DialogFooter>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default AddToScheduleForm
