import React, { useEffect, useLayoutEffect, useState } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	ErrorSchema,
	PasswordSchema,
	RememberUser,
	UsernameSchema,
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
import { Link, useNavigate } from 'react-router-dom'
import { Checkbox } from '../../components/ui/checkbox'
import { Icon } from '../../components/ui/icon'
import Logo from '../../components/ui/logo'
import { useLogin } from '../../hooks/api/auth'
import { Spinner } from '../../components/spinner'
import { toast } from 'sonner'
import { useLocalStorage, useSessionStorage } from '../../hooks/hooks'
import { getSessionExpirationDate } from '../../utils/auth'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	remember_user: RememberUser,
})

export function Login() {
	const [storedUser, setStoredUser] = useLocalStorage('USER', null)
	const [storedToken, setStoredToken] = useSessionStorage('TOKEN', null)
	const [tokenExpiry, setTokenExpiry] = useSessionStorage(
		'TOKEN_EXPIRY',
		new Date(),
	)

	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const navigate = useNavigate() // Get the navigate function
	const loginMutation = useLogin()

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

	useEffect(() => {
		if (isSuccess) {
			toast.success('Login successful')
			setStoredUser(data)
			setStoredToken(data.token)
			form.reset()

			setTokenExpiry(getSessionExpirationDate())
			navigate('/app/parents') // Redirect to /app on success
		}
		if (isError) {
			toast.error('Failed to login!')
		}
	}, [isSuccess, isLoading])

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex justify-center text-6xl font-extrabold text-primary ">
					{/*You can add a logo here*/}
				</div>
				<div className="flex flex-col gap-3 text-center">
					<h2 className="text-h2">Welcome back!</h2>
					<p className="text-body-sm text-muted-foreground">
						Use <strong>testuser</strong> and <strong>testpassword</strong> as your credentials to Login.
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
				</Form>

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">New here ?</span>
							<Button className="p-0" variant="link">
								<Link to={'/signup'}>Create an account</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
