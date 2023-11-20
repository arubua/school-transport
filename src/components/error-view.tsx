import React from 'react'
import { z } from 'zod'
import { Button } from './ui/button'
import { Icon } from './ui/icon'

const ErrorPropsSchema = z.object({
	message: z.string(),
	actionText: z.string().optional(),
	onActionClick: z.function().optional(),
})

type ErrorProps = z.infer<typeof ErrorPropsSchema>

const ErrorDisplay: React.FC<ErrorProps> = ({
	message,
	actionText,
	onActionClick,
}) => {
	return (
		<div className="container mx-auto mt-[20vh] max-w-sm py-10 ">
			<p>{message}</p>
			{actionText && onActionClick && (
				<Button className="mt-4" size='sm' variant="default" onClick={onActionClick}>
					<Icon name="reload" className="mr-4" />
					{actionText}
				</Button>
			)}
		</div>
	)
}

export default ErrorDisplay
