import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordSchema, usernameSchema } from '../../utils/user-validation'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Spacer } from '../../components/spacer'
import Logo from '../../components/ui/logo'
import { useLogin, useResetPassword } from '../../hooks/api/auth'
import { Spinner } from '../../components/spinner'
import { clearUserSession, getUser } from '../../utils/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPasswordSchema = z.object({
	email: usernameSchema,
	current_password: PasswordSchema,
	new_password: PasswordSchema,
})

type User = {
	id: string
	firstname: string
	lastname: string
	email: string
	phone_number: string
	role: string
}

export function ChangePassword() {
	const navigate = useNavigate()
	const [user, setUser] = useState<User | null>(null)

	const passwordMutation = useResetPassword()

	useEffect(() => {
		async function init() {
			let userData = await getUser()

			setUser(userData)
			form.reset(userData)
		}

		init()
	}, [])

	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			email: user ? user.email : '',
			current_password: '',
			new_password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
		await passwordMutation.mutateAsync(values)
	}

	const { isLoading, data } = passwordMutation

	useEffect(() => {
		if (data && data.status === 200) {
			clearUserSession()
			navigate('/auth/login')
		}
	}, [data])

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex justify-center">
					<Logo
						src="/other/svg-icons/safiri-logo.svg"
						alt="Logo Alt Text"
						className="logo-class h-20 w-28"
					/>
				</div>
				<div className="flex flex-col gap-3 text-center">
					<h2 className="text-h2">Reset Password!</h2>
					<p className="text-body-sm text-muted-foreground">
						Update your password below to continue...
					</p>
				</div>
				<Spacer size="4xs" />
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="m-4 space-y-8 md:m-0"
					>
						<div className="text-left">
							<FormField
								control={form.control}
								name="current_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Current Password</FormLabel>
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
							<FormField
								control={form.control}
								name="new_password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
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
							<Spacer size="3xs" />

							<Button className="w-full" type="submit" disabled={isLoading}>
								<Spinner showSpinner={isLoading} />
								Submit
							</Button>
							<Spacer size="4xs" />
						</div>
					</form>
				</Form>
			</div>
		</div>
	)
}
