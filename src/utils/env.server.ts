import { z } from 'zod'

const schema = z.object({
	VITE_NODE_ENV: z.enum(['production', 'development', 'test'] as const),
	VITE_BASE_URL: z.string(),
  });
  

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof schema> {}
	}
}

export function init() {
	const parsed = schema.safeParse({
		VITE_NODE_ENV: import.meta.env.MODE,
		VITE_BASE_URL:import.meta.env.VITE_BASE_URL
	})

	if (parsed.success === false) {
		console.error(
			'❌ Invalid environment variables:',
			parsed.error.flatten().fieldErrors,
		)

		throw new Error('Invalid envirmonment variables')
	}
}

/**
 *
 * NOTE: Do *not* add any environment variables in here that you do not wish to
 * be included in the client.
 * @returns all public ENV variables
 */
export function getEnv() {
	return {
		MODE: import.meta.env.NODE_ENV,
		SENTRY_DSN: import.meta.env.SENTRY_DSN,
		VITE_BASE_URL: import.meta.env.VITE_BASE_URL
	}
}

type ENV = ReturnType<typeof getEnv>

declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}
