import { useMutation } from '@tanstack/react-query'

const login = async ({
	username,
	password,
	remember_user,
}: {
	username: string
	password: string
	remember_user: boolean
}) => {
	const response = await fetch('/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ username, password, remember_user }),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useLogin = () => {
	return useMutation(login)
}

const signUp = async ({
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
	const response = await fetch('/api/signup', {
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

export const useSignUp = () => {
	return useMutation(signUp)
}
