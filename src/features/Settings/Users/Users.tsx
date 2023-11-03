import { columns } from './columns'
import { DataTable } from './data-table'
import { Spinner } from '../../../components/spinner'
import { useUsers } from '../../../hooks/api/settings/users'

export default function Users() {
	const { data, error, isLoading } = useUsers()

	if (isLoading) {
		return (
			<div className="mt-[30vh] flex justify-center">
				<Spinner showSpinner={isLoading} />
			</div>
		)
	}

	if (error) {
		return <p>Error</p>
	}

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
