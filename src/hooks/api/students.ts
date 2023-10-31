import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
	ImageFileSchema,
	SchoolNameSchema,
	UsernameSchema,
} from '../../utils/user-validation'

const getStudents = async () => {
	const response = await fetch('/api/students')
	if (!response.ok) {
		throw new Error('Failed to fetch students data')
	}
	const data = await response.json()
	return data
}

export const useStudents = () => {
	return useQuery(['students'], getStudents)
}

const addStudent = async ({
	firstName,
	lastName,
	grade,
	school,
	avatarImage,
	parent,
}: {
	firstName: string
	lastName: string
	grade: string
	school: string
	avatarImage: File[]
	parent: string
}) => {
	const response = await fetch('/api/student', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName,
			lastName,
			grade,
			school,
			avatarImage,
			parent
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddStudent = () => {
	return useMutation(addStudent)
}
