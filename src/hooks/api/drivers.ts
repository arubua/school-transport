import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getDrivers = async () => {
	const { res, status } = await axiosInstance({
		url: 'drivers',
		headers: {
			//
		},
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useDrivers = () => {
	return useQuery(['drivers'], getDrivers)
}

const getDriverById = async (driverId: string) => {
	const { res, status } = await axiosInstance({
		url: `drivers/${driverId}`,
	})
	if (!res) {
		return {}
	}

	return res.data.data
}

export const useGetDriverById = (driverId: string) => {
	return useQuery(['parent', driverId], () => getDriverById(driverId))
}

const addDriver = async ({
	firstname,
	lastname,
	phone_number,
	bus_id,
	avatarImage,
}: {
	firstname: string
	lastname: string
	phone_number: string
	bus_id: string
	avatarImage: File[] | undefined
}) => {
	const { res, status } = await axiosInstance({
		url: 'parents',
		method: 'POST',

		data: {
			firstname,
			lastname,
			phone_number,
			bus_id,
			avatarImage,
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddDriver = () => {
	return useMutation(addDriver)
}

const deleteDriver = async (id: string) => {
	const { res, status } = await axiosInstance({
		url: `drivers/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteDriver = () => {
	return useMutation(deleteDriver)
}

const updateDriver = async ({
	driverId,
	updatedData,
}: {
	driverId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url: `drivers/${driverId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateDriver = () => {
	return useMutation(updateDriver)
}
