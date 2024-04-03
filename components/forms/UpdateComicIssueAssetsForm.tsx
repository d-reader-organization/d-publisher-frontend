/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React from 'react'

import { Resolver, useForm } from 'react-hook-form'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Button from 'components/Button'
import { UpdateComicIssueFilesData } from 'models/comicIssue'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useUpdateComicIssueFiles } from '@/api/comicIssue/queries/useUpdateComicIssueFiles'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadComicIssueAssetsValidationSchema } from '@/components/forms/schemas'
import { useToaster } from '@/providers/ToastProvider'
import { signatureTooltipText, pdfTooltipText } from '@/constants/tooltips'
import Label from '@/components/forms/Label'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import { pdfType, transparentImageTypes } from '@/constants/fileTypes'
import ReactSignatureCanvas from 'react-signature-canvas'
import Grid from '@mui/material/Grid'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'

interface Props {
	comicIssue: RawComicIssue
}

const UpdateComicIssueAssetsForm: React.FC<Props> = ({ comicIssue }) => {
	const router = useRouter()
	const toaster = useToaster()

	const { register, setValue, handleSubmit } = useForm<UpdateComicIssueFilesData>({
		defaultValues: {
			signature: undefined,
			pdf: undefined,
		},
		resolver: yupResolver(uploadComicIssueAssetsValidationSchema) as Resolver<UpdateComicIssueFilesData>,
	})
	const { mutateAsync: updateComicIssueFiles } = useUpdateComicIssueFiles(comicIssue.id)

	useAuthenticatedRoute()

	const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: UpdateComicIssueFilesData) => {
		const formData = new FormData()

		if (data.signature) formData.append('signature', data.signature)
		if (data.pdf) formData.append('pdf', data.pdf)

		await updateComicIssueFiles(formData)
	}

	return (
		<>
			<main>
				<Form padding maxSize='sm' fullWidth className='form--edit-comic-issue-assets'>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<Label tooltipText={signatureTooltipText}>Signature</Label>
							<p className='description'>Edit signature image </p>
							<div className='comic-issue-signature-input-wrapper'>
								<FileUpload
									id='signature-upload'
									label='Choose a picture 380x240px'
									className='comic-issue-signature-input'
									onUpload={(files) => {
										setValue('signature', files[0]?.file)
									}}
									ref={register('signature').ref}
									options={{ accept: transparentImageTypes, maxFiles: 1 }}
									previewUrl={comicIssue.signature}
								/>
							</div>
						</Grid>

						<Grid item xs={12} md={12}>
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
								// previewUrl={comicIssue.pdf}
							/>
						</Grid>
					</Grid>

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

export default UpdateComicIssueAssetsForm
