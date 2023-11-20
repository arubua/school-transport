import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../../axiosInstance'

const getUsers = async () => {
	const { res, status } = await axiosInstance({
		url: 'users',
		method: 'GET',
	})
	if (!res) {
		throw new Error('Failed to fetch users data')
	}
	return res
}

export const useUsers = () => {
	return useQuery(['users'], getUsers)
}

const getUserById = async (userId: string) => {
	const response = await fetch(`/api/users/${userId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch user data')
	}
	const data = await response.json()
	return data
}

export const useUserById = (userId: string) => {
	return useQuery(['user', userId], () => getUserById(userId))
}

const addUser = async ({
	firstname,
	lastname,
	phone_number,
	email,
	role_id,
}: {
	firstname: string
	lastname: string
	phone_number: string
	email: string
	role_id: string
}) => {
	const response = await fetch('/api/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstname,
			lastname,
			phone_number,
			email,
			role_id,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddUser = () => {
	return useMutation(addUser)
}

const updateUserById = async ({
	userId,
	updatedData,
}: {
	userId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/users/${userId}`, {
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

export const useUpdateUser = () => {
	return useMutation(updateUserById)
}

const deleteUser = async (id: string) => {
	const response = await fetch(`/api/users/${id}`, {
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

export const useDeleteUser = () => {
	return useMutation(deleteUser)
}
