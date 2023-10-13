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
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddStudent } from '../../hooks/api/students'

const StudentFormSchema = z.object({
	name: UsernameSchema,
	grade: GradeSchema,
	school: SchoolNameSchema,
	bus_stop: BusStopSchema,
	image: ImageFileSchema,
})

const AddStudent = () => {
	const addStudentMutation = useAddStudent()

	const form = useForm<z.infer<typeof StudentFormSchema>>({
		resolver: zodResolver(StudentFormSchema),
		defaultValues: {
			name: '',
			grade: undefined,
			school: '',
			bus_stop: {},
			image: undefined,
		},
	})

	async function onSubmit(values: z.infer<typeof StudentFormSchema>) {
		await addStudentMutation.mutateAsync(values)
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
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input placeholder="Luke Skywalker" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Spacer size="4xs" />
								<FormField
									control={form.control}
									name="grade"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Grade</FormLabel>
											<FormControl>
												<Input placeholder="2" type="number" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Spacer size="4xs" />
								<div className="flex justify-between">
									<FormField
										control={form.control}
										name="bus_stop"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input placeholder="" {...field} />
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
