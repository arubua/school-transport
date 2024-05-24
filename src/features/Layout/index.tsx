import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar'
import { getUser } from '../../utils/storage'
import { isUserTimedOut } from '../../utils/auth'
import { EmailSchema, NameSchema } from '../../utils/user-validation'
import { z } from 'zod'
import { Avatar } from '@radix-ui/react-avatar'
// import { clearStorage, getStorage } from "../../utils/storage";
// import appTitle from "../../utils/appTitle";
// import userLoggedInTimeout from "../../utils/userLoggedInTimeout";
// import { AUTH_END_POINT, NTSATEST_END_POINT } from "../../constants/strings";
// import axios from "axios";

const UserSchema = z.object({
	username: NameSchema,
	token: z.string(),
	email: EmailSchema,
	avatar:z.string()
})

type User = z.infer<typeof UserSchema>

interface LayoutProps {
	location: any
	menus: any[]
	user: User
	children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = props => {
	const [title, setTitle] = useState<string>('')
	const [isSidebarFullVisible, setSideBarVisibility] = useState<boolean>(true)
	const [alerts, setAlerts] = useState<any[]>([])
	const [isLoadingViolationNotification, setIsLoading] = useState<boolean>(true)

	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname

	useEffect(() => {
		getAppTitle()
		// setUserLoggedIn()
	}, [location])

	const getAppTitle = () => {
		const pathSegments = pathname.split('/')
		const lastPathSegment = pathSegments[pathSegments.length - 1]

		let title =
			lastPathSegment.charAt(0).toUpperCase() + lastPathSegment.slice(1)
		setTitle(title)

		return title
	}

	// const setUserLoggedIn = async () => {
	//   let user = await getUser();
	//   if (!user.token && !user.username) return navigate("/login");
	//   const isSessionExpired = isUserTimedOut()
	//   if (isSessionExpired) {
	//     return navigate("/auth/signin");
	//   }
	//   setUser(user);
	// };

	// function onToggle() {
	// 	const sidebar = document.getElementById('sidebar')

	// 	if (sidebar?.classList.contains('hidden')) {
	// 		sidebar.classList.remove('hidden')
	// 	} else {
	// 		sidebar?.classList.add('hidden')
	// 	}
	// }

	const [isSidebarVisible, setSidebarVisible] = useState(true)

	const toggleSidebar = () => {
		setSidebarVisible(!isSidebarVisible)
	}

	function hideSidebarOnMobile() {
		const screenWidth = window.screen.availWidth
		const sidebar_class = document.getElementById('sidebar')!.classList
		if (screenWidth < 600 && sidebar_class.contains('show')) {
			sidebar_class.remove('show')
			sidebar_class.add('hide')
			return
		}
	}

	//   const onSignMeOut = async () => {
	//     await clearStorage();
	//     navigate("/auth/signin");
	//   };

	return (
		<div>
			<div className="flex">
				<Sidebar
					toggleSidebar={toggleSidebar}
					isSidebarVisible={isSidebarVisible}
					menus={props.menus || []}
					pathname={location.pathname}
					hideSidebarOnMobile={hideSidebarOnMobile}
				/>
				<div className="w-full">
					<Navbar
						user={props.user || {}}
						toggleSidebar={toggleSidebar}
						isSidebarVisible={isSidebarVisible}
						title={title}
						// notifications={alerts}
						// isLoadingViolationNotification={isLoadingViolationNotification}
					/>
					<div id="app-main-content" className="app-main-content">
						<div
							style={{
								paddingLeft: '1rem',
								paddingRight: '1rem',
							}}
						>
							{props.children}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Layout
