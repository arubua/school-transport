import { Spacer } from '../../../components/spacer'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../../components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { z } from 'zod'
import { Separator } from '../../../components/separator'
import { Spinner } from '../../../components/spinner'
import { useAddRole, useUpdateRole } from '../../../hooks/api/settings/roles'
import { Icon } from '../../../components/ui/icon'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const RoleFormSchema = z.object({
	name: z.string(),
})

const RoleForm = () => {
	const location = useLocation()

	const navigate = useNavigate()

	const [isUpdating] = useState(location.state && location.state.role)
	const [roleId, setRoleId] = useState('')

	const addRoleMutation = useAddRole()
	const updateRoleMutation = useUpdateRole()

	const { isLoading, isError, data, isSuccess } = addRoleMutation

	const form = useForm<z.infer<typeof RoleFormSchema>>({
		resolver: zodResolver(RoleFormSchema),
		defaultValues: {
			name: '',
		},
	})

	useEffect(() => {
		if (isUpdating) {
			const roleData = location.state.role
			setRoleId(roleData.id)
			form.reset(roleData)
		}
	}, [isUpdating, location.state, form])

	async function onSubmit(values: z.infer<typeof RoleFormSchema>) {
		await addRoleMutation.mutateAsync(values)
	}

	return (
		<div>
			<div className="flex justify-between">
				<div className="flex flex-col items-start">
					<h4 className="font-semibold">Role Info</h4>
					<p className="text-muted-foreground">
						Update the role and click submit
					</p>
				</div>
				<Button variant="link" onClick={() => navigate(-1)}>
					<Icon name="arrow-left" className="mr-2" />
					Back to Roles
				</Button>
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
											<Input placeholder="Role A" {...field} />
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

export default RoleForm
