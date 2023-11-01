import { columns } from './columns'
import { DataTable } from './data-table'
import { Spinner } from '../../components/spinner'
import { useSchedules } from '../../hooks/api/schedules'

export default function Schedules() {
	const { data, error, isLoading } = useSchedules()

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
