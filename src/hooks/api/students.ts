import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
	ImageFileSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import axiosInstance from '../axiosInstance'
const tokenString = sessionStorage.getItem('TOKEN')
if (!tokenString) {
	// throw new Error('Token not found in sessionStorage')
	console.log("Token not found")
}

// const token: string = JSON.parse(tokenString)
const token: string = ''

const getStudents = async () => {
	const { res, status } = await axiosInstance({
		url: 'students',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res) {
		throw new Error('Failed to fetch students data')
	}

	return res.data.data
}

export const useStudents = () => {
	return useQuery(['students'], getStudents)
}

const addStudent = async ({
	firstname,
	lastname,
	admission_no,
	class_name,
	school_id,
	parent_id,
	stop_id,
}: {
	firstname: string
	lastname: string
	class_name: string
	school_id: string
	admission_no: string
	parent_id: string
	stop_id:string
}) => {
	const { res, status } = await axiosInstance({
		url: 'students',
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		data: {
			firstname,
			lastname,
			admission_no,
			class_name,
			school_id,
			parent_id,
			stop_id,
		},
	})
	if (!res) {
		throw new Error('Failed to add student')
	}

	return res
}

export const useAddStudent = () => {
	return useMutation(addStudent)
}

const updateStudentById = async ({
	studentId,
	updatedData,
}: {
	studentId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/students/${studentId}`, {
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

export const useUpdateStudent = () => {
	return useMutation(updateStudentById)
}

const deleteStudent = async (id: string) => {
	const response = await fetch(`/api/students/${id}`, {
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

export const useDeleteStudent = () => {
	return useMutation(deleteStudent)
}
