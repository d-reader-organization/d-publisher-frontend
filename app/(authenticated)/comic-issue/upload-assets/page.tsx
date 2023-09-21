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

const pdfTooltipText = `This file will be used for offline reading when users want to download offline content

Furthermore, if your comic issue is an NFT collection, this pdf file will be attached the each NFT from the collection to guarantee the ownership of the content to collectors.
`

export default function UploadComicIssueAssetsPage() {
	const router = useRouter()

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

		onSubmit(handleFormSubmit)()
	}

	const handleFormSubmit = async (data: UpdateComicIssueFilesData) => {
		const formData = new FormData()

		if (data.signature) formData.append('signature', data.signature)
		if (data.pdf) formData.append('pdf', data.pdf)

		await updateComicIssueFiles(formData)
		router.push(nextPage)
	}

	// TODO: handle client-side form errors across the app
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
				<Form padding minSize='md' className='form--edit-comic-issue-assets'>
					<div className='comic-issue-file-container'>
						<Label
							isRequired
							tooltipText='.png format required, this signature will be used when signing a digital copy'
						>
							Signature
						</Label>
						<FileUpload
							id='signature-upload'
							label='Choose a picture 500x1000px'
							className='comic-issue-signature-input'
							onUpload={(files) => {
								setValue('signature', files[0].file)
							}}
							ref={register('signature').ref}
						/>
					</div>
					<div className='comic-issue-file-container'>
						<Label isRequired tooltipText={pdfTooltipText}>
							PDF
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
					</div>

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
