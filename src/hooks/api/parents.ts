import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getParents = async () => {
	const tokenString = sessionStorage.getItem('TOKEN')
	if (!tokenString) {
		throw new Error('Token not found in sessionStorage')
	}

	const token: string = JSON.parse(tokenString)
	const {res,status} = await axiosInstance({
		url:'parents',
		headers:{
			Authorization:`Bearer ${token}`
		}

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
	const response = await fetch(`/api/parents/${parentId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch parent data')
	}
	const data = await response.json()
	return data
}

export const useParentById = (parentId: string) => {
	return useQuery(['parent', parentId], () => getParentById(parentId))
}

const addParent = async ({
	firstName,
	lastName,
	email,
	phone,
	address,
	avatarImage,
}: {
	firstName: string
	lastName: string
	email: string
	phone: string
	address: string
	avatarImage: File[] | undefined
}) => {
	const response = await fetch('/api/parents', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName,
			lastName,
			email,
			phone,
			address,
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
	const response = await fetch(`/api/parents/${parentId}`, {
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

export const useUpdateParent = () => {
	return useMutation(updateParentById)
}



const deleteParent = async (id: string) => {
	const response = await fetch(`/api/parents/${id}`, {
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

export const useDeleteParent = () => {
	return useMutation(deleteParent)
}
