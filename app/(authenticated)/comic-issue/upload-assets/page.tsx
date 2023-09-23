'use client'

import { FieldErrors, Resolver, useForm } from 'react-hook-form'
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
	const { mutateAsync: updateComicIssueFiles } = useUpdateComicIssueFiles(comicIssueId)

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
					<Label isRequired tooltipText={signatureTooltipText}>
						Signature
					</Label>
					<p className='description'>Your personal signature which will be used when signing digital copies.</p>
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
					<Label isRequired tooltipText={pdfTooltipText}>
						Comic PDF
					</Label>
					<p className='description'>PDF file of the comic episode which will be used for offline reading</p>
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
