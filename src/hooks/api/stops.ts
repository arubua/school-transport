import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getStops = async () => {
	const { res, status } = await axiosInstance({
		url: 'stops',
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useStops = () => {
	return useQuery(['stops'], getStops)
}

const getStopById = async (stopId: string) => {
	const response = await fetch(`/api/stops/${stopId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch stop data')
	}
	const data = await response.json()
	return data
}

export const useStopById = (stopId: string) => {
	return useQuery(['stop', stopId], () => getStopById(stopId))
}

const addStop = async ({
	latitude,
	longitude,
	description,
	zone_id,
}: {
	latitude: string
	longitude: string
	description: string
	zone_id: string
}) => {
	const response = await fetch('/api/stop', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			latitude,
			longitude,
			description,
			zone_id,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddStop = () => {
	return useMutation(addStop)
}

const updateStopById = async ({
	stopId,
	updatedData,
}: {
	stopId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/stops/${stopId}`, {
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

export const useUpdateStop = () => {
	return useMutation(updateStopById)
}

const deleteStop = async (id: string) => {
	const response = await fetch(`/api/stops/${id}`, {
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

export const useDeleteStop = () => {
	return useMutation(deleteStop)
}
