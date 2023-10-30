import { Spacer } from '../../components/spacer'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../../components/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Spinner } from '../../components/spinner'
import {
	AddressSchema,
	EmailSchema,
	ImageFileSchema,
	NameSchema,
} from '../../utils/user-validation'
import { z } from 'zod'
import { useAddParent, useUpdateParent } from '../../hooks/api/parents'
import { Separator } from '../../components/separator'
import { useEffect, useState } from 'react'
import { FileRejection } from 'react-dropzone'
import FileUpload from '../../components/ui/file-input'
import { useLocation } from 'react-router-dom'

export const ParentFormSchema = z.object({
	firstName: NameSchema,
	lastName: NameSchema,
	email: EmailSchema,
	phone: z.string(),
	address: AddressSchema,
	// avatarImage: z.array(ImageFileSchema).optional(),
	avatarImage: z.array(z.string()),

})

const ParentForm = () => {
	const location = useLocation()

	const [isUpdating] = useState(location.state && location.state.parent)

	const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
	const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([])
	const [parentId, setParentId] = useState('')

	const handleDeleteImage = (fileToDelete: File) => {
		const updatedAcceptedFiles = acceptedFiles.filter(
			file => file !== fileToDelete,
		)
		setAcceptedFiles(updatedAcceptedFiles)
	}

	const AddParentMutation = useAddParent()
	const updateParentMutation = useUpdateParent()

	const { isLoading, isError, data, isSuccess } = AddParentMutation

	// Create an object matching the schema
	const fileData = {
		name: 'example.jpg',
		type: 'image/jpeg',
		path: '/path/to/file.jpg',
		lastModified: Date.now(),
		lastModifiedDate: new Date(),
		size: 1024, // Size in bytes
		webkitRelativePath: '/path/to/file.jpg',
	}

	// Convert the object to a File
	const file = new File([JSON.stringify(fileData)], fileData.name, {
		type: fileData.type,
		lastModified: fileData.lastModified,
	})

	const form = useForm<z.infer<typeof ParentFormSchema>>({
		resolver: zodResolver(ParentFormSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			address: '',
			avatarImage: [""],
		},
	})

	useEffect(() => {
		if (isUpdating) {
			const parentData = location.state.parent
			setParentId(parentData.id)
			form.reset(parentData)
		}
	}, [isUpdating, location.state, form])

	async function onSubmit(values: z.infer<typeof ParentFormSchema>) {

		if (isUpdating) {
			await updateParentMutation.mutateAsync({
				parentId: parentId,
				updatedData: values,
			})
		} else {
			await AddParentMutation.mutateAsync(values)
		}
	}

	return (
		<div>
			<div className="flex flex-col items-start">
				<Spacer size="3xs" />
				<h4 className="font-semibold">Personal Info</h4>
				<p className="text-muted-foreground">
					Update parents photo and personal details here.
				</p>
			</div>
			<Spacer size="4xs" />

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="m-4 space-y-8 md:m-0"
				>
					<div className=" text-left">
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col gap-2 md:flex-row md:gap-0">
							<div className="w-64">
								<FormLabel>Name</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="First name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												className="ml-0 md:ml-2"
												placeholder="Last name"
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
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Email</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="jdoe@gmail.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Phone Number</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="+254710000000" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Address</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input placeholder="Kasuku Center" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="4xs" />
						<Separator orientation="horizontal" />
						<Spacer size="4xs" />
						<div className="flex flex-col md:flex-row">
							<div className="w-64">
								<FormLabel>Avatar</FormLabel>
							</div>
							<FormField
								control={form.control}
								name="avatarImage"
								render={({ field: { onChange } }) => (
									<FormItem>
										<FormControl>
											<FileUpload
												accept={{
													'image/png': ['.png'],
													'image/jpg': ['.jpg'],
													'image/jpeg': ['.jpeg'],
												}}
												multiple={false} // Set this to true if you want to allow multiple files
												onDrop={(acceptedFiles, rejectedFiles) => {
													setAcceptedFiles(acceptedFiles)
													setRejectedFiles(rejectedFiles)
													onChange(acceptedFiles)
												}}
												// error={'upload files error'}
												format="PNG JPG JPEG"
												size={5}
												onDownload={() => {
													// Handle the download action here
												}}
												downloading={false}
												acceptedFiles={acceptedFiles}
												fileName="avatar"
												delete={file => {
													handleDeleteImage(file)
												}}
												rejectedFiles={rejectedFiles}
												// {...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Spacer size="3xs" />
						<div className="flex max-w-xl justify-end">
							<Button size="sm" type="submit" disabled={isLoading}>
								{isLoading && <Spinner showSpinner={isLoading} />}
								Submit
							</Button>
						</div>
					</div>
				</form>
			</Form>
		</div>
	)
}

export default ParentForm
