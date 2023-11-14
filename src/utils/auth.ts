import { useSessionStorage } from '../hooks/hooks'

export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () => {
	const [tokenExpiry, setTokenExpiry] = useSessionStorage(
		'TOKEN_EXPIRY',
		new Date(),
	)
	const token = sessionStorage.getItem('TOKEN')

	if (token) {
		const expirationTime =
			Number(JSON.parse(atob(token.split('.')[1])).exp) * 1000
		setTokenExpiry(new Date(expirationTime))
		return new Date(expirationTime)
	} else {
		// If token is not available or does not contain the 'exp' field
		// Use a default expiration time or handle it as per your requirement
		return new Date(Date.now() + SESSION_EXPIRATION_TIME)
	}
}

export const isUserTimedOut = () => {
	const timeoutStr = sessionStorage.getItem('TOKEN_EXPIRY')
	if (!timeoutStr) {
		return true
	}

	const timeout = new Date(timeoutStr)
	const currentTime = new Date()

	return currentTime >= timeout
}
