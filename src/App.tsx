import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/Home'
import { Login } from './features/Auth/Login'
import { SignUp } from './features/Auth/Signup'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<QueryClientProvider client={queryClient}>
					<Routes>
						<Route path="" element={<Home />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<SignUp />} />
					</Routes>
				</QueryClientProvider>
			</BrowserRouter>
		</div>
	)
}

export default App
