import { useQuery, useMutation } from '@tanstack/react-query'

const getSchedules = async () => {
	const response = await fetch('/api/schedules')
	if (!response.ok) {
		throw new Error('Failed to fetch schedules data')
	}
	const data = await response.json()
	return data
}

export const useSchedules = () => {
	return useQuery(['schedules'], getSchedules)
}

const getScheduleById = async (scheduleId: string) => {
	const response = await fetch(`/api/schedules/${scheduleId}`)
	if (!response.ok) {
		throw new Error('Failed to fetch schedule data')
	}
	const data = await response.json()
	return data
}

export const useScheduleById = (scheduleId: string) => {
	return useQuery(['schedule', scheduleId], () => getScheduleById(scheduleId))
}

const addSchedule = async ({
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
	const response = await fetch('/api/schedule', {
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

export const useAddSchedule = () => {
	return useMutation(addSchedule)
}

const updateScheduleById = async ({
	scheduleId,
	updatedData,
}: {
	scheduleId: string
	updatedData: object
}) => {
	const response = await fetch(`/api/schedules/${scheduleId}`, {
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

export const useUpdateSchedule = () => {
	return useMutation(updateScheduleById)
}



const deleteSchedule = async (id: string) => {
	const response = await fetch(`/api/schedules/${id}`, {
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

export const useDeleteSchedule = () => {
	return useMutation(deleteSchedule)
}
