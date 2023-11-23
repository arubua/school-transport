import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'
import { z } from 'zod'

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

const DriverStatusSchema = z.enum(['active', 'inactive', 'suspended'] as const)
type DriverStatus = z.infer<typeof DriverStatusSchema>

const addDriver = async ({
	firstname,
	lastname,
	phone_number,
	school_id,
	status,
}: {
	firstname: string
	lastname: string
	phone_number: string
	school_id: string
	status: DriverStatus
}) => {
	const { res } = await axiosInstance({
		url: 'drivers',
		method: 'POST',

		data: {
			firstname,
			lastname,
			phone_number,
			school_id,
			status,
			password: 'password',
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

const assignBus = async ({
	driver_id,
	bus_id,
}: {
	driver_id: string
	bus_id: string
}) => {
	const { res, status } = await axiosInstance({
		url: 'drivers/assign-bus',
		method: 'PUT',

		data: { driver_id, bus_id },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useAssignBus = () => {
	return useMutation(assignBus)
}
