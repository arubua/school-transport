'use strict'
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App'
import './index.css'
import axios from 'axios'
import { getEnv } from './utils/env.server'
import { clearUserSession } from './utils/storage'

const queryClient = new QueryClient()

// const envVars = getEnv()

// const BASE_URL = envVars.VITE_BASE_URL

// const queryClient = new QueryClient({
// 	defaultOptions: {
// 		queries: {
// 			queryFn: async ({ queryKey: [url] }) => {
// 				// ✅ narrow the type of url to string
// 				// so that we can work with it
// 				if (typeof url === 'string') {
// 					const { data } = await axios.get(`${BASE_URL}/${url.toLowerCase()}`)
// 					return data
// 				}
// 				throw new Error('Invalid QueryKey')
// 			},
// 		},
// 	},
// })



ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<App />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	</React.StrictMode>,
)
