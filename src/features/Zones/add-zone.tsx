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
import { z } from 'zod'
import { Separator } from '../../components/separator'
import { Spinner } from '../../components/spinner'
import { useAddZone } from '../../hooks/api/zones'

const ZoneFormSchema = z.object({
	name: z.string(),
})

const AddZone = () => {
	const addZoneMutation = useAddZone()

	const { isLoading, isError, data, isSuccess } = addZoneMutation


	const form = useForm<z.infer<typeof ZoneFormSchema>>({
		resolver: zodResolver(ZoneFormSchema),
		defaultValues: {
			name: '',
		},
	})

	async function onSubmit(values: z.infer<typeof ZoneFormSchema>) {
		await addZoneMutation.mutateAsync(values)
	}

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Zone Info</h4>
				<p className="text-muted-foreground">
					Fill in the name of the zone below
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Zone A" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
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

export default AddZone
