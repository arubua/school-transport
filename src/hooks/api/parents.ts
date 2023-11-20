import { useQuery, useMutation, QueryClient } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'
import { clearUserSession } from '../../utils/storage'

const tokenString = sessionStorage.getItem('TOKEN')
if (!tokenString) {
	console.log("Token not found in sessionStorage")
	// throw new Error('Token not found in sessionStorage')
}

const token: string =""; //JSON.parse(tokenString);



const getParents = async () => {
	// const tokenString = sessionStorage.getItem('TOKEN')
	// if (!tokenString) {
	// 	throw new Error('Token not found in sessionStorage')
	// }

	// const token: string = JSON.parse(tokenString)
	const { res, status } = await axiosInstance({
		url: 'parents',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res) {
		throw new Error('Failed to fetch parents data')
	}

	return res.data.data
}

export const useParents = () => {
	return useQuery(['parents'], getParents)
}

const getParentById = async (parentId: string) => {
	// const tokenString = sessionStorage.getItem('TOKEN')
	// if (!tokenString) {
	// 	throw new Error('Token not found in sessionStorage')
	// }

	// const token: string = JSON.parse(tokenString)
	const { res, status } = await axiosInstance({
		url: `parents/${parentId}`,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res) {
		throw new Error('Failed to get parent')
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
		headers: {
			Authorization: `Bearer ${token}`,
		},
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
		throw new Error('Failed to add parent')
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
		headers: {
			Authorization: `Bearer ${token}`,
		},
		data: { ...updatedData },
	})
	if (!res) {
		throw new Error('Failed to update parent')
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
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res) {
		throw new Error('Failed to delete parent')
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
