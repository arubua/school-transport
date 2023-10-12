import { Spacer } from '../../components/spacer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/tabs'
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
import { Spinner } from '../../components/spinner'
import { Icon } from '../../components/ui/icon'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember_user: RememberUser,
})

const AddStudent = () => {
	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			username: '',
			password: '',
			remember_user: false,
		},
	})

	async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
		await loginMutation.mutateAsync(values)
	}

	return (
		<div>
			<Spacer size="2xs" />
			<Tabs defaultValue="student" className="w-[400px]">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="student">Student Details</TabsTrigger>
					<TabsTrigger value="parent">Parent Details</TabsTrigger>
				</TabsList>
				<TabsContent value="student">
					<div>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="m-4 space-y-8 md:m-0"
						>
							<div className="text-left">
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Username</FormLabel>
											<FormControl>
												<Input placeholder="wazza" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Spacer size="4xs" />
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Password</FormLabel>
											<FormControl>
												<Input
													placeholder="********"
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Spacer size="4xs" />
								<div className="flex justify-between">
									<FormField
										control={form.control}
										name="remember_user"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="ml-2">Remember ?</FormLabel>
											</FormItem>
										)}
									/>
									<Button variant="link">Forgot password ?</Button>
								</div>
								<Button className="w-full" type="submit" disabled={isLoading}>
									<Spinner showSpinner={isLoading} />
									Submit
								</Button>
								<Spacer size="4xs" />
								<Button
									className="w-full hover:bg-transparent"
									type="submit"
									variant={'outline'}
								>
									<Icon name="google-icon" size="md" className="mr-2" /> Sign in
									with google
								</Button>
							</div>
						</form>
					</div>
				</TabsContent>
				<TabsContent value="parent">
					<div>Parent details</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default AddStudent
