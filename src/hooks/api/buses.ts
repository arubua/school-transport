import { useQuery, useMutation } from '@tanstack/react-query'

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
	driverId,
	avatarImage,
}: {
	reg_number: string
	capacity: string
	driverId: string
	avatarImage: File[] | undefined
}) => {
	const response = await fetch('/api/driver', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			reg_number,
			capacity,
			driverId,
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

const deleteBus = async (id: string) => {
	const response = await fetch(`/api/buses/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		const data = await response.json()
		throw new Error(data.error)
	}

	return {}
}

export const useDeleteBus = () => {
	return useMutation(deleteBus)
}

const updateBus = async ({
	busId,
	updatedData,
}: {
	busId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/buses/${busId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedData),
	})

	if (!response.ok) {
		const data = await response.json()
		throw new Error(data.error)
	}

	const data = await response.json()
	return data
}

export const useUpdateBus = () => {
	return useMutation(updateBus)
}
