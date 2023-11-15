import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getEnv } from '../utils/env.server'
import { toast } from 'sonner'

const envVars = getEnv()
const BASE_URL = envVars.VITE_BASE_URL

const axiosWithBearer = (token: string | null) => {
	const instance = axios.create({
		baseURL: BASE_URL,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	})

	return instance
}

const tokenString = sessionStorage.getItem('TOKEN')
const accessToken = tokenString ? JSON.parse(tokenString) : null

const api = axiosWithBearer(accessToken)

console.log({ accessToken })

const axiosInstance = async <T>(
	config: AxiosRequestConfig,
): Promise<{ res: AxiosResponse<T>; status: number }> => {
	try {
		const res = await api(config)
		return { res, status: res.status }
	} catch (error: any) {
		if (error.response) {
			toast.error(error.response.data.message)
			throw new Error(error.response.data.message)
		} else if (error.request) {
			toast.error('Check your Network and try again')

			throw new Error('Network error')
		} else {
			toast.error('An error occurred')

			throw new Error('An error occurred')
		}
	}
}

export default axiosInstance
