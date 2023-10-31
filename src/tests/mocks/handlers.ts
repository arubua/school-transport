// src/mocks.ts
import { rest, RequestHandler } from 'msw'
import { redirect } from 'react-router-dom'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

const loginRequestBodySchema = z.object({
	username: z.string(),
	password: z.string(),
	remember_user: z.boolean(),
})

type LoginRequestBody = z.infer<typeof loginRequestBodySchema>

const getStudentsSchema = z.array(
	z.object({
		id: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		class: z.string(),
		stop: z.string(),
		parent_name: z.string(),
		parent_phone: z.number(),
		image: z.string(),
	}),
)

type getStudentsResponse = z.infer<typeof getStudentsSchema>

const getParentsSchema = z.array(
	z.object({
		id: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		email: z.string(),
		phone: z.number(),
		image: z.string(),
		students: z.string().array().optional(),
	}),
)

type getParentsResponse = z.infer<typeof getParentsSchema>

const getDriversSchema = z.array(
	z.object({
		id: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		phone_number: z.number(),
		bus: z.string(),
		image: z.string(),
	}),
)

type getDriversResponse = z.infer<typeof getDriversSchema>

const getBusesSchema = z.array(
	z.object({
		id: z.string(),
		reg_number: z.string(),
		capacity: z.number(),
		school: z.string(),
		image: z.string(),
	}),
)

type getBusesResponse = z.infer<typeof getBusesSchema>

const getStopsSchema = z.array(
	z.object({
		id: z.string(),
		latitude: z.string(),
		longitude: z.string(),
		description: z.string(),
		zone_id: z.string(),
	}),
)

type getStopsResponse = z.infer<typeof getStopsSchema>

const getRoutesSchema = z.array(
	z.object({
		id: z.string(),
		stops: z.string().array().optional(),
		zone_id: z.string(),
		name: z.string(),
	}),
)

type getRoutesResponse = z.infer<typeof getRoutesSchema>

const getSchedulesSchema = z.array(
	z.object({
		id: z.string(),
		route_id: z.string(),
		driver_id: z.string(),
		bus_id: z.string(),
		start_time: z.string(),
		students: z.array(z.string()).optional(),
	}),
)

type getSchedulesResponse = z.infer<typeof getSchedulesSchema>

const getZonesSchema = z.array(
	z.object({
		id: z.string(),
		reg_number: z.string(),
		capacity: z.number(),
		school: z.string(),
		image: z.string(),
	}),
)

type getZonesResponse = z.infer<typeof getZonesSchema>

