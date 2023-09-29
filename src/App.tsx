import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/Home'
import Login from './features/Login'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="" element={<Home />} />
					<Route path="login" element={<Login/>} />
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
