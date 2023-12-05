import React from 'react'
import { Button } from '../../components/ui/button'
import { useNavigate } from 'react-router-dom'

const SignupConfirmationPage = () => {
	const navigate = useNavigate()
	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-md rounded-md bg-primary/20 bg-white p-8 shadow-md ">
				<h2 className="mb-4 text-2xl font-semibold">Signup Successful!</h2>
				<p className="mb-6 text-gray-600">
					Thank you for signing up. Your account is now pending approval.
				</p>

				<div className="mb-6">
					<h3 className="mb-2 text-lg font-semibold">What to Expect:</h3>
					<ul className="list-disc pl-6">
						<li>
							You will receive an email notification once your account is
							approved.
						</li>
						<li>
							If you have any questions, feel free to{' '}
							<a href="mailto:support@example.com" className="text-blue-500">
								contact us
							</a>
							.
						</li>
					</ul>
				</div>

				<div className="mb-6">
					<h3 className="mb-2 text-lg font-semibold">Next Steps:</h3>
					<ul className="list-disc pl-6">
						<li>Await approval.</li>
						<li>Check your email for updates.</li>
						<li>Once approved, you can log in to your account.</li>
					</ul>
				</div>

				{/* <button className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
					Return to Login Page
				</button> */}
				<Button  onClick={() => navigate('/auth/login')}>
					Proceed to Login
				</Button>
			</div>
		</div>
	)
}

export default SignupConfirmationPage