export const handlers: Array<RequestHandler> = [
	rest.post<LoginRequestBody>('/api/login', async (req, res, ctx) => {
		const requestBody = await req.text()

		const data = JSON.parse(requestBody)

		// Replace this with your validation logic.
		if (data.username === 'testuser' && data.password === 'testpassword') {
			return res(
				ctx.delay(0),
				ctx.status(200),
				ctx.json({
					username: data.username,
					email: faker.internet.email({ firstName: 'test', lastName: 'user' }),
					token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.NpDP1uN-yGDGJwlE6i_aWpIIKgVf2mf9Rm_1LaZ-xtI`,
				}), // Customize the response data
			)
		}

		return res(
			ctx.delay(0),
			ctx.status(401),
			ctx.json({ error: 'Invalid credentials' }), // Customize error response
		)
	}),
	rest.get<getParentsResponse>('/api/parents', async (req, res, ctx) => {
		const numberOfParents = 15
		const numberOfStudents = 3

		// Generate an array of parent objects using Faker and the schema
		const parents = Array.from({ length: numberOfParents }, () => ({
			id: faker.string.uuid(),
			firstName: faker.person.firstName('male'),
			lastName: faker.person.lastName('male'),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			address: faker.location.streetAddress(),
			avatarImage: faker.image.avatar(),
			students: Array.from({ length: numberOfStudents }, () => ({
				id: faker.string.uuid(),
				image: faker.image.avatar(),
				name: faker.person.fullName(),
			})),
		}))

		return res(
			ctx.delay(0),
			ctx.status(200),
			ctx.json(parents), // Respond with the generated parent objects
		)
	}),
	rest.get<getStudentsResponse>('/api/students', async (req, res, ctx) => {
		const numberofStudents = 15

		const students = Array.from({ length: numberofStudents }, () => ({
			id: faker.string.uuid(),
			firstName: faker.person.firstName('male'),
			lastName: faker.person.lastName('male'),
			grade: faker.number.int({ min: 1, max: 7 }),
			stop: faker.location.streetAddress(),
			school: faker.company.name(),
			parent: faker.person.fullName(),
			parentId: faker.string.uuid(),
			parent_phone: faker.phone.number(),
			avatarImage: faker.image.avatar(),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(students))
	}),
	rest.get<getDriversResponse>('/api/drivers', async (req, res, ctx) => {
		const numberofDrivers = 15

		const drivers = Array.from({ length: numberofDrivers }, () => ({
			id: faker.string.uuid(),
			firstName: faker.person.firstName('male'),
			lastName: faker.person.lastName('male'),
			phone_number: faker.phone.number(),
			bus: faker.vehicle.vrm(),
			image: faker.image.avatar(),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(drivers))
	}),
	rest.get<getBusesResponse>('/api/buses', async (req, res, ctx) => {
		const numberofBuses = 15

		const buses = Array.from({ length: numberofBuses }, () => ({
			id: faker.string.uuid(),
			reg_number: faker.vehicle.vrm(),
			driver: faker.person.fullName(),
			capacity: faker.number.int({ min: 1, max: 33 }),
			school: faker.company.name(),
			image: faker.image.dataUri(),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(buses))
	}),
	rest.get<getStopsResponse>('/api/stops', async (req, res, ctx) => {
		const numberofStops = 15

		const stops = Array.from({ length: numberofStops }, () => ({
			id: faker.string.uuid(),
			latitude: faker.location.latitude(),
			longitude: faker.location.longitude(),
			description: faker.location.streetAddress(true),
			zone_id: faker.string.uuid(),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(stops))
	}),
	rest.get<getRoutesResponse>('/api/routes', async (req, res, ctx) => {
		const numberofRoutes = 5
		const numberofStops = 5

		const routes = Array.from({ length: numberofRoutes }, () => ({
			id: faker.string.uuid(),
			name: faker.word.words(3),
			zone_id: faker.string.uuid(),
			stops: Array.from({ length: numberofStops }, () => ({
				id: faker.string.uuid(),
				latitude: faker.location.latitude(),
				longitude: faker.location.longitude(),
				description: faker.location.streetAddress(true),
				zone_id: faker.string.uuid(),
			})),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(routes))
	}),
	rest.get<getSchedulesResponse>('/api/schedules', async (req, res, ctx) => {
		const numberofSchedules = 5
		const numberofStudents = 5

		const schedules = Array.from({ length: numberofSchedules }, () => ({
			id: faker.string.uuid(),
			route_id: faker.string.uuid(),
			driver_id: faker.string.uuid(),
			bus_id: faker.string.uuid(),
			start_time: faker.date.soon({ days: 0.2 }),
			students: Array.from({ length: numberofStudents }, () => ({
				id: faker.string.uuid(),
				firstName: faker.person.firstName('male'),
				lastName: faker.person.lastName('male'),
				grade: faker.number.int({ min: 1, max: 7 }),
				stop: faker.location.streetAddress(),
				school: faker.company.name(),
				parent: faker.person.fullName(),
				parentId: faker.string.uuid(),
				parent_phone: faker.phone.number(),
				avatarImage: faker.image.avatar(),
			})),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(schedules))
	}),
	rest.get<getZonesResponse>('/api/zones', async (req, res, ctx) => {
		const numberOfZones = 5
		const zones = []

		for (let i = 0; i < numberOfZones; i++) {
			const zoneName = `Zone ${String.fromCharCode(65 + i)}` // Convert ASCII value to letter (A, B, C, ...)
			zones.push({
				id: faker.string.uuid(),
				name: zoneName,
			})
		}

		return res(ctx.delay(0), ctx.status(200), ctx.json(zones))
	}),
	rest.delete('/api/parents/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(0),
			ctx.status(200),
			ctx.json('Deleted parent successfuly'),
		)
	}),
	rest.delete('/api/students/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted student successfuly'),
		)
	}),
	rest.delete('/api/drivers/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted driver successfuly'),
		)
	}),
	rest.delete('/api/buses/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted bus successfuly'),
		)
	}),
	rest.delete('/api/stops/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted stop successfuly'),
		)
	}),
	rest.delete('/api/routes/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted route successfuly'),
		)
	}),
	rest.delete('/api/schedules/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted schedule successfuly'),
		)
	}),
	rest.delete('/api/zones/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted zone successfuly'),
		)
	}),
]
