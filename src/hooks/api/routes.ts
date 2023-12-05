import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getRoutes = async () => {
	const { res, status } = await axiosInstance({
		url: 'routes',
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useRoutes = () => {
	return useQuery(['routes'], getRoutes)
}

const getRouteById = async (routeId: string) => {
	const { res, status } = await axiosInstance({
		url: `buses/${routeId}`,
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useRouteById = (routeId: string) => {
	return useQuery(['route', routeId], () => getRouteById(routeId))
}

const addRoute = async ({
	name,
	zone_id,
	stop_ids,
	description
}: {
	name: string
	zone_id: string
	description:string
	stop_ids: Array<{ label: string; value: string }>
}) => {
	const { res } = await axiosInstance({
		url: 'routes',
		method: 'POST',

		data: {
			name,
			zone_id,
			stop_ids: stop_ids.map(stop => stop.value),
			description
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddRoute = () => {
	return useMutation(addRoute)
}

const updateRouteById = async ({
	routeId,
	updatedData,
}: {
	routeId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url: `routes/${routeId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateRoute = () => {
	return useMutation(updateRouteById)
}

const deleteRoute = async (id: string) => {
	const { res } = await axiosInstance({
		url: `routes/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteRoute = () => {
	return useMutation(deleteRoute)
}
