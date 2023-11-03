import { useQuery, useMutation } from '@tanstack/react-query'

const getZones = async () => {
	const response = await fetch('/api/zones')
	if (!response.ok) {
		throw new Error('Failed to fetch zones data')
	}
	const data = await response.json()
	return data
}

export const useZones = () => {
	return useQuery(['zones'], getZones)
}

const AddZone = async ({ name }: { name: string }) => {
	const response = await fetch('/api/zone', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
		}),
	})

	if (!response.ok) {
		const data = await response.json()

		throw new Error(data.error)
	}

	const data = await response.json()

	return data
}

export const useAddZone = () => {
	return useMutation(AddZone)
}

const updateZoneById = async ({
	zoneId,
	updatedData,
}: {
	zoneId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/zones/${zoneId}`, {
		method: 'PATCH',
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

export const useUpdateZone = () => {
	return useMutation(updateZoneById)
}

const deleteZone = async (id: string) => {
	const response = await fetch(`/api/zones/${id}`, {
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

export const useDeleteZone = () => {
	return useMutation(deleteZone)
}
