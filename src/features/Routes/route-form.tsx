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
import { useLocation } from 'react-router-dom'
import { useAddRoute, useUpdateRoute } from '../../hooks/api/routes'
import { MultiSelect } from '../../components/multiselect'
import { useStops } from '../../hooks/api/stops'

const RouteFormSchema = z.object({
	name: z.string(),
	stops: z.array(z.record(z.string().trim())),
	zone_id: z.string(),
})

const RouteForm = () => {
	const location = useLocation()

	const [zones, setZones] = useState<{ label: string; value: string }[]>([])
	const [stops, setStops] = useState<{ label: string; value: string }[]>([])

	const [routeId, setRouteId] = useState('')

	const [isUpdating] = useState(location.state && location.state.route)

	const addRouteMutation = useAddRoute()
	const updateRouteMutation = useUpdateRoute()

	const { isLoading, isError, data, isSuccess } = addRouteMutation

	const { data: zonesRaw } = useZones()
	const { data: stopsRaw } = useStops()

	const form = useForm<z.infer<typeof RouteFormSchema>>({
		resolver: zodResolver(RouteFormSchema),
		defaultValues: {
			name: '',
			stops: [],
			zone_id: '',
		},
	})

	async function onSubmit(values: z.infer<typeof RouteFormSchema>) {
		if (isUpdating) {
			await updateRouteMutation.mutateAsync({
				routeId: routeId,
				updatedData: values,
			})
		} else {
			await addRouteMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (isUpdating) {
			const routeData = location.state.route
			setRouteId(routeData.id)
			form.reset(routeData)
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
								<FormLabel>Stops</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="stops"
								render={({ field: { ...field } }) => (
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
								)}
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

export default RouteForm
