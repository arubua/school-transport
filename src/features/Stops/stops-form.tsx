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
import { useAddStop, useUpdateStop } from '../../hooks/api/stops'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { useZones } from '../../hooks/api/zones'
import { Icon } from '../../components/ui/icon'
import { Spinner } from '../../components/spinner'
import { useLocation } from 'react-router-dom'

const StopFormSchema = z.object({
	latitude: z.string(),
	longitude: z.string(),
	description: z.string(),
	zone_id: z.string(),
})

const StopsForm = () => {
	const location = useLocation()

	const [stopId, setStopId] = useState('')
	const [zones, setZones] = useState<{ label: string; value: string }[]>([])

	const [isUpdating] = useState(location.state && location.state.stop)

	const addStopMutation = useAddStop()
	const updateStopMutation = useUpdateStop()

	const { isLoading, isError, data, isSuccess } = addStopMutation

	const { data: zonesRaw } = useZones()

	const form = useForm<z.infer<typeof StopFormSchema>>({
		resolver: zodResolver(StopFormSchema),
		defaultValues: {
			latitude: '',
			longitude: '',
			description: '',
			zone_id: '',
		},
	})

	async function onSubmit(values: z.infer<typeof StopFormSchema>) {
		if (isUpdating) {
			await updateStopMutation.mutateAsync({
				stopId: stopId,
				updatedData: values,
			})
		} else {
			await addStopMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (isUpdating) {
			const stopData = location.state.stop
			setStopId(stopData.id)
			form.reset(stopData)
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

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Stop Info</h4>
				<p className="text-muted-foreground">Update stop details here.</p>
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
								<FormLabel>Description</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="description"
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
								<FormLabel>Latitude</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="latitude"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="2.68452" {...field} />
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
								<FormLabel>Longitude</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="longitude"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="-30.9501" {...field} />
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
															'w-[242px] justify-between',
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
						<div className="flex max-w-lg pr-4 justify-end">
							<Button  type="submit" disabled={isLoading}>
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

export default StopsForm
