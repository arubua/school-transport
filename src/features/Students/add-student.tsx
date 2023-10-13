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
import {
	BusStopSchema,
	GradeSchema,
	ImageFileSchema,
	NameSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddStudent } from '../../hooks/api/students'
import { Separator } from '../../components/separator'

const StudentFormSchema = z.object({
	name: NameSchema,
	grade: GradeSchema,
	school: SchoolNameSchema,
	// bus_stop: BusStopSchema,
	// image: ImageFileSchema,
})

const AddStudent = () => {
	const addStudentMutation = useAddStudent()

	const { isLoading, isError, data, isSuccess } = addStudentMutation

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			name: '',
			grade: undefined,
			school: '',
			// bus_stop: {},
			// image: {},
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		await addStudentMutation.mutateAsync(values)
	}

	return (
		<div>
			<Spacer size="2xs" />
			<Tabs defaultValue="student" className=" w-full">
				<TabsList className="flex justify-start">
					<TabsTrigger value="student">Student Details</TabsTrigger>
					<TabsTrigger value="parent">Parent Details</TabsTrigger>
				</TabsList>
				<TabsContent value="student">
					<div>
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="m-4 space-y-8 md:m-0"
							>
								<div className=" text-left">
									<Spacer size="4xs" />
									<Separator orientation="horizontal" />
									<Spacer size="4xs" />
									<div className="flex">
										<div className="w-64">
											<FormLabel>Name</FormLabel>
										</div>
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															className="w-96"
															placeholder="Luke Skywalker"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Spacer size="4xs" />
									<Separator orientation="horizontal" />
									<Spacer size="4xs" />
									<div className="flex">
										<div className="w-64">
											<FormLabel>Grade</FormLabel>
										</div>
										<FormField
											control={form.control}
											name="grade"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															className="w-96"
															placeholder="1"
															type="number"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Spacer size="4xs" />
									<Separator orientation="horizontal" />
									<Spacer size="4xs" />
									<div className="flex">
										<div className="w-64">
											<FormLabel>School</FormLabel>
										</div>
										<FormField
											control={form.control}
											name="name"
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															className="w-96"
															placeholder="NBBPS"
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<Spacer size="4xs" />
									<Separator orientation="horizontal" />
									<Spacer size="4xs" />
									{/* <Button className="w-full" type="submit" disabled={isLoading}>
										<Spinner showSpinner={isLoading} />
										Submit
									</Button> */}
								</div>
							</form>
						</Form>
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
