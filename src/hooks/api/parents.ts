import { useQuery, useMutation } from '@tanstack/react-query'

const getParents = async () => {
	const response = await fetch('/api/parents')
	if (!response.ok) {
		throw new Error('Failed to fetch parents data')
	}
	const data = await response.json()
	return data
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

// // Specify the types for parentId and updatedData
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
	avatarImage: File[]
}) => {
	const response = await fetch('/api/student', {
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
