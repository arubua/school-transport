'use client'
import * as React from 'react'

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getFilteredRowModel,
	SortingState,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../components/table'
import { Input } from '../../components/ui/input'
import { DataTablePagination } from '../../components/table/pagination'
import { Button } from '../../components/ui/button'
import { Icon } from '../../components/ui/icon'
import { useNavigate } from 'react-router-dom'

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const navigate = useNavigate()
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	})

	const selected = table.getSelectedRowModel()

	return (
		<div>
			<div className="flex justify-between py-4">
				<div className="flex">
					<Input
						placeholder="Filter names..."
						value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
						onChange={event =>
							table.getColumn('name')?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
					{(table.getIsSomeRowsSelected() === true ||
						table.getIsAllRowsSelected() === true) && (
						<Button variant="link" size="sm" className="w-60">
							<Icon name="plus" className="mr-2" />
							Add to schedule
						</Button>
					)}
				</div>
				<div className="flex justify-between gap-2">
					<Button size={'sm'} onClick={() => navigate('addStudent')}>
						<Icon name="plus" className="mr-2" />
						Add Student
					</Button>
				</div>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}
										</TableHead>
									)
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="relative flex justify-center">
				<div className="absolute left-2 pt-2 text-body-xs text-muted-foreground ">{`${
					selected.rows.length
				} out of ${table.getRowModel().rows.length} selected`}</div>
				<DataTablePagination table={table} />
			</div>
		</div>
	)
}
