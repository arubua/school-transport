import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { z } from 'zod'

const TokenSchema = z.string().optional()

type TokenSchemaType = z.infer<typeof TokenSchema>

interface AuthRouteProps {
	children?: React.ReactNode
	token: TokenSchemaType
}

function AuthRoute({ token, children }: AuthRouteProps) {
	const isUserLoggedIn = !!token

	if (!isUserLoggedIn) {
		// Redirect to the login page if the user is not logged in
		return <Navigate to="/auth/login" />
	}

	// Render the protected route if the user is logged in
	return children ? children : <Outlet />
}

export default AuthRoute
