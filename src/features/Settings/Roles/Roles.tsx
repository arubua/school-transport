import { columns } from './columns'
import { DataTable } from './data-table'
import { useRoles } from '../../../hooks/api/settings/roles'
import { Spinner } from '../../../components/spinner'

export default function Roles() {
	const { data, error, isLoading } = useRoles()

	if (isLoading) {
		return (
			<div className="mt-[30vh] flex justify-center">
				<Spinner showSpinner={isLoading} />
			</div>
		)
	}

	if (error) {
		return <p>{error.message}</p>
	}

	return (
		<div className="container mx-auto">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
