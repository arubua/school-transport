import React from 'react'
import { Counter } from '../counter/Counter'
import { Button } from '../../components/ui/button'
import logo from '../../logo.svg'
import { Link } from 'react-router-dom'

const Home = () => {
	return (
		<div className=" border border-red-500">
			<header className="App-header">
				<div className="m-4 flex flex-row-reverse">
					<Button asChild>
						<Link to={'/login'}>Login</Link>
					</Button>
				</div>
				<img src={logo} className="App-logo" alt="logo" />
				<Counter />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<span>
					<span>Learn </span>
					<a
						className="App-link"
						href="https://reactjs.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						React
					</a>
					<span>, </span>
					<a
						className="App-link"
						href="https://redux.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Redux
					</a>
					<span>, </span>
					<a
						className="App-link"
						href="https://redux-toolkit.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						Redux Toolkit
					</a>
					,<span> and </span>
					<a
						className="App-link"
						href="https://react-redux.js.org/"
						target="_blank"
						rel="noopener noreferrer"
					>
						React Redux
					</a>
				</span>
			</header>
		</div>
	)
}

export default Home
