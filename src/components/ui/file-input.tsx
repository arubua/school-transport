import React, { useEffect, useState } from 'react'
import Dropzone, { FileRejection } from 'react-dropzone'
import { Spinner } from '../spinner'
import { Icon } from './icon'
import { Spacer } from '../spacer'
import { Avatar, AvatarImage } from './avatar'

interface FileUploadProps {
	accept: { [key: string]: string[] }
	multiple: boolean
	onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void
	error?: string
	format: string
	size?: number
	onDownload?: () => void
	downloading: boolean
	acceptedFiles?: File[]
	fileName: string
	delete: (file: File) => void
	rejectedFiles?: FileRejection[]
	// uploadedImages: string[]
}

const FileUpload: React.FC<FileUploadProps> = props => {
	const previewFiles = props.acceptedFiles

	const [imagePreviews, setImagePreviews] = useState<string[]>([])

	const handleImagePreview = (files: File[]) => {
		const previews = files.map(file => URL.createObjectURL(file))
		setImagePreviews([ ...previews])
	}

	useEffect(() => {
		if (previewFiles && previewFiles !== undefined) {
			handleImagePreview(previewFiles)
		}
	}, [previewFiles])

	return (
		<div className="flex gap-1">
			{imagePreviews.length > 0 && (
				<div className="image-previews">
					{imagePreviews.map((preview, index) => (
						// <img key={index} src={preview} alt={`Preview ${index}`} />
						<Avatar key={index}>
							<AvatarImage src={preview} alt={props.fileName} />
						</Avatar>
					))}
				</div>
			)}
			<div className="min-h-32 max-w-xs rounded border p-4 ">
				<Dropzone
					accept={props.accept}
					multiple={props.multiple}
					onDrop={(acceptedFiles, rejectedFiles) => {
						props.onDrop(acceptedFiles, rejectedFiles)
					}}
				>
					{({ getRootProps, getInputProps }) => (
						<section className="file_uploader ">
							<div
								{...getRootProps()}
								className="flex h-full w-full flex-col items-center justify-center"
							>
								<input {...getInputProps()} />
								<Icon name="upload" />
								<Spacer size="4xs" />
								<p style={{ marginBottom: 0 }}>
									<b className="text-primary">Click to Upload </b>
									or drag 'n' drop
								</p>
							</div>
						</section>
					)}
				</Dropzone>

				{props.error && <div className="text-danger">{props.error}</div>}
				<small className="text-disabled text-center">
					{props.format} {props.size && `size limit ${props.size} MB)`}
				</small>
				{props.onDownload && (
					<div>
						{props.downloading && <Spinner showSpinner={props.downloading} />}
					</div>
				)}
				{props.acceptedFiles && props.acceptedFiles.length > 0 && (
					<ul className="list-group mb-4 mt-4">
						{props.acceptedFiles.map((file, i) => (
							<li className="list-group-item file_list" key={i}>
								<div className="flex gap-2">
									<div className="icon-con">
										<Icon name="file" />
									</div>
									{props.fileName ? (
										<span>{props.fileName}</span>
									) : (
										<span>{file.name}</span>
									)}
									<div className="right_icon text-danger">
										<Icon
											name="trash"
											className="cursor-pointer"
											onClick={() => props.delete(file)}
										/>
									</div>
								</div>
							</li>
						))}
					</ul>
				)}
				{props.rejectedFiles &&
					props.rejectedFiles.length > 0 &&
					props.rejectedFiles.map(file => {
						return (
							file.errors && (
								<div className="text-danger" key={file.file.name}>
									{file.errors[0].message}
								</div>
							)
						)
					})}
			</div>
		</div>
	)
}

export default FileUpload
