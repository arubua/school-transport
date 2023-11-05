import React from 'react'
import SettingsLayout from './layout'
import { Route, Routes } from 'react-router-dom'
import ProfileForm from './profile-form'
import SchoolForm from './school-form'
import Users from './Users/Users'
import { Roles } from './Roles'
import UserForm from './Users/user-form'
import RoleForm from './Roles/role-form'

const Settings = () => {
	return (
		<SettingsLayout>
			<Routes>
				<Route path="profile" element={<ProfileForm />} />
				<Route path="school" element={<SchoolForm />} />
				<Route path="users" element={<Users />} />
				<Route path="users/addUser" element={<UserForm />} />
				<Route path="users/editUser" element={<UserForm />} />
				<Route path="roles" element={<Roles />} />
				<Route path="roles/addRole" element={<RoleForm />} />
				<Route path="roles/editRole" element={<RoleForm />} />
			</Routes>
		</SettingsLayout>
	)
}

export default Settings
