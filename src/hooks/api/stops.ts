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
	const { res, status } = await axiosInstance({
		url: `stops/${stopId}`,
	})
	if (!res) {
		return null
	}

	return res
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
	latitude: string | number
	longitude: string | number
	description: string
	zone_id: string
}) => {
	const { res } = await axiosInstance({
		url: 'stops',
		method: 'POST',

		data: {
			latitude: Number(latitude),
			longitude: Number(longitude),
			description,
			zone_id,
		},
	})
	if (!res) {
		return null
	}

	return res
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
	const { res, status } = await axiosInstance({
		url: `stops/${stopId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateStop = () => {
	return useMutation(updateStopById)
}

const deleteStop = async (id: string) => {
	const { res } = await axiosInstance({
		url: `stops/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteStop = () => {
	return useMutation(deleteStop)
}
