// src/hooks/useLogin.ts
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
	// Replace this with your actual login API request.
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

	return response.json()
}

export const useLogin = () => {
	return useMutation(login)
}
