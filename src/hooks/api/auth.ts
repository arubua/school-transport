import { UseMutateFunction, useMutation } from '@tanstack/react-query'
import { getEnv } from '../../utils/env.server'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useLocalStorage, useSessionStorage } from '../hooks'
import { getSessionExpirationDate } from '../../utils/auth'
import { User } from '../../features/Settings/Users/columns'

const envVars = getEnv()
const BASE_URL = envVars.VITE_BASE_URL

// const login = async ({
// 	username,
// 	password,
// 	remember_user,
//   }: {
// 	username: string;
// 	password: string;
// 	remember_user: boolean;
//   }) => {
// 	const response = await fetch(`${BASE_URL}auth/login`, {
// 	  method: 'POST',
// 	  headers: {
// 		'Content-Type': 'application/json',
// 	  },
// 	  body: JSON.stringify({ username, password, remember_user }),
// 	});

// 	return response.json();
//   };

// export const useLogin = () => {
// 	const [storedUser, setStoredUser] = useLocalStorage('USER', null)
// 	const [accessToken, setAccessToken] = useSessionStorage('TOKEN', null)
// 	const [refreshToken, setRefreshToken] = useSessionStorage('REFRESH_TOKEN', null)

// 	const navigate = useNavigate()
// 	return useMutation(
// 	login,
// 	{
// 		onSuccess: (data) => {
// 			toast.success('Login successful')
// 			setStoredUser(data.user)
// 			setAccessToken(data.accessToken)
// 			setRefreshToken(data.refreshToken)
// 			navigate('/app/home')
// 		},
// 		onError: (error) => {
// 		  // Handle authentication error
// 		  console.error('Authentication error:', error);
// 		},
// 	  }
// 	)
// }

async function signIn(email: string, password: string): Promise<User> {
	const response = await fetch('/api/auth/signin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	// if (!response.ok) {
	// 	throw new ResponseError('Failed on sign in request', response)
	// }

	return await response.json()
}


export function useLogin(): IUseSignIn {
	// const queryClient = useQueryClient();
	const navigate = useNavigate()
	// const { enqueueSnackbar } = useSnackbar();

	const { mutate: signInMutation } = useMutation<
		User,
		unknown,
		{ username: string; password: string },
		unknown
	>(({ username, password }) => signIn(username, password), {
		onSuccess: data => {
			// TODO: save the user in the state
			navigate('/app/home')
		},
		onError: error => {
			toast.error('Ops.. Error on sign in. Try again!')
		},
	})

	return signInMutation
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
	try {
		const response = await axios.post(
			`${BASE_URL}auth/school-signup`,
			{
				name,
				address,
				email,
				phone_number,
				contact_person,
				contact_person_phone,
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
