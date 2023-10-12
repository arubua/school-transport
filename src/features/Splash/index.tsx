import React from 'react'
import { Button } from '../../components/ui/button'
import { Link } from 'react-router-dom'
import Logo from '../../components/ui/logo'

const Splash = () => {
	return (
		<div className="">
			<header className="App-header">
				{/* <div className="absolute right-1 top-1 m-4 flex flex-row-reverse">
					<Button asChild>
						<Link to={'/login'}>Login</Link>
					</Button>
				</div> */}
				<Logo
					src="/other/svg-icons/safiri-logo.svg"
					alt="Logo Alt Text"
					className="logo-class h-20 w-28"
				/>
			</header>
		</div>
	)
}

export default Splash
