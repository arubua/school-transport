import { z } from 'zod'

export const UsernameSchema = z
	.string({ required_error: 'Username is required' })
	.min(3, { message: 'Username is too short' })
	.max(20, { message: 'Username is too long' })
	.regex(/^[a-zA-Z0-9_]+$/, {
		message: 'Username can only include letters, numbers, and underscores',
	})
	// users can type the username in any case, but we store it in lowercase
	.transform(value => value.toLowerCase())

export const usernameSchema = z.string().refine(
	value => {
		// Regular expression for validating a phone number in the format +254710000000
		const phoneRegex = /^\+\d{12}$/

		// Regular expression for validating an email address
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

		return phoneRegex.test(value) || emailRegex.test(value)
	},
	{
		message:
			'Invalid username. Please enter a valid phone number (+254710000000) or email address.',
	},
)

export const PasswordSchema = z
	.string({ required_error: 'Password is required' })
	.min(6, { message: 'Password is too short' })
	.max(100, { message: 'Password is too long' })
export const NameSchema = z
	.string()
	.min(3, { message: 'Name should be at least 3 characters long' })
	.max(40, { message: 'Name cannot exceed 40 characters' })
	.refine(value => !!value.trim(), {
		message: 'Please provide a valid Name',
	})
export const ResetTokenSchema = z.string({ required_error: 'Code is required' })
// .min(3, { message: 'Name is too short' })
// .max(40, { message: 'Name is too long' })
export const EmailSchema = z
	.string({ required_error: 'Email is required' })
	.email({ message: 'Email is invalid' })
	.min(3, { message: 'Email is too short' })
	.max(100, { message: 'Email is too long' })
	// users can type the email in any case, but we store it in lowercase
	.transform(value => value.toLowerCase())
export const AddressSchema = z
	.string({ required_error: 'Address is required' })
	.min(3, { message: 'Address is too short' })
	.max(100, { message: 'Address is too long' })
export const PhoneSchema = z
	.string({
		required_error: 'Phone number is required',
		// invalid_type_error: 'Phone must be a number',
	})
	.min(13, { message: 'Phone Number is too short' })
	.max(13, { message: 'Phone Number is too long' })
export const RememberUser = z.boolean({
	invalid_type_error: 'Must be a boolean',
})
export const ErrorSchema = z.object({
	message: z.string(),
	// Add any additional error properties you need here
})
//Student schemas
export const GradeSchema = z
	.string()
	.regex(/^(Class|Grade)\s\d+(\s?[A-Za-z]+)?$/, {
		message:
			'Please enter a valid Grade in the format "Class [number] [section]" or "Grade [number]".',
	})
	.min(6, {
		message:
			'The Grade input is too short. Please follow the format "Class [number] [section]" or "Grade [number]".',
	})
	.max(15, {
		message:
			'The Grade input is too long. Please follow the format "Class [number] [section]" or "Grade [number]".',
	})
export const SchoolNameSchema = z
	.string()
	.min(2, 'School name should be at least 2 characters long')

export const BusSchema = z.string().min(1, 'Please select a bus')

export const CoordinatesSchema = z.object({
	latitude: z.number(),
	longitude: z.number(),
})

export const BusStopSchema = z.object({
	name: z.string().min(2, 'Bus stop name should be at least 2 characters long'),
	location: CoordinatesSchema,
	details: z.string().optional(),
})
// export const ImageFileSchema = z.object({
// 	file: z.object({
// 		name: z.string(),
// 		type: z
// 			.string()
// 			.regex(/^image\/.+/i, 'Invalid file type. Only image files are allowed.'),
// 		size: z.number(),
// 		content: z.any(),
// 	}),
// })

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
	'image/jpeg',
	'image/jpg',
	'image/png',
	'image/webp',
]

export const ImageFileSchema = z.object({
	name: z.string(),
	type: z.string(),
	path: z.string(),
	lastModified: z.number(),
	lastModifiedDate: z.date(),
	size: z.number(),
	webkitRelativePath: z.string(),
})

export const DriverStatusSchema = z.enum([
	'active',
	'inactive',
	'suspended',
] as const)
