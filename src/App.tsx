import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from './features/Auth/Login'
import { SignUp } from './features/Auth/Signup'

import { init } from './utils/env.server'
import { worker } from './tests/mocks/browser'
import { TheToaster } from './components/toaster'
import Home from './views'
import { z } from 'zod'
import AnalyticsView from './views/Home'
import ParentsView from './views/Parents'
import Auth from './features/Auth/Auth'
import StudentsView from './views/Students'
import DriversView from './views/Drivers'
import AddDriver from './features/Drivers/add-driver'
import BusesView from './views/Buses'
import AddBus from './features/Buses/add-bus'
import ZonesView from './views/Zones'
import AddZone from './features/Zones/add-zone'
import ParentForm from './features/Parents/parent-form'
import StudentForm from './features/Students/student-form'

const AuthSchema = z.object({
	token: z.string().optional(),
})

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

	return (
		<div className="App">
			<BrowserRouter>
				<Routes>
					<Route path="" element={<Home />} />
					<Route path="auth" element={<Auth />}>
						<Route path="" element={<Login />} />
						<Route path="login" element={<Login />} />
						<Route path="signup" element={<SignUp />} />
					</Route>
					<Route path="app" element={<Home />}>
						{/* <Route element={<AuthRoute token={token} />}> */}
						<Route path="" element={<AnalyticsView />} />
						<Route path="home" element={<AnalyticsView />} />
						<Route path="parents" element={<ParentsView />} />
						<Route path="parents/addParent" element={<ParentForm />} />
						<Route path="parents/editParent" element={<ParentForm />} />
						<Route path="students" element={<StudentsView />} />
						<Route path="students/addStudent" element={<StudentForm />} />
						<Route path="students/editStudent" element={<StudentForm />} />
						<Route path="drivers" element={<DriversView />} />
						<Route path="drivers/addDriver" element={<AddDriver />} />
						<Route path="buses" element={<BusesView />} />
						<Route path="buses/addBus" element={<AddBus />} />
						<Route path="zones" element={<ZonesView />} />
						<Route path="buses/addZone" element={<AddZone />} />
						{/* </Route> */}
					</Route>
				</Routes>
			</BrowserRouter>
			<TheToaster />
		</div>
	)
}

export default App
