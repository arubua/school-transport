// src/mocks.ts
import { rest, RequestHandler } from 'msw';
import { z } from 'zod';

// Define a Zod schema for the login request body
const loginRequestBodySchema = z.object({
  username: z.string(),
  password: z.string(),
});

type LoginRequestBody = z.infer<typeof loginRequestBodySchema>;

export const handlers:Array<RequestHandler> = [
  rest.post<LoginRequestBody>('/api/login', (req, res, ctx) => {
    const { username, password } = req.body;

    // Validate the request body against the schema
    const validationResult = loginRequestBodySchema.safeParse(req.body);

    if (!validationResult.success) {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Invalid request body' })
      );
    }

    const { data } = validationResult;

    // Replace this with your validation logic.
    if (data.username === 'testuser' && data.password === 'testpassword') {
      return res(
        ctx.status(200),
        ctx.json({ token: 'yourAuthTokenHere' }) // Customize the response data
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' }) // Customize error response
    );
  }),
];
