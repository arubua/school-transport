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
import { useStudents } from '../../hooks/api/students'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import { useLocation } from 'react-router-dom'
import { useRoutes } from '../../hooks/api/routes'
import { useDrivers } from '../../hooks/api/drivers'
import { useBuses } from '../../hooks/api/buses'
import { MultiSelect } from '../../components/multiselect'
import { useAddSchedule, useUpdateSchedule } from '../../hooks/api/schedules'

const ScheduleFormSchema = z.object({
	start_time: z.string(),
	route_id: z.string(),
	driver_id: z.string(),
	bus_id: z.string(),
	students: z.array(z.record(z.string().trim())),
})

const ScheduleForm = () => {
	const location = useLocation()

	const [routes, setRoutes] = useState<{ label: string; value: string }[]>([])
	const [drivers, setDrivers] = useState<{ label: string; value: string }[]>([])
	const [buses, setBuses] = useState<{ label: string; value: string }[]>([])
	const [students, setStudents] = useState<{ label: string; value: string }[]>(
		[],
	)

	const [scheduleId, setScheduleId] = useState('')

	const [isUpdating] = useState(location.state && location.state.schedule)

	const addScheduleMutation = useAddSchedule()
	const updateScheduleMutation = useUpdateSchedule()

	const { isLoading, isError, data, isSuccess } = addScheduleMutation

	const { data: routesRaw } = useRoutes()
	const { data: driversRaw } = useDrivers()
	const { data: busesRaw } = useBuses()
	const { data: studentsRaw } = useStudents()

	const form = useForm<z.infer<typeof ScheduleFormSchema>>({
		resolver: zodResolver(ScheduleFormSchema),
		defaultValues: {
			start_time: '',
			route_id: '',
			driver_id: '',
			bus_id: '',
			students: [],
		},
	})

	async function onSubmit(values: z.infer<typeof ScheduleFormSchema>) {
		if (isUpdating) {
			await updateScheduleMutation.mutateAsync({
				scheduleId: scheduleId,
				updatedData: values,
			})
		} else {
			await addScheduleMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (isUpdating) {
			const scheduleData = location.state.schedule
			setScheduleId(scheduleData.id)
			form.reset(scheduleData)
		}
	}, [isUpdating, location.state, form])

	useEffect(() => {
		if (Array.isArray(routesRaw) && routesRaw.length > 0) {
			const fRoutes = routesRaw.map(route => ({
				label: route.name,
				value: route.id,
			}))
			setRoutes(fRoutes)
		}
		if (Array.isArray(driversRaw) && driversRaw.length > 0) {
			const fDrivers = driversRaw.map(driver => ({
				label: `${driver.firstname} ${driver.lastname}`,
				value: driver.id,
			}))
			setDrivers(fDrivers)
		}
		if (Array.isArray(busesRaw) && busesRaw.length > 0) {
			const fBuses = busesRaw.map(bus => ({
				label: bus.reg_number,
				value: bus.id,
			}))
			setBuses(fBuses)
		}
		if (Array.isArray(studentsRaw) && studentsRaw.length > 0) {
			const fStudents = studentsRaw.map(student => ({
				label: `${student.firstname} ${student.lastname}`,
				value: student.id,
			}))
			setStudents(fStudents)
		}
	}, [routesRaw, driversRaw, busesRaw, studentsRaw])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Schedule Info</h4>
				<p className="text-muted-foreground">Update schedule details here.</p>
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
						<div className="flex flex-col md:flex-row ">
							<div className="w-64">
								<FormLabel>Start Time</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="start_time"
								render={({ field }) => (
									<FormItem className="w-60">
										<FormControl>
											<Input type="datetime-local" {...field} />
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
								<FormLabel>Route</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="route_id"
								render={({ field }) => (
									<FormItem className="flex w-60 flex-col">
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															'w-60 justify-between',
															!field.value && 'text-muted-foreground',
														)}
													>
														{field.value
															? routes.find(
																	route => route.value === field.value,
															  )?.label
															: 'Select route'}
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
														placeholder="Search route..."
														className="h-9"
													/>
													<CommandEmpty>No route found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{routes.map(route => (
															<CommandItem
																value={route.value}
																key={route.value}
																onSelect={() => {
																	form.setValue('route_id', route.value)
																}}
															>
																{route.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		route.value === field.value
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
								<FormLabel>Driver</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="driver_id"
								render={({ field }) => (
									<FormItem className="flex w-60 flex-col">
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															'w-60 justify-between',
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
														placeholder="Search driver..."
														className="h-9"
													/>
													<CommandEmpty>No driver found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{drivers.map(driver => (
															<CommandItem
																value={driver.value}
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
								<FormLabel>Bus</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="bus_id"
								render={({ field }) => (
									<FormItem className="flex w-60 flex-col">
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={cn(
															'w-60 justify-between',
															!field.value && 'text-muted-foreground',
														)}
													>
														{field.value
															? buses.find(bus => bus.value === field.value)
																	?.label
															: 'Select bus'}
														<Icon
															name="caret-sort"
															className="ml-2 h-4 w-4 shrink-0 opacity-50"
														/>
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-60 p-0">
												<Command>
													<CommandInput
														placeholder="Search bus..."
														className="h-9"
													/>
													<CommandEmpty>No bus found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{buses.map(bus => (
															<CommandItem
																value={bus.value}
																key={bus.value}
																onSelect={() => {
																	form.setValue('bus_id', bus.value)
																}}
															>
																{bus.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		bus.value === field.value
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
								<FormLabel>Students</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="students"
								render={({ field: { ...field } }) => (
									<FormItem className="w-60">
										<MultiSelect
											className="sm:w-60"
											placeholder="Select students..."
											selected={field.value}
											options={students}
											{...field}
										/>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="3xs" />
						<div className="flex max-w-lg justify-end pr-3">
							<Button type="submit" disabled={isLoading}>
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

export default ScheduleForm
