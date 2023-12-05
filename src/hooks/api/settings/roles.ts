import { useQuery, useMutation } from '@tanstack/react-query'
import { getEnv } from '../../../utils/env.server'
import axiosInstance from '../../axiosInstance'
import { toast } from 'sonner'



const getRoles = async () => {
	const { res, status } = await axiosInstance({
		url: 'roles',
		method: 'GET',
	})
	if (!res) {
		toast.error('Failed to fetch roles data')
	}
	// const data = await res.json()
	return res
}

export const useRoles = () => {
	return useQuery(['roles'], getRoles)
}

const getRoleById = async (roleId: string) => {
	const response = await fetch(`/api/roles/${roleId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch role data')
	}
	const data = await response.json()
	return data
}

export const useRoleById = (roleId: string) => {
	return useQuery(['role', roleId], () => getRoleById(roleId))
}

const addRole = async ({ name }: { name: string }) => {
	const response = await fetch('/api/roles', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddRole = () => {
	return useMutation(addRole)
}

const updateRoleById = async ({
	roleId,
	updatedData,
}: {
	roleId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/roles/${roleId}`, {
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

export const useUpdateRole = () => {
	return useMutation(updateRoleById)
}

const deleteRole = async (id: string) => {
	const response = await fetch(`/api/roles/${id}`, {
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

export const useDeleteRole = () => {
	return useMutation(deleteRole)
}
