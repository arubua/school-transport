import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
	ImageFileSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'

const getDrivers = async () => {
	const response = await fetch('/api/drivers')
	if (!response.ok) {
		throw new Error('Failed to fetch drivers data')
	}
	const data = await response.json()
	return data
}

export const useDrivers = () => {
	return useQuery(['drivers'], getDrivers)
}

const addDriver = async ({
	firstName,
	lastName,
	phone_number,
	bus_id,
    avatarImage
}: {
	firstName: string
	lastName: string
	phone_number: string
	bus_id: string
    avatarImage: File[]
}) => {
	const response = await fetch('/api/driver', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName,
			lastName,
			phone_number,
			bus_id,
            avatarImage
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddDriver = () => {
	return useMutation(addDriver)
}
