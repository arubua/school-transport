import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
	ImageFileSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'

const getBuses = async () => {
	const response = await fetch('/api/buses')
	if (!response.ok) {
		throw new Error('Failed to fetch buses data')
	}
	const data = await response.json()
	return data
}

export const useBuses = () => {
	return useQuery(['buses'], getBuses)
}

const addBus = async ({
	reg_number,
	capacity,
	school,
	avatarImage,
}: {
	reg_number: string
	capacity: string
	school: string
	avatarImage: File[]
}) => {
	const response = await fetch('/api/driver', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			reg_number,
			capacity,
			school,
			avatarImage,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddBus = () => {
	return useMutation(addBus)
}
