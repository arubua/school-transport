import { columns } from './columns'
import { DataTable } from './data-table'
import { Spinner } from '../../components/spinner'
import { useDrivers } from '../../hooks/api/drivers'

export default function Drivers() {
	const { data, error, isLoading } = useDrivers()

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
