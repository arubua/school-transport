import { columns } from './columns'
import { DataTable } from './data-table'
import { useParents } from '../../hooks/api/parents'
import { Spinner } from '../../components/spinner'

export default function Parents() {
	const { data, error, isLoading } = useParents()

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
