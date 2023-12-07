type User = {
	id: number
	firstname: string
	lastname: string
	email: number
	phone_number: number
	role_id: string
	password: string
	status: string
	changed_password: string
	school: {
		id: string
		name: string
	}
}

export type UserJson = User | {}



export const getUser = async (NAME: string = 'USER'): Promise<UserJson> => {
	const userJson = localStorage.getItem(NAME)
	const user = userJson ? JSON.parse(userJson) : {}
	return user as UserJson
}

export const getAccessToken = async (NAME: string = 'TOKEN'): Promise<string> => {
	const accessTokenJson = sessionStorage.getItem(NAME)
	const accessToken = accessTokenJson ? JSON.parse(accessTokenJson) : ''
	return accessToken as string
}

export const getRefreshToken = async (NAME: string = 'TOKEN'): Promise<string> => {
	const refreshTokenJson = sessionStorage.getItem(NAME)
	const refreshToken = refreshTokenJson ? JSON.parse(refreshTokenJson) : ''
	return refreshToken as string
}

export function clearUserSession() {
	localStorage.removeItem('USER')

	sessionStorage.removeItem('TOKEN')
	sessionStorage.removeItem('REFRESH_TOKEN')

	sessionStorage.removeItem('TOKEN_EXPIRY')
}
