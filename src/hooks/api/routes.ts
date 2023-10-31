import { useQuery, useMutation } from '@tanstack/react-query'

const getRoutes = async () => {
	const response = await fetch('/api/routes')
	if (!response.ok) {
		throw new Error('Failed to fetch routes data')
	}
	const data = await response.json()
	return data
}

export const useRoutes = () => {
	return useQuery(['routes'], getRoutes)
}

const getRouteById = async (routeId: string) => {
	const response = await fetch(`/api/routes/${routeId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch route data')
	}
	const data = await response.json()
	return data
}

export const useRouteById = (routeId: string) => {
	return useQuery(['route', routeId], () => getRouteById(routeId))
}

const addRoute = async ({
	firstName,
	lastName,
	email,
	phone,
	address,
	avatarImage,
}: {
	firstName: string
	lastName: string
	email: string
	phone: string
	address: string
	avatarImage: File[] | undefined
}) => {
	const response = await fetch('/api/route', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName,
			lastName,
			email,
			phone,
			address,
			avatarImage,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddRoute = () => {
	return useMutation(addRoute)
}

const updateRouteById = async ({
	routeId,
	updatedData,
}: {
	routeId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/routes/${routeId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updatedData),
	})

	if (!response.ok) {
		const data = await response.json()
		throw new Error(data.error)
	}

	const data = await response.json()
	return data
}

export const useUpdateRoute = () => {
	return useMutation(updateRouteById)
}



const deleteRoute = async (id: string) => {
	const response = await fetch(`/api/routes/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		const data = await response.json()
		throw new Error(data.error)
	}

	return {}
}

export const useDeleteRoute = () => {
	return useMutation(deleteRoute)
}
