import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../../axiosInstance'
import { toast } from 'sonner'

const getSchools = async () => {
	const { res, status } = await axiosInstance({
		url: 'schools',
		method: 'GET',
	})
	if (!res) {
		toast.error('Failed to fetch roles data')
	}
	// const data = await res.json()
	return res
}

export const useSchools = () => {
	return useQuery(['schools'], getSchools)
}

const getSchoolById = async (schoolId: string) => {
	const { res, status } = await axiosInstance({
		url: `schools/${schoolId}`,
	})

	if (!res) {
		return null
	}

	return res.data.data
}

export const useSchoolById = (schoolId: string) => {
	return useQuery({
		queryKey: ['school', schoolId],
		queryFn: () => getSchoolById(schoolId),
		staleTime: Infinity,
	})
}

const addSchool = async ({
	name,
	address,
	email,
	phone_number,
	contact_person,
	contact_person_phone,
}: {
	name: string
	address: string
	email: string
	phone_number: string
	contact_person: string
	contact_person_phone: string
}) => {
	const { res, status } = await axiosInstance({
		url: 'schools',
		method: 'POST',
		data: {
			name,
			address,
			email,
			phone_number,
			contact_person,
			contact_person_phone,
		},
	})
	if (!res) {
		toast.error('Failed to fetch roles data')
	}
	// const data = await res.json()
	return res
}

export const useAddSchool = () => {
	return useMutation(addSchool)
}

const updateSchoolById = async ({
	schoolId,
	updatedData,
}: {
	schoolId: string
	updatedData: object
}) => {
	const { res, status } = await axiosInstance({
		url:`/schools/${schoolId}`,
		method: 'PUT',
		data: JSON.stringify(updatedData),
	})

	if (!res) {
		return null
	}

	return res
}

export const useUpdateSchool = () => {
	return useMutation(updateSchoolById)
}

const deleteSchool = async (id: string) => {
	const response = await fetch(`/api/schools/${id}`, {
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

export const useDeleteSchool = () => {
	return useMutation(deleteSchool)
}
