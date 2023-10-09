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
]
