export const getUser = async (NAME: string = 'USER') => {
	const userJson = localStorage.getItem(NAME)
	const user = userJson ? JSON.parse(userJson) : {}
	return user
}

export function clearUserSession() {
	localStorage.removeItem('USER')

	sessionStorage.removeItem('TOKEN')
	sessionStorage.removeItem('REFRESH_TOKEN')


	sessionStorage.removeItem('TOKEN_EXPIRY')
}
