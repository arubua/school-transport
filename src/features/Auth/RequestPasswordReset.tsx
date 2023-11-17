import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	EmailSchema,
	PasswordSchema,
	ResetTokenSchema,
	usernameSchema,
} from '../../utils/user-validation'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Spacer } from '../../components/spacer'
import Logo from '../../components/ui/logo'
import { useRequestResetPassword, useResetPassword } from '../../hooks/api/auth'
import { Spinner } from '../../components/spinner'
import { clearUserSession, getUser } from '../../utils/storage'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const RequestResetSchema = z.object({
	email: EmailSchema,
})

const ResetSchema = z.object({
	email: EmailSchema,
	token: ResetTokenSchema,
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

export function PasswordReset() {
	const navigate = useNavigate()
	const [user, setUser] = useState<User | null>(null)
	const [email, setEmail] = useState<string>('')
	const [activeForm, setActiveForm] = useState<string>('request')

	const requestResetMutation = useRequestResetPassword()
	const resetPasswordMutation = useResetPassword()

	useEffect(() => {
		async function init() {
			let userData = await getUser()

			setUser(userData)
			form.reset(userData)
		}

		init()
	}, [])

	const form = useForm<z.infer<typeof RequestResetSchema>>({
		resolver: zodResolver(RequestResetSchema),
		defaultValues: {
			email: '',
		},
	})

	const resetForm = useForm<z.infer<typeof ResetSchema>>({
		resolver: zodResolver(ResetSchema),
		defaultValues: {
			email: email,
			token: '',
			new_password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof RequestResetSchema>) {
		setEmail(values.email)
		await requestResetMutation.mutateAsync(values)
	}

	async function onSubmitReset(values: z.infer<typeof ResetSchema>) {
		await resetPasswordMutation.mutateAsync(values)
	}

	const { isLoading, data, isError, error, isSuccess } = requestResetMutation

	useEffect(() => {
		if (isSuccess) {
			// toast.success(`${data.message}`)
			setActiveForm('reset')
		}
		if (isError) {
			toast.error(`${error}`)
		}
	}, [isSuccess, isLoading])

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
					{/* <p className="text-body-sm text-muted-foreground">
						Update your password below to continue...
					</p> */}
					{activeForm === 'reset' && (
						<p className="text-body-sm text-muted-foreground">
							Enter the reset code sent to your email and your new password to
							continue.
						</p>
					)}
				</div>
				<Spacer size="4xs" />
				{activeForm === 'request' && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="m-4 space-y-8 md:m-0"
						>
							<div className="text-left">
								<Spacer size="4xs" />
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your registered Email</FormLabel>
											<FormControl>
												<Input
													// placeholder="********"
													type="email"
													{...field}
												/>
											</FormControl>
											<FormMessage />
											<FormDescription>
												Enter the email associated with your account here.
											</FormDescription>
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
				)}
				{activeForm === 'reset' && (
					<Form {...resetForm}>
						<form
							onSubmit={resetForm.handleSubmit(onSubmitReset)}
							className="m-4 space-y-8 md:m-0"
						>
							<div className="text-left">
								<Spacer size="4xs" />
								<FormField
									control={resetForm.control}
									name="token"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Code</FormLabel>
											<FormControl>
												<Input
													// placeholder="********"
													type="text"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Spacer size="4xs" />
								<FormField
									control={resetForm.control}
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
				)}
			</div>
		</div>
	)
}
