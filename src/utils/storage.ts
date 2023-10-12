export const getUser = async (NAME: string = 'USER') => {
	const userJson = localStorage.getItem(NAME)
	const user = userJson ? JSON.parse(userJson) : {}
	return user
}
