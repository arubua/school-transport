import { Parent, columns } from './columns'
import { DataTable } from '../../components/table/data-table'
import { faker } from '@faker-js/faker'
import { useParents } from '../../hooks/api/parents'

export default function Parents() {
	const { data, error, isLoading } = useParents()

	if (isLoading) {
		return <p>Loading...</p>
	}

	if (error) {
		return <p>Error</p>
	}

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
