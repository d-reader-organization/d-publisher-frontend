'use client'

import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { CreateComicIssueData, UpdateComicIssueFilesData } from 'models/comicIssue'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useUpdateComicIssueFiles } from '@/api/comicIssue/queries/useUpdateComicIssueFiles'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadComicIssueAssetsValidationSchema } from '@/components/forms/schemas'
import { useToaster } from '@/providers/ToastProvider'
import { signatureTooltipText, pdfTooltipText } from '@/constants/tooltips'
import Label from '@/components/forms/Label'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import { pdfType, transparentImageTypes } from '@/constants/fileTypes'
// import SignatureCanvas from 'react-signature-canvas'
import { useFetchRawComicIssue } from '@/api/comicIssue'
// import SkeletonImage from '@/components/SkeletonImage'
import ReactSignatureCanvas from 'react-signature-canvas'
import { Grid } from '@mui/material'

export default function UploadComicIssueAssetsPage() {
	const router = useRouter()
	const toaster = useToaster()

	const searchParams = useSearchParams()
	const comicIssueId = searchParams.get('id') || ''
	const nextPage = `${RoutePath.ComicIssueUploadPages}?id=${comicIssueId}`

	const {
		register,
		setValue,
		handleSubmit: onSubmit,
	} = useForm<UpdateComicIssueFilesData>({
		defaultValues: {
			signature: undefined,
			pdf: undefined,
		},
		resolver: yupResolver(uploadComicIssueAssetsValidationSchema) as Resolver<UpdateComicIssueFilesData>,
	})
	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const { mutateAsync: updateComicIssueFiles } = useUpdateComicIssueFiles(comicIssueId)
	const signatureCanvasRef = useRef<ReactSignatureCanvas>(null)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		onSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: UpdateComicIssueFilesData) => {
		const formData = new FormData()

		if (data.signature) formData.append('signature', data.signature)
		if (data.pdf) formData.append('pdf', data.pdf)

		await updateComicIssueFiles(formData)
		router.push(nextPage)
	}

	const handleFormError = (errors: FieldErrors<CreateComicIssueData>) => {
		const [_, errorValue] = Object.entries(errors)[0]

		console.log(errors, errorValue)
	}

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload covers', isActive: false },
					{ label: '03 Upload assets', isActive: true },
					{ label: '04 Upload pages', isActive: false },
					{ label: '05 Publish', isActive: false },
				]}
			/>

			<main>
				<Form padding maxSize='sm' fullWidth className='form--edit-comic-issue-assets'>
					<Grid container spacing={2}>
						<Grid item xs={12} md={12}>
							<Label tooltipText={signatureTooltipText}>Signature</Label>
							<p className='description'>Upload a signature image which would be used to sign comic copies</p>
							<div className='comic-issue-signature-input-wrapper'>
								{/* <SkeletonImage src={comicIssue?.cover} alt='' fill className='cover-image' />
								<SignatureCanvas
									ref={signatureCanvasRef}
									penColor='black'
									canvasProps={{
										className: 'signature-canvas',
										width: 690,
										height: 1000,
									}}
								/> */}
								<FileUpload
									id='signature-upload'
									label='Choose a picture 380x240px'
									className='comic-issue-signature-input'
									onUpload={(files) => {
										setValue('signature', files[0]?.file)
									}}
									ref={register('signature').ref}
									options={{ accept: transparentImageTypes, maxFiles: 1 }}
								/>
							</div>
							{/* <ButtonLink href={signatureCanvasRef.current?.toDataURL() || ''} download>
								DOWNLOAD
							</ButtonLink> */}
						</Grid>

						<Grid item xs={12} md={12}>
							<Label isRequired tooltipText={pdfTooltipText}>
								Comic PDF
							</Label>
							<p className='description'>PDF file of the comic episode</p>
							<FileUpload
								id='pdf-upload'
								label='Choose a PDF file'
								className='comic-issue-pdf-input'
								onUpload={(files) => {
									setValue('pdf', files[0]?.file)
								}}
								ref={register('pdf').ref}
								options={{ accept: pdfType, maxFiles: 1 }}
							/>
						</Grid>
					</Grid>

					{/* also offer a "back" button on all these steps */}
					{/* TODO: this should either ask "Advanced cover edit" or "Next" */}
					<FormActions marginTop>
						<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
