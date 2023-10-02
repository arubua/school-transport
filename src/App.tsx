import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/Home'
import { Login } from './features/Auth/Login'
import { SignUp } from './features/Auth/Signup'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="" element={<Home />} />
					<Route path="login" element={<Login/>} />
					<Route path="signup" element={<SignUp/>} />

				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
