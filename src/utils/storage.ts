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

type UserJson = User | {}

export const getUser = async (NAME: string = 'USER'): Promise<UserJson> => {
	const userJson = localStorage.getItem(NAME)
	const user = userJson ? JSON.parse(userJson) : {}
	return user as UserJson
}

export function clearUserSession() {
	localStorage.removeItem('USER')

	sessionStorage.removeItem('TOKEN')
	sessionStorage.removeItem('REFRESH_TOKEN')

	sessionStorage.removeItem('TOKEN_EXPIRY')
}
