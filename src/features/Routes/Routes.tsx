import { columns } from './columns'
import { DataTable } from './data-table'
import { useStudents } from '../../hooks/api/students'
import { Spinner } from '../../components/spinner'

export default function Routes() {
	const { data, error, isLoading } = useStudents()

	if (isLoading) {
		return (
			<div className="mt-[30vh] flex justify-center">
				<Spinner showSpinner={isLoading} />
			</div>
		)
	}

	// if (error) {
	// 	return <p>Error</p>
	// }

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
