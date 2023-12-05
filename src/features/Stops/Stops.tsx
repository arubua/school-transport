import { columns } from './columns'
import { DataTable } from './data-table'
import { Spinner } from '../../components/spinner'
import { useStops } from '../../hooks/api/stops'
import ErrorDisplay from '../../components/error-view'

export default function Stops() {
	const { data, isError, isLoading,refetch } = useStops()

	if (isLoading) {
		return (
			<div className="mt-[30vh] flex justify-center">
				<Spinner showSpinner={isLoading} />
			</div>
		)
	}

	if (isError) {
        return (
            <ErrorDisplay
                message="Oops! Something went wrong while fetching the data. Please check your internet connection and try again."
                actionText="Retry"
                onActionClick={() => refetch} // Trigger refetch on button click
            />
        )
    }

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
