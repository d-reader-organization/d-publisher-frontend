'use client'

import React, { useState } from 'react'
import Button from 'components/Button'
import { useToaster } from '@/providers/ToastProvider'
import { yupRequiredMessage } from '@/utils/error'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useUpdateComicIssuePages, useUpdateComicIssuePdf } from '@/api/comicIssue'
import { comicIssuePagesTooltipText, numberOfPagesTooltipText, pdfTooltipText } from '@/constants/tooltips'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import IntegerInput from '@/components/forms/IntegerInput'
import Label from '@/components/forms/Label'
import { optimalImageTypes, pdfType } from '@/constants/fileTypes'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'
import { UpdateComicIssueFilesData } from '@/models/comicIssue'
import { Resolver, useForm } from 'react-hook-form'
import { editComicIssuePdfValidationSchema } from './schemas'
import { yupResolver } from '@hookform/resolvers/yup'

interface Props {
	comicIssue: RawComicIssue
}

const UpdateComicIssuePagesForm: React.FC<Props> = ({ comicIssue }) => {
	const toaster = useToaster()
	const [pageFiles, setPageFiles] = useState<File[]>([])
	const [numberOfPreviewPages, setNumberOfPreviewPages] = useState(3)
	const { mutateAsync: updatePages } = useUpdateComicIssuePages(comicIssue.id)
	const { mutateAsync: updateComicIssuePdf } = useUpdateComicIssuePdf(comicIssue.id)

	const { register, setValue, handleSubmit } = useForm<UpdateComicIssueFilesData>({
		defaultValues: {
			pdf: undefined,
		},
		resolver: yupResolver(editComicIssuePdfValidationSchema) as Resolver<UpdateComicIssueFilesData>,
	})

	useAuthenticatedRoute()

	const handleUploadPages = (pageFiles: File[]) => {
		setPageFiles(pageFiles)
	}

	const handleUploadPdf = async (data: UpdateComicIssueFilesData) => {
		if (!data.pdf?.size) return

		const formData = new FormData()

		if (data.pdf) formData.append('pdf', data.pdf)

		await updateComicIssuePdf(formData)
	}

	const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		await handleSubmit(handleUploadPdf, toaster.onFormError)()

		if (pageFiles.length === 0) return

		const formData = new FormData()

		let i = 0
		for (const pageFile of pageFiles) {
			const pageNumber = i + 1
			if (pageFile) formData.append(`pages[${i}][image]`, pageFile)
			formData.append(`pages[${i}][pageNumber]`, pageNumber.toString())
			formData.append(`pages[${i}][isPreviewable]`, (pageNumber <= numberOfPreviewPages).toString())
			i = i + 1
		}

		await updatePages(formData)
	}

	return (
		<>
			<main>
				<Form padding fullWidth className='form--edit-comic-issue-pages'>
					<Label isRequired tooltipText={pdfTooltipText}>
						Comic Issue PDF
					</Label>
					<p className='description'>Edit PDF file of the comic episode</p>
					<FileUpload
						id='pdf-upload'
						label='Choose a PDF file'
						className='comic-issue-pdf-input'
						onUpload={(files) => {
							setValue('pdf', files[0]?.file)
						}}
						ref={register('pdf').ref}
						options={{ accept: pdfType, maxFiles: 1 }}
						inline
					/>
					<div className='page-previews-number-wrapper'>
						<div>
							<Label tooltipText={numberOfPagesTooltipText}>Preview pages</Label>
							<p className='description'>Set the number of previewable pages</p>
						</div>
						<IntegerInput
							min={0}
							max={pageFiles.length || 3}
							value={numberOfPreviewPages}
							onChange={(step) => {
								setNumberOfPreviewPages((currentValue) => currentValue + step)
							}}
						/>
					</div>

					<Label isRequired tooltipText={comicIssuePagesTooltipText}>
						Reupload issue pages
					</Label>
					<FileUpload
						sortable
						allowMultipleFiles
						id='pages-upload'
						className='upload-pages'
						label={`Upload pages\nImages should have at least 1024x1484px`}
						onUpload={(uploadedFiles) => {
							handleUploadPages(uploadedFiles.map((file) => file.file))
							setNumberOfPreviewPages((currentValue) => {
								if (currentValue > uploadedFiles.length) return uploadedFiles.length
								return currentValue
							})
						}}
						options={{ accept: optimalImageTypes }}
					/>

					<FormActions>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
							Update
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}

export default UpdateComicIssuePagesForm
