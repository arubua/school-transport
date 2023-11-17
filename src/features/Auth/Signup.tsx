import React, { useEffect } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	AddressSchema,
	EmailSchema,
	NameSchema,
	PasswordSchema,
	PhoneSchema,
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
import { useSignUp } from '../../hooks/api/auth'
import { Spinner } from '../../components/spinner'
import { toast } from 'sonner'

const SignUpFormSchema = z.object({
	name: NameSchema,
	address: AddressSchema,
	email: EmailSchema,
	phone_number: PhoneSchema,
	contact_person: NameSchema,
	contact_person_phone_number: PhoneSchema,
})

export function SignUp() {
	const navigate = useNavigate()
	const signUpMutation = useSignUp()

	// 1. Define your form.
	const form = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: {
			name: '',
			address: '',
			email: '',
			phone_number: '',
			contact_person: '',
			contact_person_phone_number: '',
		},
	})

	async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
		console.log({ values })
		await signUpMutation.mutateAsync(values)
	}

	const { isLoading, isError, data, isSuccess } = signUpMutation

	useEffect(() => {
		if (isSuccess) {
			toast.success(`${data.message}`)
			form.reset()
			navigate('/auth/signup_confirmation')
		}
		if (isError) {
			toast.error('Oops!....SignUp failed, please try again')
		}
	}, [isSuccess, isLoading])

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col gap-3 text-center">
					<h1 className="text-h2">Let's start your journey</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs" />

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<div className="text-left">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel> School Name</FormLabel>
										<FormControl>
											<Input placeholder="City Primary" {...field} />
										</FormControl>
										{/* <FormDescription>
											This is your public display name.
										</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<Spacer size="4xs" />
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Input
												placeholder="1111 Ngara, Nairobi"
												// type="password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<Spacer size="4xs" />
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder="citiprimary@gmail.com"
												// type="password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<Spacer size="4xs" />
							<FormField
								control={form.control}
								name="phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												placeholder="0710 000000"
												// type="password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<Spacer size="4xs" />

							<FormField
								control={form.control}
								name="contact_person"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Person</FormLabel>
										<FormControl>
											<Input
												placeholder="John Doe"
												// type="password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
							<Spacer size="4xs" />

							<FormField
								control={form.control}
								name="contact_person_phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Person Phone</FormLabel>
										<FormControl>
											<Input
												placeholder="0710 000000"
												// type="password"
												{...field}
											/>
										</FormControl>
										{/* <FormDescription>This is your password.</FormDescription> */}
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button className="w-full" disabled={isLoading} type="submit">
							{isLoading && <Spinner showSpinner={isLoading} />}
							Submit
						</Button>
					</form>
				</Form>

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">
								Already have an account?
							</span>
							<Link to={'/auth/login'}>Login</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
