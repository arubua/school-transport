import { useQuery, useMutation } from '@tanstack/react-query'
import {
	GradeSchema,
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
	name,
	grade,
	school,
	image,
}: {
	name: typeof UsernameSchema
	grade: typeof GradeSchema
	school: typeof SchoolNameSchema
	image: string
}) => {
	const response = await fetch('/api/student', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
			grade,
			school,
			image,
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
