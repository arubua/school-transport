import React from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { PasswordSchema, UsernameSchema } from '../../utils/user-validation'
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
import { Link } from 'react-router-dom'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
})

export default function Login() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	function onSubmit(values: z.infer<typeof LoginFormSchema>) {
		console.log(values)
	}

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h1">Welcome back!</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs" />
				<div className="text-left">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input placeholder="wazza" {...field} />
										</FormControl>
										<FormDescription>
											This is your public display name.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="password"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormDescription>This is your password.</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Submit</Button>
						</form>
					</Form>
				</div>
				<div>
					<div className="mx-auto w-full max-w-md px-8">
						{/* <ul className="mt-5 flex flex-col gap-5 border-b-2 border-t-2 border-border py-3">
							{providerNames.map(providerName => (
								<li key={providerName}>
									<ProviderConnectionForm
										type="Login"
										providerName={providerName}
										redirectTo={redirectTo}
									/>
								</li>
							))}
						</ul> */}
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">New here?</span>
							<Link to={'/signup'}>Create an account</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
