import React, { InputHTMLAttributes, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import clsx from 'clsx'

import ImageIcon from 'public/assets/vector-icons/image.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { convertFileToBlob } from 'utils/file'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label: string
	onUpload: (url: string) => void
}

const FileUpload = forwardRef<HTMLInputElement, Props>(({ label, onUpload, className = '', ...props }, ref) => {
	const componentRef = useRef<HTMLInputElement>(null)
	const [assetUrl, setAssetUrl] = useState<string>('')
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
			const file = files[0]

			if (!file) return

			const blob = await convertFileToBlob(file)

			const url = URL.createObjectURL(blob)
			setAssetUrl(url)
		},
	})

	useImperativeHandle(ref, () => componentRef.current as HTMLInputElement)

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target) return

		const files = event.target.files
		const file = files ? files[0] : null

		if (!file) return

		const blob = await convertFileToBlob(file)

		const url = URL.createObjectURL(blob)
		setAssetUrl(url)
		onUpload(url)
	}

	const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!componentRef.current) return
		event.preventDefault()
		event.stopPropagation()
		setAssetUrl('')
		onUpload('')
		componentRef.current.value = ''
	}

	return (
		<label
			className={clsx('file-upload', className, {
				'file-upload--no-pointer': assetUrl,
				'file-upload--dropping': draggingFileOver,
			})}
			{...getRootProps()}
		>
			{assetUrl && <img src={assetUrl} alt='preview-image' className='preview-image' />}
			{assetUrl && (
				<button className='close-button' onClick={handleRemoveFile}>
					<CloseIcon className='close-icon' />
				</button>
			)}
			<input {...props} {...getInputProps} type='file' onChange={handleFileChange} ref={componentRef} />
			{!assetUrl && (
				<>
					<ImageIcon className='image-icon' />
					<span className='label'>{label}</span>
				</>
			)}
		</label>
	)
})

FileUpload.displayName = 'FileUpload'

export default FileUpload
