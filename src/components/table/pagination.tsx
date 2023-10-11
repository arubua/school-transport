import { Table } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Icon } from '../ui/icon'
import React from 'react'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const currentPageIndex = table.getState().pagination.pageIndex
	const pageCount = table.getPageCount()

	const handleFirstPageClick = () => {
		table.setPageIndex(0)
	}

	const handlePreviousPageClick = () => {
		if (table.getCanPreviousPage()) {
			table.previousPage()
		}
	}

	const handleNextPageClick = () => {
		if (table.getCanNextPage()) {
			table.nextPage()
		}
	}

	const handleLastPageClick = () => {
		table.setPageIndex(pageCount - 1)
	}

	const renderPageButtons = () => {
		const pageButtons = []
		for (let i = 0; i < pageCount; i++) {
			pageButtons.push(
				<Button
					key={i}
					variant="outline"
					className={`h-8 w-8 p-0 ${
						currentPageIndex === i ? 'bg-primary/10 font-bold text-primary' : ''
					}`}
					onClick={() => {
						table.setPageIndex(i)
					}}
				>
					{i + 1}
				</Button>,
			)
		}
		return pageButtons
	}

	return (
		<div className="mt-2 flex items-center justify-center px-2">
			{/* <div className="flex-1 text-sm text-muted-foreground">
				{table.getFilteredSelectedRowModel().rows.length} of{' '}
				{table.getFilteredRowModel().rows.length} row(s) selected.
			</div> */}
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="h-8 w-8 p-0 lg:flex"
						onClick={handleFirstPageClick}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<Icon name="double-arrow-left" className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={handlePreviousPageClick}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<Icon name="chevron-left" className="h-4 w-4" />
					</Button>
				</div>
				<div className="flex items-center space-x-2">{renderPageButtons()}</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={handleNextPageClick}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<Icon name="chevron-right" className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0 lg:flex"
						onClick={handleLastPageClick}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<Icon name="double-arrow-right" className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
