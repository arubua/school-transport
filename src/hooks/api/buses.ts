import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getBuses = async () => {
	const { res, status } = await axiosInstance({
		url: 'buses',
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useBuses = () => {
	return useQuery(['buses'], getBuses)
}

const addBus = async ({
	reg_number,
	capacity,
	school_id, // avatarImage,
}: {
	reg_number: string
	capacity: number | string
	school_id: string
	// avatarImage: File[] | undefined
}) => {
	const { res } = await axiosInstance({
		url: 'buses',
		method: 'POST',

		data: {
			reg_number,
			capacity: Number(capacity),
			school_id,
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddBus = () => {
	return useMutation(addBus)
}

const updateBus = async ({
	busId,
	updatedData,
}: {
	busId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url: `buses/${busId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateBus = () => {
	return useMutation(updateBus)
}

const deleteBus = async (id: string) => {
	const { res } = await axiosInstance({
		url: `buses/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteBus = () => {
	return useMutation(deleteBus)
}
