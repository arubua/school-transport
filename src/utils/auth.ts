export const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 30
export const getSessionExpirationDate = () =>
	new Date(Date.now() + SESSION_EXPIRATION_TIME)

export const isUserTimedOut = () => {
	const timeoutStr = sessionStorage.getItem('TOKEN_EXPIRY')
	if (!timeoutStr) {
		return true
	}

	const timeout = new Date(timeoutStr)
	const currentTime = new Date()

	return currentTime >= timeout
}
