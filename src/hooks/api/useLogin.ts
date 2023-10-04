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

	return response.json()
}

export const useLogin = () => {
	return useMutation(login)
}
