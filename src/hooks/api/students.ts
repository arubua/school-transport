import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
	ImageFileSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'
import axiosInstance from '../axiosInstance'
import { toast } from 'sonner'

const getStudents = async () => {
	const { res, status } = await axiosInstance({
		url: 'students',
	})
	if (!res) {
		return []
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
	stop_id: string
}) => {
	const { res, status } = await axiosInstance({
		url: 'students',
		method: 'POST',

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
		return null
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
	const { res, status } = await axiosInstance({
		url: `students/${studentId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateStudent = () => {
	return useMutation(updateStudentById)
}

const deleteStudent = async (id: string) => {
	const { res, status } = await axiosInstance({
		url: `students/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteStudent = () => {
	return useMutation(deleteStudent)
}
