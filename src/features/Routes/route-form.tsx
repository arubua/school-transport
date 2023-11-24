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
	NameSchema,
	SchoolNameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddStudent, useUpdateStudent } from '../../hooks/api/students'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { useZones } from '../../hooks/api/zones'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAddRoute, useUpdateRoute } from '../../hooks/api/routes'
import { MultiSelect } from '../../components/multiselect'
import { useStops } from '../../hooks/api/stops'
import { toast } from 'sonner'

const RouteFormSchema = z.object({
	name: z.string(),
	stop_ids: z.array(
		z.object({
			label: z.string(),
			value: z.string(),
		}),
	),
	// stop_ids: z.array(z.string().trim()),
	zone_id: z.string(),
	description: z.string(),
})

const RouteForm = () => {
	const location = useLocation()
	const navigate = useNavigate()

	const [zones, setZones] = useState<{ label: string; value: string }[]>([])
	const [stops, setStops] = useState<{ label: string; value: string }[]>([])

	const [routeId, setRouteId] = useState('')

	const [isUpdating] = useState(location.state && location.state.route)

	const addRouteMutation = useAddRoute()
	const updateRouteMutation = useUpdateRoute()

	const { isLoading, isError, data, isSuccess } = addRouteMutation
	const { isLoading: isLoadingUpdate, isSuccess: isSuccessUpdate } =
		updateRouteMutation

	const { data: zonesRaw } = useZones()
	const { data: stopsRaw } = useStops()

	const form = useForm<z.infer<typeof RouteFormSchema>>({
		resolver: zodResolver(RouteFormSchema),
		defaultValues: {
			name: '',
			stop_ids: [],
			zone_id: '',
			description: '',
		},
	})

	async function onSubmit(values: z.infer<typeof RouteFormSchema>) {
		const stop_ids = values.stop_ids.map(stop => stop.value)

		const updatedData = { ...values, stop_ids }
		if (isUpdating) {
			await updateRouteMutation.mutateAsync({
				routeId: routeId,
				updatedData,
			})
		} else {
			await addRouteMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (isUpdating) {
			const { route } = location.state
			const zone_id = route.zone.id
			const stop_ids = route.stops.map(stop => {
				return {
					label: stop.stop.description,
					value: stop.stop.id,
				}
			})

			setRouteId(route.id)
			const updatedRouteData = { ...route, zone_id, stop_ids }

			form.reset(updatedRouteData)
		}
	}, [isUpdating, location.state, form])

	useEffect(() => {
		if (Array.isArray(zonesRaw) && zonesRaw.length > 0) {
			const fZones = zonesRaw.map(zone => ({
				label: zone.name,
				value: zone.id,
			}))
			setZones(fZones)
		}
	}, [zonesRaw])

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
			toast.success(`Route created successfuly`)
			navigate('/app/routes')
		}
		if (isSuccessUpdate) {
			toast.success(`Route updated successfuly`)
			navigate('/app/routes')
		}
	}, [isSuccess, isSuccessUpdate])

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Route Info</h4>
				<p className="text-muted-foreground">Update the route details here.</p>
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
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Name</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem className="w-60">
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
								<FormLabel>Description</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="w-60">
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
								<FormLabel>Stops</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="stop_ids"
								render={({ field: { ...field } }) => {
									return (
										<FormItem>
											<MultiSelect
												className="sm:w-60"
												placeholder="Select stops..."
												selected={field.value}
												options={stops}
												{...field}
											/>
											<FormMessage />
										</FormItem>
									)
								}}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Zone</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="zone_id"
								render={({ field }) => (
									<FormItem className="flex flex-col">
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
															? zones.find(zone => zone.value === field.value)
																	?.label
															: 'Select zone'}
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
														placeholder="Search zone..."
														className="h-9"
													/>
													<CommandEmpty>No zone found.</CommandEmpty>
													<CommandGroup className="max-h-[250px] overflow-y-scroll">
														{zones.map(zone => (
															<CommandItem
																value={zone.value}
																key={zone.value}
																onSelect={() => {
																	form.setValue('zone_id', zone.value)
																}}
															>
																{zone.label}
																<Icon
																	name="check"
																	className={cn(
																		'ml-auto h-4 w-4',
																		zone.value === field.value
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
						<Spacer size="3xs" />
						<div className="flex max-w-lg justify-end  pr-3">
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

export default RouteForm
