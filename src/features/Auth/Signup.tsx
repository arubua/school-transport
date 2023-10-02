import React from 'react'
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
import { Link } from 'react-router-dom'

const SignUpFormSchema = z.object({
	name: NameSchema,
	address: AddressSchema,
	email: EmailSchema,
	school_phone_number: PhoneSchema,
	contact_person: NameSchema,
	contact_person_phone: PhoneSchema,
})

export function SignUp() {
	// 1. Define your form.
	const form = useForm<z.infer<typeof SignUpFormSchema>>({
		resolver: zodResolver(SignUpFormSchema),
		defaultValues: {
			name: '',
			address: '',
			email: '',
			school_phone_number: 0,
			contact_person: '',
			contact_person_phone: 0,
		},
	})

	function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
		console.log(values)
	}

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
											<Input placeholder="" {...field} />
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
												placeholder=""
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
								name="school_phone_number"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input
												placeholder=""
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
												placeholder=""
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
								name="contact_person_phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contact Person Phone</FormLabel>
										<FormControl>
											<Input
												placeholder=""
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
						<Button type="submit">Submit</Button>
					</form>
				</Form>

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<div className="flex items-center justify-center gap-2 pt-6">
							<span className="text-muted-foreground">
								Already have an account?
							</span>
							<Link to={'/login'}>Login</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
