// src/mocks.ts
import { rest, RequestHandler } from 'msw'
import { z } from 'zod'

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
				ctx.json({ token: 'yourAuthTokenHere' }), // Customize the response data
			)
		}

		return res(
			ctx.delay(5000),
			ctx.status(401),
			ctx.json({ error: 'Invalid credentials' }), // Customize error response
		)
	}),
]
