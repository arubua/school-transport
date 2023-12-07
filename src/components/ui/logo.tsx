import React from 'react'
import { z } from 'zod'
import safiriLogo from '../../../other/svg-icons/safiri-logo.svg'

const LogoPropsSchema = z.object({
	className: z.string().optional(),
})

type LogoProps = z.infer<typeof LogoPropsSchema>

const Logo: React.FC<LogoProps> = ({ className }) => {
	LogoPropsSchema.parse({ className })

	return (
		<img src={safiriLogo} alt="School Transport Logo" className={className} />
	)
}

export default Logo
