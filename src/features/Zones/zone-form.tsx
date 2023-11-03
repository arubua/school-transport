import { Spacer } from '../../components/spacer'
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
import { useAddZone, useUpdateZone } from '../../hooks/api/zones'
import { DialogFooter } from '../../components/dialog'
import { useEffect, useState } from 'react'

const ZoneFormSchema = z.object({
	name: z.string(),
})

type Zone = {
	id: string
	name: string
}

type ZoneFormProps = {
	zone?: Zone // Define the "zone" prop here
	closeDialog?: () => void
}

const ZoneForm: React.FC<ZoneFormProps> = ({ zone, closeDialog }) => {
	const [action, setAction] = useState('')
	const [zoneId, setZoneId] = useState('')

	const addZoneMutation = useAddZone()
	const updateZoneMutation = useUpdateZone()

	const { isLoading, isError, data, isSuccess } = addZoneMutation

	const form = useForm<z.infer<typeof ZoneFormSchema>>({
		resolver: zodResolver(ZoneFormSchema),
		defaultValues: {
			name: '',
		},
	})

	async function onSubmit(values: z.infer<typeof ZoneFormSchema>) {
		if (action === 'update') {
			await updateZoneMutation.mutateAsync({
				zoneId: zoneId,
				updatedData: values,
			})
			// closeDialog()
		} else {
			await addZoneMutation.mutateAsync(values)
		}
	}

	useEffect(() => {
		if (zone) {
			setAction('update')
			setZoneId(zone.id)
			form.reset(zone)
		}
	}, [zone])

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="m-4 space-y-8 md:m-0"
				>
					<div className=" text-left">
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
						<Spacer size="4xs" />
						<div className="flex max-w-xl justify-end">
							<DialogFooter>
								<Button disabled={isLoading} type="submit">
									{isLoading && <Spinner showSpinner={isLoading} />}
									Submit
								</Button>
							</DialogFooter>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default ZoneForm
