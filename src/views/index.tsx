import { Outlet, useLocation } from 'react-router-dom'
import Layout from '../features/Layout'
import { menus } from '../utils/constants'
import { useEffect, useState } from 'react'
import Splash from '../features/Splash'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { getUser } from '../utils/storage'
import { EmailSchema, NameSchema } from '../utils/user-validation'
import { getSessionExpirationDate, isUserTimedOut } from '../utils/auth'
import AuthRoute from '../features/Auth/AuthRoute'

// Define a Zod schema for user data
const UserSchema = z.object({
	username: NameSchema,
	token: z.string(),
	email: EmailSchema,
})

type User = z.infer<typeof UserSchema>

const Home: React.FC = () => {
	const [loading, setLoading] = useState(false)
	const [user, setUser] = useState<any>({})

	const token = sessionStorage.getItem('TOKEN') || ''

	const location = useLocation()
	const navigate = useNavigate()

	useEffect(() => {
		init()
	}, [])

	async function init() {
		setLoading(true)
		try {
			const userData = UserSchema.parse(await getUser())

			if (!userData.email || !userData.token || !userData.username) {
				setLoading(false)

				navigate('/auth/login')
				return
			}

			const isTimedOut = await isUserTimedOut()

			if (isTimedOut) {
				setLoading(false)

				navigate('/auth/login')
				return
			}

			setUser(userData)
			setLoading(false)
		} catch (error) {
			console.error('Error:', error)

			setLoading(false)

			navigate('/auth/login')
		}
	}

	if (loading) {
		return <Splash />
	}

	return (
		// <AuthRoute token={token}>
		<Layout user={user} location={location} menus={menus}>
			<Outlet />
		</Layout>
		// </AuthRoute>
	)
}

export default Home
