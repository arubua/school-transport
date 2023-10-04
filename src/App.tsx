import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/Home'
import { Login } from './features/Auth/Login'
import { SignUp } from './features/Auth/Signup'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { init } from './utils/env.server'
import { worker } from './tests/mocks/browser'
import { TheToaster } from './components/toaster'

//initializing environment variables
init()

const queryClient = new QueryClient()

function App() {
	useEffect(() => {
		// Start MSW worker
		if (
			import.meta.env.MODE === 'development' ||
			import.meta.env.MODE === 'test'
		) {
			worker.start()
		}

		// Clean up the worker when the component unmounts
		return () => {
			worker.stop()
		}
	}, [])

	return (
		<div className="App">
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route path="" element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<SignUp />} />
					</Routes>
				</BrowserRouter>
				<ReactQueryDevtools initialIsOpen={false} />
				<TheToaster/>
			</QueryClientProvider>
		</div>
	)
}

export default App
