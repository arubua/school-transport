import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { getEnv } from '../../utils/env.server'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage, useSessionStorage } from '../hooks'
import { getSessionExpirationDate } from '../../utils/auth'
import { User } from '../../features/Settings/Users/columns'
import axiosInstance from '../axiosInstance'

const envVars = getEnv()
const BASE_URL = envVars.VITE_BASE_URL

const login = async ({
	username,
	password,
	remember_user,
}: {
	username: string
	password: string
	remember_user: boolean
}) => {
	const { res, status } = await axiosInstance({
		url:'auth/login',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		data: JSON.stringify({ username, password, remember_user }),
	})

	return res
}

export const useLogin = () => {
	const [storedUser, setStoredUser] = useLocalStorage('USER', null)
	const [accessToken, setAccessToken] = useSessionStorage('TOKEN', null)
	const [refreshToken, setRefreshToken] = useSessionStorage(
		'REFRESH_TOKEN',
		null,
	)

	const navigate = useNavigate()
	return useMutation(login, {
		onSuccess: data => {
			console.log({data})
			// toast.success('Login successful')
			setStoredUser(data.data.data.user)
			setAccessToken(data.data.data.accessToken)
			setRefreshToken(data.data.data.refreshToken)
			navigate('/app/home')
		},
		onError: error => {
			// Handle authentication error
			console.error('Authentication error:', error)
		},
	})
}

const signUp = async ({
	name,
	address,
	email,
	phone_number,
	contact_person,
	contact_person_phone_number,
}: {
	name: string
	address: string
	email: string
	phone_number: string
	contact_person: string
	contact_person_phone_number: string
}) => {
	try {
		const response = await axios.post(
			`${BASE_URL}auth/school-signup`,
			{
				name,
				address,
				email,
				phone_number,
				contact_person,
				contact_person_phone_number,
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		// Check if the response status is in the range 200-299
		if (response.status < 200 || response.status >= 300) {
			throw new Error(`Request failed with status ${response.status}`)
		}

		// Access response data
		const data = response.data

		return data
	} catch (error: any) {
		// Handle errors
		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			console.error('Response error:', error.response.data)
		} else if (error.request) {
			// The request was made but no response was received
			console.error('No response received:', error.request)
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error('Error setting up the request:', error.message)
		}

		throw error // Rethrow the error to propagate it up the call stack
	}
}

export const useSignUp = () => {
	return useMutation(signUp)
}

const resetPassword = async ({
	email,
	current_password,
	new_password,
}: {
	email: string
	current_password: string
	new_password: string
}) => {
	const { res, status } = await axiosInstance({
		url: 'auth/change-password',
		method: 'POST',
		data: {
			username: email,
			current_password,
			new_password,
		},
	})

	if (!res) {
		toast.error('Failed to update password')
	}

	return res
}

export const useResetPassword = () => {
	return useMutation(resetPassword, {
		onSuccess: data => {
			// console.log({data})
			toast.success('Password updated successfuly')
		},
		onError: error => {
			// Handle authentication error
			console.error('Authentication error:', error)
		},
	})
}
