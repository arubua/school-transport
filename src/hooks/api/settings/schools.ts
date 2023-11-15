import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../../axiosInstance'

const getSchools = async () => {
	const response = await fetch('/api/schools')
	if (!response.ok) {
		throw new Error('Failed to fetch schools data')
	}
	const data = await response.json()
	return data
}

export const useSchools = () => {
	return useQuery(['schools'], getSchools)
}

const getSchoolById = async (schoolId: string) => {
	const {res,status} = await axiosInstance({
		url:`schools/${schoolId}`
	})

	if (!res) {
		throw new Error('Failed to fetch school data')
	}

	return res.data.data
}

export const useSchoolById = (schoolId: string) => {
	return useQuery({
		queryKey:['school',schoolId], 
		queryFn:() => getSchoolById(schoolId),
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
	const response = await fetch('/api/schools', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
			address,
			email,
			phone_number,
			contact_person,
			contact_person_phone,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
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
	const {res,status} = await axiosInstance( {
		method: 'PUT',
		url:'',
		data: JSON.stringify(updatedData),
	})

	if (!res) {
		throw new Error('Failed to fetch school')
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
