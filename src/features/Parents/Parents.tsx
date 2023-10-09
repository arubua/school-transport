import { Parent, columns } from './columns'
import { DataTable } from '../../components/data-table'
import { faker } from '@faker-js/faker'



export default function Parents() {
	

	return (
		<div className="container mx-auto py-10">
			<DataTable columns={columns} data={data} />
		</div>
	)
}
