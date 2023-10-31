import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../../components/ui/logo'
import { Icon, IconName } from '../../components/ui/icon'
import { z } from 'zod'
interface MenuItem {
	title: string
	route: string
	icon?: IconName
	menus?: MenuItem[]
}

interface SidebarProps {
	pathname: string
	toggleSidebar: () => void
	isSidebarVisible: boolean
	hideSidebarOnMobile: () => void
	app?: string
	menus: MenuItem[]
}

const Sidebar: React.FC<SidebarProps> = ({
	pathname,
	toggleSidebar,
	isSidebarVisible,
	hideSidebarOnMobile,
	menus,
}) => {
	const isMenuActive = (route: string) => {
		if (pathname === route) {
			return true
		} else {
			return false
		}
	}

	return (
		<div
			id="sidebar"
			className={`${
				isSidebarVisible ? '' : 'hidden'
			} relative h-screen min-w-max w-52 flex-col border `}
		>
			<div className="absolute right-0 top-0 mt-4" onClick={toggleSidebar}>
				<Icon name="hamburger" className="cursor-pointer" />
			</div>
			<div className="p-4">
				<>
					<div className="flex">
						<Logo
							src="/other/svg-icons/safiri-logo.svg"
							alt="Safiri logo"
							className=" h-20 w-28"
						/>
					</div>
					{/* <span className="text-xl font-semibold">{app}</span> */}
				</>
			</div>
			<div className="flex-1 overflow-y-auto p-4 ">
				{menus.map((menu, index) => {
					return (
						<NavLink
							key={index}
							to={menu.route}
							className={({ isActive }) =>
								` ${
									isActive ? 'text-[#FF7B02]' : 'text-slate-800'
								} mb-4 flex items-center text-base font-medium hover:text-primary`
							}
						>
							{menu.icon && <Icon className="mr-3" name={`${menu.icon}`} />}
							{menu.title && menu.title !== '' && <h1>{menu.title}</h1>}
							{menu.menus &&
								menu.menus.map((item, i) => (
									<Link
										key={i}
										to={item.route}
										title={item.title}
										className={`${
											isMenuActive(item.route) ? 'text-blue-500' : ''
										} flex items-center rounded p-2 text-white hover:bg-blue-400`}
										onClick={hideSidebarOnMobile}
									>
										{/* <span className="mr-2">
											<Icon name={`${item.icon}`} />
										</span> */}
										<span>{item.title}</span>
									</Link>
								))}
						</NavLink>
					)
				})}
			</div>
			<div className="p-4 absolute bottom-2 ">
				<ul>
					<li>
						<Link
							to="#"
							title="Logout"
							className="text-danger"
							style={{ opacity: 1 }}
						>
							<div className="flex font-medium hover:text-primary">
								<Icon className="mr-1" size="md" name="arrow-right-rec" />
								<h1>Logout</h1>
							</div>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Sidebar
