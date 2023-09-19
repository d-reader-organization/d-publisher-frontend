import React, { InputHTMLAttributes, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { cloneDeep, remove } from 'lodash'
import clsx from 'clsx'

import ImageIcon from 'public/assets/vector-icons/image.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { convertFileToBlob } from 'utils/file'
import Image from 'next/image'
import SkeletonImage from './SkeletonImage'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
	allowMultipleFiles?: boolean
	onUpload?: (uploadedFiles: UploadedFile[]) => void
	previewUrl?: string
}

type UploadedFile = { url: string; file: File }

const FileUpload = forwardRef<HTMLInputElement, Props>(
	({ id, label, allowMultipleFiles = false, previewUrl = '', onUpload = () => {}, className = '', ...props }, ref) => {
		const componentRef = useRef<HTMLInputElement>(null)
		const [assetUrls, setAssetUrls] = useState<string[]>(previewUrl ? [previewUrl] : [])
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

				const urls: string[] = []

				for (let i = 0; i < files.length; i++) {
					const blob = await convertFileToBlob(files[i])

					const url = URL.createObjectURL(blob)

					urls.push(url)
				}

				setAssetUrls(urls)
			},
		})

		useImperativeHandle(ref, () => componentRef.current as HTMLInputElement)

		const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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

			const urls = uploads.map((upload) => upload.url)

			setAssetUrls(urls)
			onUpload(uploads)
		}

		const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>, assetUrl: string) => {
			if (!componentRef.current) return
			event.preventDefault()
			event.stopPropagation()

			const deepClonedAssetUrls = cloneDeep(assetUrls)

			remove(deepClonedAssetUrls, (deepClonedAssetUrl) => deepClonedAssetUrl === assetUrl)

			setAssetUrls(deepClonedAssetUrls)
			URL.revokeObjectURL(assetUrl)
			componentRef.current.value = ''
		}

		useEffect(() => {
			if (previewUrl) {
				setAssetUrls([previewUrl])
			}
		}, [previewUrl])

		return (
			<label
				htmlFor={id}
				className={clsx('file-upload', className, {
					'file-upload--no-pointer': assetUrls.length > 0,
					'file-upload--dropping': draggingFileOver,
				})}
				{...getRootProps()}
			>
				{assetUrls.length > 0 && (
					<div className='preview-image-list'>
						{assetUrls.map((assetUrl) => (
							<div
								key={assetUrl}
								className={clsx('preview-image-wrapper', {
									'preview-image-wrapper--cover': assetUrls.length === 1,
								})}
							>
								<SkeletonImage fill src={assetUrl || previewUrl} alt='' className='preview-image' />
								<button className='close-button' onClick={(event) => handleRemoveFile(event, assetUrl)}>
									<CloseIcon className='close-icon' />
								</button>
							</div>
						))}
					</div>
				)}

				<input
					{...props}
					{...getInputProps}
					id={id}
					type='file'
					multiple={allowMultipleFiles}
					onChange={handleFileChange}
					ref={componentRef}
					disabled={assetUrls.length > 0}
				/>
				{assetUrls.length === 0 && (
					<>
						<ImageIcon className='image-icon' />
						<span className='label'>{label}</span>
					</>
				)}
			</label>
		)
	}
)

FileUpload.displayName = 'FileUpload'

export default FileUpload
