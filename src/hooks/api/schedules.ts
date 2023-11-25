import { useQuery, useMutation } from '@tanstack/react-query'
import axiosInstance from '../axiosInstance'

const getSchedules = async () => {
	const { res, status } = await axiosInstance({
		url: 'schedules',
	})
	if (!res) {
		return []
	}

	return res.data.data
}

export const useSchedules = () => {
	return useQuery(['schedules'], getSchedules)
}

const getScheduleById = async (scheduleId: string) => {
	const { res, status } = await axiosInstance({
		url: `schedule/${scheduleId}`,
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useScheduleById = (scheduleId: string) => {
	return useQuery(['schedule', scheduleId], () => getScheduleById(scheduleId))
}

const addSchedule = async ({
	start_time,
	route_id,
	driver_id,
	bus_id,
	student_ids,
}: {
	start_time: string
	route_id: string
	driver_id: string
	bus_id: string
	student_ids: Array<Object>
}) => {
	const { res } = await axiosInstance({
		url: 'schedules',
		method: 'POST',

		data: {
			start_time:`${start_time}:00`,
			route_id,
			driver_id,
			bus_id,
			// student_ids,
		},
	})
	if (!res) {
		return null
	}

	return res
}

export const useAddSchedule = () => {
	return useMutation(addSchedule)
}

const updateScheduleById = async ({
	scheduleId,
	updatedData,
}: {
	scheduleId: string
	updatedData: {
		start_time: string,
	route_id: string,
	driver_id: string,
	bus_id: string,
	student_ids?:Array<string>
	}
}) => {
	if (updatedData.hasOwnProperty('student_ids')) {
        delete updatedData['student_ids'];
    }

	const { res, status } = await axiosInstance({
		url: `schedules/${scheduleId}`,
		method: 'PUT',

		data: { ...updatedData },
	})
	if (!res) {
		return null
	}

	return res.data.data
}

export const useUpdateSchedule = () => {
	return useMutation(updateScheduleById)
}

const deleteSchedule = async (id: string) => {
	const { res } = await axiosInstance({
		url: `schedules/${id}`,
		method: 'DELETE',
	})
	if (!res) {
		return null
	}

	return res
}

export const useDeleteSchedule = () => {
	return useMutation(deleteSchedule)
}
