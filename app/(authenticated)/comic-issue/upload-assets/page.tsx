'use client'

import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Label from 'components/Label'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { CreateComicIssueData, UpdateComicIssueFilesData } from 'models/comicIssue'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useUpdateComicIssueFiles } from '@/api/comicIssue/queries/useUpdateComicIssueFiles'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadAssetsValidationSchema } from '../schemas'
import FileUpload from '@/components/FileUpload'
import { useToaster } from '@/providers/ToastProvider'
import { signatureTooltipText, pdfTooltipText } from '@/constants/tooltips'

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
		resolver: yupResolver(uploadAssetsValidationSchema) as Resolver<UpdateComicIssueFilesData>,
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
				<Form padding maxSize='md' fullWidth className='form--edit-comic-issue-assets'>
					<Label isRequired tooltipText={signatureTooltipText}>
						Signature
					</Label>
					<FileUpload
						id='signature-upload'
						label='Choose a picture 380x240px'
						className='comic-issue-signature-input'
						onUpload={(files) => {
							setValue('signature', files[0].file)
						}}
						ref={register('signature').ref}
					/>
					<Label isRequired tooltipText={pdfTooltipText}>
						Comic PDF
					</Label>
					<FileUpload
						id='pdf-upload'
						label='Choose a PDF file'
						className='comic-issue-pdf-input'
						onUpload={(files) => {
							setValue('pdf', files[0].file)
						}}
						ref={register('pdf').ref}
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
