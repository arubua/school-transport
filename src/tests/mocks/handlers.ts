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

const signUpRequestBodySchema = z.object({
	name: z.string(),
	address: z.string(),
	phone_number: z.string(),
	email: z.string(),
	contact_person: z.string(),
	contact_person_phone: z.string(),
})

type SignUpRequestBody = z.infer<typeof signUpRequestBodySchema>

const postRouteRequestBodySchema = z.object({
	name: z.string(),
	zone_id: z.string(),
	stops: z.array(z.record(z.string().trim())),
})

type routeRequestBody = z.infer<typeof postRouteRequestBodySchema>

const getStudentsSchema = z.array(
	z.object({
		id: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		class: z.string(),
		stop: z.object({
			id: z.string(),
			description: z.string(),
			latitude: z.string(),
			longitude: z.string(),
		}),
		parent: z.object({
			id: z.string(),
			firstname: z.string(),
			lastname: z.string(),
		}),
		// parent_phone: z.number(),
		school: z.object({
			id: z.string(),
			name: z.string(),
		}),
	}),
)

type getStudentsResponse = z.infer<typeof getStudentsSchema>

const getParentsSchema = z.array(
	z.object({
		id: z.string(),
		firstname: z.string(),
		lastname: z.string(),
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
		firstname: z.string(),
		lastname: z.string(),
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

const getRolesSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
	}),
)

type getRolesResponse = z.infer<typeof getRolesSchema>

const getUsersSchema = z.array(
	z.object({
		id: z.string(),
		firstname: z.string(),
		lastname: z.string(),
		phone_number: z.string(),
		email: z.string(),
		role_id: z.string(),
		school_id: z.string(),
	}),
)

type getUsersResponse = z.infer<typeof getUsersSchema>

const getSchoolByIdSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		address: z.string(),
		phone_number: z.string(),
		email: z.string(),
		contact_person: z.string(),
	}),
)

type getSchoolByIdResponse = z.infer<typeof getSchoolByIdSchema>

const updateZoneById = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
	}),
)

type updateZoneByIdResponse = z.infer<typeof updateZoneById>

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
					firstname: faker.person.firstName(),
					lastname: faker.person.lastName(),
					email: faker.internet.email({ firstName: 'test', lastName: 'user' }),
					phone_number: faker.phone.number(),
					role: 'School Admin',
					token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.NpDP1uN-yGDGJwlE6i_aWpIIKgVf2mf9Rm_1LaZ-xtI`,
					image: faker.image.avatar(),
				}), // Customize the response data
			)
		}

		return res(
			ctx.delay(0),
			ctx.status(401),
			ctx.json({ error: 'Invalid credentials' }), // Customize error response
		)
	}),
	rest.post<SignUpRequestBody>('/api/signup', async (req, res, ctx) => {
		const requestBody = await req.text()

		const data = JSON.parse(requestBody)

		return res(ctx.delay(2000), ctx.status(401), ctx.json({ data }))
	}),
	rest.get<getParentsResponse>('/api/parents', async (req, res, ctx) => {
		const numberOfParents = 15
		const numberOfStudents = 3

		// Generate an array of parent objects using Faker and the schema
		const parents = Array.from({ length: numberOfParents }, () => ({
			id: faker.string.uuid(),
			firstname: faker.person.firstName('male'),
			lastname: faker.person.lastName('male'),
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
	rest.get<getStudentsResponse>('/students', async (req, res, ctx) => {
		const numberofStudents = 15

		const students = Array.from({ length: numberofStudents }, () => ({
			id: faker.string.uuid(),
			firstname: faker.person.firstName('male'),
			lastname: faker.person.lastName('male'),
			class_name: faker.number.int({ min: 1, max: 7 }),
			stop: {
				id: faker.string.uuid(),
				description: faker.location.streetAddress(),
				longitude: faker.location.longitude(),
				latitude: faker.location.latitude(),
			},
			school: {
				id: faker.string.uuid(),
				name: faker.company.name(),
			},
			parent: {
				id: faker.string.uuid(),
				firstname: faker.person.firstName(),
				lastname: faker.person.lastName(),
				phone_number: faker.phone.number(),
			},
			// avatarImage: faker.image.avatar(),
		}))

		return res(ctx.delay(0), ctx.status(200), ctx.json(students))
	}),
	rest.get<getDriversResponse>('/api/drivers', async (req, res, ctx) => {
		const numberofDrivers = 15

		const drivers = Array.from({ length: numberofDrivers }, () => ({
			id: faker.string.uuid(),
			firstname: faker.person.firstName('male'),
			lastname: faker.person.lastName('male'),
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
			zone: `Zone ${String.fromCharCode(65 + 1)}`,
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
			route: faker.word.words(3),
			driver: faker.person.fullName(),
			bus: faker.vehicle.vrm(),
			start_time: faker.date.soon({ days: 1 }),
			students: Array.from({ length: numberofStudents }, () => ({
				id: faker.string.uuid(),
				firstname: faker.person.firstName('male'),
				lastname: faker.person.lastName('male'),
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
			const zoneName = `Zone ${String.fromCharCode(65 + i)}`
			zones.push({
				id: faker.string.uuid(),
				name: zoneName,
			})
		}

		return res(ctx.delay(0), ctx.status(200), ctx.json(zones))
	}),
	rest.get<getRolesResponse>('/api/roles', async (req, res, ctx) => {
		const numberOfRoles = 1
		const roles = []

		for (let i = 0; i < numberOfRoles; i++) {
			const roleName = 'SchoolAdmin'
			roles.push({
				id: faker.string.uuid(),
				name: roleName,
			})
		}

		return res(ctx.delay(0), ctx.status(200), ctx.json(roles))
	}),
	rest.get<getUsersResponse>('/api/users', async (req, res, ctx) => {
		const numberOfUsers = 5
		const users = []

		for (let i = 0; i < numberOfUsers; i++) {
			users.push({
				id: faker.string.uuid(),
				firstname: faker.person.firstName(),
				lastname: faker.person.lastName(),
				phone_number: faker.phone.number(),
				email: faker.internet.email(),
				role: 'School Admin',
				school: 'City Primary',
				status: 'Active',
			})
		}

		return res(ctx.delay(0), ctx.status(200), ctx.json(users))
	}),
	rest.get<getSchoolByIdResponse>('/api/schools/:id', async (req, res, ctx) => {
		const school = {
			id: faker.string.uuid(),
			name: 'City Primary',
			address: '17 CBD,Nairobi',
			phone_number: faker.phone.number(),
			email: faker.internet.email(),
			contact_person: faker.person.fullName(),
			contact_person_phone: faker.phone.number(),
		}

		return res(ctx.delay(0), ctx.status(200), ctx.json(school))
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
	rest.delete('/api/roles/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted role successfuly'),
		)
	}),
	rest.delete('/api/users/:id', async (req, res, ctx) => {
		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json('Deleted user successfuly'),
		)
	}),
	rest.post<routeRequestBody>('/api/add-route', async (req, res, ctx) => {
		const requestBody = await req.text()

		const data = JSON.parse(requestBody)

		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json({
				data,
				message: 'Successfully added route',
			}),
		)
	}),
	rest.patch<updateZoneByIdResponse>(
		'/api/zones/:id',
		async (req, res, ctx) => {
			const requestBody = await req.text()

			const data = JSON.parse(requestBody)

			return res(
				ctx.delay(2000),
				ctx.status(200),
				ctx.json({
					data,
					message: 'Successfully updated zone',
				}),
			)
		},
	),
]
