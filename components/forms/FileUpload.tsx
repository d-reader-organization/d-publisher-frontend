import React, { InputHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { cloneDeep, remove } from 'lodash'
import clsx from 'clsx'

import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import ImageIcon from 'public/assets/vector-icons/image.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { convertFileToBlob } from 'utils/file'
import SkeletonImage from '../SkeletonImage'

// TODO v2: switch to https://github.com/atlassian/react-beautiful-dnd

type UploadedFile = { url: string; file: File }

function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
	const arrayCopy = [...arr]
	const [removedItem] = arrayCopy.splice(fromIndex, 1)
	arrayCopy.splice(toIndex, 0, removedItem)
	return arrayCopy
}

interface SortableItemProps {
	uploadedFile: UploadedFile
	handleRemoveFile: (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => void
}

const SortableItem = SortableElement<SortableItemProps>(({ uploadedFile, handleRemoveFile }: SortableItemProps) => (
	<div className={clsx('preview-image-wrapper')}>
		<button className='close-button' onClick={(event) => handleRemoveFile(event, uploadedFile)}>
			<CloseIcon className='close-icon' />
		</button>
		{uploadedFile.file?.type.includes('pdf') ? (
			<embed src={uploadedFile.url} width='100%' height='100%' />
		) : (
			<SkeletonImage fill src={uploadedFile.url} alt='' className='preview-image' />
		)}
	</div>
))

interface SortableListProps {
	items: UploadedFile[]
	handleRemoveFile: (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => void
}

const SortableList = SortableContainer<SortableListProps>(({ items, handleRemoveFile }: SortableListProps) => (
	<div className='preview-image-list'>
		{items.map((uploadedFile, index) => (
			<SortableItem
				key={uploadedFile.url}
				index={index}
				uploadedFile={uploadedFile}
				handleRemoveFile={handleRemoveFile}
			/>
		))}
	</div>
))

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
	allowMultipleFiles?: boolean
	onUpload?: (uploadedFiles: UploadedFile[]) => void
	previewUrl?: string
	sortable?: boolean
	options?: Omit<DropzoneOptions, 'onDragEnter' | 'onDragLeave' | 'onDrop'>
}

const FileUpload = forwardRef<HTMLInputElement, Props>(
	(
		{
			id,
			label,
			allowMultipleFiles = false,
			previewUrl = '',
			onUpload = () => {},
			onClick = () => {},
			className = '',
			sortable = false,
			options,
			...props
		},
		ref
	) => {
		const componentRef = useRef<HTMLInputElement>(null)
		const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(
			previewUrl ? [{ url: previewUrl, file: undefined as unknown as any }] : []
		)
		const [draggingFileOver, setDraggingFileOver] = useState<boolean>(false)

		const { getRootProps, getInputProps } = useDropzone({
			onDragEnter: () => {
				setDraggingFileOver(true)
			},
			onDragLeave: () => {
				setDraggingFileOver(false)
			},
			onDrop: async (files) => {
				setDraggingFileOver(false)

				if (!allowMultipleFiles && files.length > 1) return

				const uploads: UploadedFile[] = []

				for (let i = 0; i < files.length; i++) {
					const file = files[i]
					const blob = await convertFileToBlob(file)

					const url = URL.createObjectURL(blob)

					uploads.push({ url, file })
				}

				setUploadedFiles(uploads)
				onUpload(uploads)
			},
			...options,
		})

		useImperativeHandle(ref, () => componentRef.current as HTMLInputElement)

		const handleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
			if (navigator.userAgent.toLowerCase().includes('chrome')) {
				event.preventDefault()
				event.stopPropagation()
			}
			onClick(event)
		}

		const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
			event.preventDefault()
			event.stopPropagation()
			if (!event.target) return

			const files = event.target.files || []

			if (!allowMultipleFiles && files.length > 1) return

			const uploads: UploadedFile[] = []

			for (let i = 0; i < files.length; i++) {
				const file = files[i]
				const blob = await convertFileToBlob(file)

				const url = URL.createObjectURL(blob)

				uploads.push({ url, file })
			}

			setUploadedFiles(uploads)
			onUpload(uploads)
		}

		const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>, uploadedFile: UploadedFile) => {
			if (!componentRef.current) return
			event.preventDefault()
			event.stopPropagation()

			const deepClonedUploadedFiles = cloneDeep(uploadedFiles)

			remove(deepClonedUploadedFiles, (deepClonedUploadedFile) => deepClonedUploadedFile.url === uploadedFile.url)

			setUploadedFiles(deepClonedUploadedFiles)
			onUpload(deepClonedUploadedFiles)
			URL.revokeObjectURL(uploadedFile.url)
			componentRef.current.value = ''
		}

		useEffect(() => {
			if (previewUrl) {
				const previewFile = [{ url: previewUrl, file: undefined as unknown as File }]
				setUploadedFiles(previewFile)
				onUpload(previewFile)
			}
		}, [previewUrl])

		return (
			<>
				<label
					htmlFor={id}
					className={clsx('file-upload', className, {
						'file-upload--no-pointer': !sortable && uploadedFiles.length > 0,
						'file-upload--dropping': draggingFileOver,
					})}
					{...getRootProps()}
				>
					{!sortable && uploadedFiles.length > 0 && (
						<div className='preview-image-list'>
							{uploadedFiles.map((uploadedFile) => {
								return (
									<div
										key={uploadedFile.url}
										className={clsx('preview-image-wrapper', {
											'preview-image-wrapper--cover': uploadedFiles.length === 1,
										})}
									>
										{uploadedFile.file?.type.includes('pdf') ? (
											<embed src={uploadedFile.url} width='100%' height='100%' />
										) : (
											<SkeletonImage fill src={uploadedFile.url || previewUrl} alt='' className='preview-image' />
										)}
										<button className='close-button' onClick={(event) => handleRemoveFile(event, uploadedFile)}>
											<CloseIcon className='close-icon' />
										</button>
									</div>
								)
							})}
						</div>
					)}

					<input
						{...props}
						{...getInputProps()}
						id={id}
						type='file'
						multiple={allowMultipleFiles}
						onChange={handleFileChange}
						onClick={handleClick}
						ref={componentRef}
						disabled={!sortable && uploadedFiles.length > 0}
						style={{ display: 'none' }}
					/>
					{(sortable || uploadedFiles.length === 0) && (
						<>
							<ImageIcon className='image-icon' />
							<span className='label'>{label}</span>
						</>
					)}
				</label>
				{sortable && (
					<div className='file-preview'>
						{uploadedFiles.length > 0 && (
							<SortableList
								items={uploadedFiles}
								onSortEnd={({ oldIndex, newIndex }) => {
									const newFilesOrder = arrayMove(uploadedFiles, oldIndex, newIndex)
									setUploadedFiles(newFilesOrder)
									onUpload(newFilesOrder)
								}}
								handleRemoveFile={handleRemoveFile}
								axis='x'
							/>
						)}
					</div>
				)}
			</>
		)
	}
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
