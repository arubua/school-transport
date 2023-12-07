import React, { useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	PasswordSchema,
	RememberUser,
	usernameSchema,
} from '../../utils/user-validation'
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
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/ui/checkbox'
import { Icon } from '../../components/ui/icon'
import Logo from '../../components/ui/logo'
import { useLogin } from '../../hooks/api/auth'
import { Spinner } from '../../components/spinner'
import safiriLogo from '../../../other/svg-icons/safiri-logo.svg'

const LoginFormSchema = z.object({
	username: usernameSchema,
	password: PasswordSchema,
	remember_user: RememberUser,
})

export function Login() {
	const navigate = useNavigate()
	const loginMutation = useLogin()

	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

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

	const { isLoading, isError, data, isSuccess } = loginMutation

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex justify-center">
					<Logo className="logo-class h-20 w-28" />
				</div>
				<div className="flex flex-col gap-3 text-center">
					<h2 className="text-h2">Welcome back!</h2>
					<p className="text-body-sm text-muted-foreground">
						Please enter your details.
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
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="use email or phone number"
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
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													type={showPassword ? 'text' : 'password'}
													placeholder="Password"
													{...field}
												/>
												<div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3">
													{showPassword ? (
														<Icon
															name="eye-open"
															onClick={togglePasswordVisibility}
														/>
													) : (
														<Icon
															name="eye-closed"
															onClick={togglePasswordVisibility}
														/>
													)}
												</div>
											</div>
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
								<Button className="p-0" variant="link">
									<Link to={'/auth/reset_password'}>Forgot Password ?</Link>
								</Button>
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
				</Form>

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">New here ?</span>
							<Button className="p-0" variant="link">
								<Link to={'/auth/signup'}>Create an account</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
