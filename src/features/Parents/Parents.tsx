import { columns } from './columns'
import { DataTable } from './data-table'
import { useParents } from '../../hooks/api/parents'
import { Spinner } from '../../components/spinner'
import ErrorDisplay from '../../components/error-view'

export default function Parents() {
	const { data,isError,error, isLoading,refetch } = useParents()

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
