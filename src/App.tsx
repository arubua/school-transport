import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './features/Splash'
import { Login } from './features/Auth/Login'
import { SignUp } from './features/Auth/Signup'

import { init } from './utils/env.server'
import { worker } from './tests/mocks/browser'
import { TheToaster } from './components/toaster'
import Home from './views'
import { z } from 'zod'
import AuthRoute from './features/Auth/AuthRoute'
import AnalyticsView from './views/Home'
import ParentsView from './views/Parents'

const AuthSchema = z.object({
	token: z.string().optional(),
})

//initializing environment variables
init()

function App() {
	useEffect(() => {
		// Start MSW worker
		if (
			import.meta.env.MODE === 'development' ||
			import.meta.env.MODE === 'test'
		) {
			worker.start()
		}

		// Cleaning up the worker when the component unmounts
		return () => {
			worker.stop()
		}
	}, [])

	const token = sessionStorage.getItem('TOKEN') || ''

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="" element={<Login />} />
					<Route path="auth" element={<Login />}>
						<Route path="" element={<Login />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<SignUp />} />
					</Route>
					<Route path="app" element={<Home />}>
						<Route element={<AuthRoute token={token} />}>
							<Route path="home" element={<AnalyticsView />} />
							<Route path="parents" element={<ParentsView />} />
							{/* <Route path="dashboard" element={<AnalyticsPage />} /> */}
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
			<TheToaster />
		</div>
	)
}

export default App
