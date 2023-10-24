import { Spinner } from '../../components/spinner'
import { useZones } from '../../hooks/api/zones'
import { Input } from '../../components/ui/input'
import { Icon } from '../../components/ui/icon'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Spacer } from '../../components/spacer'
import { useState, useEffect } from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../components/dialog'
import { Label } from '../../components/ui/label'

export default function Zones() {
	const navigate = useNavigate()
	const { data, error, isLoading } = useZones()

	const [searchQuery, setSearchQuery] = useState<string>('')
	const [filteredData, setFilteredData] = useState(data) // Initialize filteredData with all zones
	const [noResults, setNoResults] = useState(false)

	useEffect(() => {
		if (data) {
			// Apply debounce to the search query
			const debounceTimeout = setTimeout(() => {
				const filtered = data.filter(
					(zone: { name?: string }) =>
						zone.name?.toLowerCase().includes(searchQuery.toLowerCase()),
				)
				setFilteredData(filtered)

				// Set noResults to true if no zones match the search query
				setNoResults(filtered.length === 0)
			}, 300) // Adjust the debounce delay as needed (e.g., 300ms)

			return () => clearTimeout(debounceTimeout) // Clear the timeout on unmount
		}
	}, [searchQuery, data])

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
		<div className="container mx-auto py-10">
			<div className="flex justify-between py-4">
				<Input
					placeholder="Search zones..."
					value={searchQuery}
					onChange={event => setSearchQuery(event.target.value)} // Update searchQuery state on input change
					className="max-w-md"
				/>
				<div className="flex gap-2">
					<Button variant="outline" size={'sm'}>
						<Icon name="download" className="mr-2" />
						Export
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button size={'sm'}>
								<Icon name="plus" className="mr-2" />
								Add Zone
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-[425px]">
							<DialogHeader>
								<DialogTitle>Add Zone</DialogTitle>
								<DialogDescription>
									Type the name of the zone here and submit when you're done.
								</DialogDescription>
							</DialogHeader>
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor="name" className="text-right">
										Name
									</Label>
									<Input
										id="name"
										placeholder="Zone F"
										className="col-span-3"
									/>
								</div>
							</div>
							<DialogFooter>
								<Button type="submit">Submit</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<Spacer size="4xs" />
			<div className="flex flex-wrap justify-around gap-2">
				{noResults ? (
					<div className="text-red-500">No zones match the search term.</div>
				) : (
					filteredData?.map((zone: { name?: string }) => {
						return (
							<div
								key={zone?.name}
								className="flex w-56 justify-between rounded border p-4"
							>
								<div className="my-auto">
									<h3>{zone?.name}</h3>
								</div>
								<div>
									<Dialog>
										<DialogTrigger asChild>
											<Button variant="outline" size="icon">
												<Icon name="pencil-1" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Edit Zone</DialogTitle>
												<DialogDescription>
													Update the name of the zone here and click save when
													you're done.
												</DialogDescription>
											</DialogHeader>
											<div className="grid gap-4 py-4">
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="name" className="text-right">
														Name
													</Label>
													<Input
														id="name"
														defaultValue={zone.name}
														className="col-span-3"
													/>
												</div>
											</div>
											<DialogFooter>
												<Button type="submit">Save changes</Button>
											</DialogFooter>
										</DialogContent>
									</Dialog>
								</div>
							</div>
						)
					})
				)}
			</div>
		</div>
	)
}
