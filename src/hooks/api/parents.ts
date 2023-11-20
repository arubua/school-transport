import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'
import { clearUserSession } from '../../utils/storage'
import { toast } from 'sonner'

const getParents = async () => {
	const { res, status } = await axiosInstance({
		url: 'parents',
		headers: {
			//
		},
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useParents = () => {
	return useQuery(['parents'], getParents)
}

const getParentById = async (parentId: string) => {
	const { res, status } = await axiosInstance({
		url: `parents/${parentId}`,
	})
	if (!res) {
		return {}
	}

	return res.data.data
}

export const useParentById = (parentId: string) => {
	return useQuery(['parent', parentId], () => getParentById(parentId))
}

const addParent = async ({
	firstname,
	lastname,
	email,
	phone_number,
	address, // avatarImage,
}: {
	firstname: string
	lastname: string
	email: string
	phone_number: string
	address: string
	// avatarImage: File[] | undefined
}) => {
	const { res, status } = await axiosInstance({
		url: 'parents',
		method: 'POST',

		data: {
			firstname,
			lastname,
			email,
			phone_number,
			address,
			password: 'password',
			// avatarImage,
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddParent = () => {
	return useMutation(addParent)
}

const updateParentById = async ({
	parentId,
	updatedData,
}: {
	parentId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url: `parents/${parentId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateParent = () => {
	return useMutation(updateParentById)
}

const deleteParent = async (id: string) => {
	const { res, status } = await axiosInstance({
		url: `parents/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteParent = () => {
	const queryClient = new QueryClient()

	return useMutation(deleteParent, {
		onSuccess: async data => {
			await queryClient.refetchQueries({ queryKey: ['parents'], exact: true })
		},
	})
}
