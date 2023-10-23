// src/mocks.ts
import { rest, RequestHandler } from 'msw'
import { redirect } from 'react-router-dom'
import { z } from 'zod'
import { faker } from '@faker-js/faker'

// Define a Zod schema for the login request body
const loginRequestBodySchema = z.object({
	username: z.string(),
	password: z.string(),
	remember_user: z.boolean(),
})

type LoginRequestBody = z.infer<typeof loginRequestBodySchema>

const getStudentsSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
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
		name: z.string(),
		email: z.string(),
		phone: z.number(),
		image: z.string(),
	}),
)

type getParentsResponse = z.infer<typeof getParentsSchema>

const getDriversSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
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
				ctx.delay(2000),
				ctx.status(200),
				ctx.json({
					username: data.username,
					email: faker.internet.email({ firstName: 'test', lastName: 'user' }),
					token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3R1c2VyIiwiaWF0IjoxNTE2MjM5MDIyfQ.NpDP1uN-yGDGJwlE6i_aWpIIKgVf2mf9Rm_1LaZ-xtI`,
				}), // Customize the response data
			)
		}

		return res(
			ctx.delay(2000),
			ctx.status(401),
			ctx.json({ error: 'Invalid credentials' }), // Customize error response
		)
	}),
	rest.get<getParentsResponse>('/api/parents', async (req, res, ctx) => {
		const numberOfParents = 15 // Set the number of parent objects you want to generate

		// Generate an array of parent objects using Faker and the schema
		const parents = Array.from({ length: numberOfParents }, () => ({
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phone: faker.phone.number(),
			image: faker.image.avatar(),
		}))

		return res(
			ctx.delay(2000),
			ctx.status(200),
			ctx.json(parents), // Respond with the generated parent objects
		)
	}),
	rest.get<getStudentsResponse>('/api/students', async (req, res, ctx) => {
		const numberofStudents = 15

		const students = Array.from({ length: numberofStudents }, () => ({
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			class: faker.number.int({ min: 1, max: 7 }),
			stop: faker.location.streetAddress(),
			school: faker.company.name(),
			parent_name: faker.person.fullName(),
			parent_phone: faker.phone.number(),
			image: faker.image.avatar(),
		}))

		return res(ctx.delay(2000), ctx.status(200), ctx.json(students))
	}),
	rest.get<getDriversResponse>('/api/drivers', async (req, res, ctx) => {
		const numberofDrivers = 15

		const drivers = Array.from({ length: numberofDrivers }, () => ({
			id: faker.string.uuid(),
			name: faker.person.fullName(),
			phone_number: faker.phone.number(),
			bus: faker.vehicle.vrm(),
			image: faker.image.avatar(),
		}))

		return res(ctx.delay(2000), ctx.status(200), ctx.json(drivers))
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

		return res(ctx.delay(2000), ctx.status(200), ctx.json(buses))
	}),
	rest.get<getZonesResponse>('/api/zones', async (req, res, ctx) => {
		const numberOfZones = 5;
		const zones = [];
	  
		for (let i = 0; i < numberOfZones; i++) {
		  const zoneName = `Zone ${String.fromCharCode(65 + i)}`; // Convert ASCII value to letter (A, B, C, ...)
		  zones.push({
			id: faker.string.uuid(),
			name: zoneName,
		  });
		}
	  
		return res(ctx.delay(2000), ctx.status(200), ctx.json(zones));
	  })
]
