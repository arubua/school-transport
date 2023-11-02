import React from 'react'
import SettingsLayout from './layout'
import { Route, Routes } from 'react-router-dom'
import ProfileForm from './profile-form'
import SchoolForm from './school-form'
import Users from './Users/Users'
import { Roles } from './Roles'

const Settings = () => {
	return (
		<SettingsLayout>
			<Routes>
				<Route path="profile" element={<ProfileForm />} />
				<Route path="school" element={<SchoolForm />} />
				<Route path="users" element={<Users />} />
				<Route path="roles" element={<Roles />} />
			</Routes>
		</SettingsLayout>
	)
}

export default Settings
