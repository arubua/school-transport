import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getZones = async () => {
	const { res, status } = await axiosInstance({
		url: 'zones',
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useZones = () => {
	return useQuery(['zones'], getZones)
}

const AddZone = async ({ name,school_id }: { name: string,school_id:string }) => {
	const { res } = await axiosInstance({
		url: 'zones',
		method: 'POST',

		data: {
			name,
			school_id
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddZone = () => {
	return useMutation(AddZone)
}

const updateZoneById = async ({
	zoneId,
	updatedData,
}: {
	zoneId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url: `zones/${zoneId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateZone = () => {
	return useMutation(updateZoneById)
}

const deleteZone = async (id: string) => {
	const { res } = await axiosInstance({
		url: `zones/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteZone = () => {
	return useMutation(deleteZone)
}
