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

export const PasswordSchema = z
	.string({ required_error: 'Password is required' })
	.min(6, { message: 'Password is too short' })
	.max(100, { message: 'Password is too long' })
export const NameSchema = z
	.string({ required_error: 'Name is required' })
	.min(3, { message: 'Name is too short' })
	.max(40, { message: 'Name is too long' })
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
	.number({
		required_error: 'Phone number is required',
		invalid_type_error: 'Phone must be a number',
	})
	.min(10, { message: 'Phone Number is too short' })
	.max(10, { message: 'Phone Number is too long' })
export const RememberUser = z.boolean({
	invalid_type_error: 'Must be a boolean',
})
export const ErrorSchema = z.object({
	message: z.string(),
	// Add any additional error properties you need here
})
//Student schemas
export const GradeSchema = z
	.number()
	.int() // Ensure it's an integer
	.min(1, 'Grade should be at least 1')
	.max(8, 'Grade cannot be greater than 8')
	.refine(grade => Number.isInteger(grade), {
		message: 'Grade should be a whole number',
	})
export const SchoolNameSchema = z
	.string()
	.min(2, 'School name should be at least 2 characters long')

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
	image: z
		.any()
		.refine(
			files => files?.[0]?.size <= MAX_FILE_SIZE,
			`Max image size is 5MB.`,
		)
		.refine(
			files => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			'Only .jpg, .jpeg, .png and .webp formats are supported.',
		),
})
