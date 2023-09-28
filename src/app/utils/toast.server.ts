import { createId as cuid } from '@paralleldrive/cuid2'
import { z } from 'zod'


const TypeSchema = z.enum(['message', 'success', 'error'])
const ToastSchema = z.object({
	description: z.string(),
	id: z.string().default(() => cuid()),
	title: z.string().optional(),
	type: TypeSchema.default('message'),
})

export type Toast = z.infer<typeof ToastSchema>
export type OptionalToast = Omit<Toast, 'id' | 'type'> & {
	id?: string
	type?: z.infer<typeof TypeSchema>
}