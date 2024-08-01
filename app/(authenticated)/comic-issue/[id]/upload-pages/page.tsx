'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from 'components/layout/Header'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from '@/providers/ToastProvider'
import { yupRequiredMessage } from '@/utils/error'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useUpdateComicIssuePages, useUpdateComicIssuePdf } from '@/api/comicIssue'
import { comicIssuePagesTooltipText, numberOfPagesTooltipText, pdfTooltipText } from '@/constants/tooltips'
import FileUpload, { UploadedFile } from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import IntegerInput from '@/components/forms/IntegerInput'
import Label from '@/components/forms/Label'
import { optimalImageTypes, pdfType } from '@/constants/fileTypes'
import { Resolver, useForm } from 'react-hook-form'
import { UpdateComicIssueFilesData } from 'models/comicIssue'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadComicIssuePdfValidationSchema } from '@/components/forms/schemas'
import HintDrawer from '@/components/layout/HintDrawer'
import FormFaqItems from '@/components/layout/FormFaqItem'
import { UPLOAD_COMIC_ISSUE_PAGES_FAQ } from '@/constants/hints'
// import SignatureCanvas from 'react-signature-canvas'
// import SkeletonImage from '@/components/SkeletonImage'

interface Params {
	id: string | number
}

export default function UploadComicIssuePagesPage({ params }: { params: Params }) {
	const toaster = useToaster()
	const router = useRouter()
	const comicIssueId = params.id || ''
	const nextPage = RoutePath.ComicIssueSubmitted(comicIssueId)

	const [pageFiles, setPageFiles] = useState<File[]>([])
	const [numberOfPreviewPages, setNumberOfPreviewPages] = useState(3)
	const { mutateAsync: updatePages } = useUpdateComicIssuePages(comicIssueId)
	const { mutateAsync: updateComicIssuePdf } = useUpdateComicIssuePdf(comicIssueId)

	const { register, setValue, handleSubmit } = useForm<UpdateComicIssueFilesData>({
		defaultValues: {
			pdf: undefined,
		},
		resolver: yupResolver(uploadComicIssuePdfValidationSchema) as Resolver<UpdateComicIssueFilesData>,
	})

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	const handleUploadPages = (pageFiles: File[]) => {
		setPageFiles(pageFiles)
	}

	const handleUploadPdf = async (data: UpdateComicIssueFilesData) => {
		const formData = new FormData()

		if (data.pdf) formData.append('pdf', data.pdf)

		await updateComicIssuePdf(formData)
	}

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		await handleSubmit(handleUploadPdf, toaster.onFormError)()

		if (pageFiles.length === 0) {
			toaster.add(yupRequiredMessage('Issue pages'), 'error')
			return
		}

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
		router.push(nextPage)
	}

	const onUploadPdf = (uploadedFiles: UploadedFile[]) => {
		const file = uploadedFiles[0]?.file
		setValue('pdf', file);

		const pdfSize = Math.ceil(file.size/(1024*1024))
		if(pdfSize > 100){
			toaster.add("Pdf size is above 100 mb, try compressing files", 'error');
			return;
		}
	}

	const onUploadPages = (uploadedFiles: UploadedFile[]) => {
		let totalSize = 0;
			uploadedFiles.forEach(data=>totalSize += data.file.size);
			totalSize = Math.ceil(totalSize / (1024*1024));

			if(totalSize > 100){
				toaster.add("Total size of pages are above 100 mb, try compressing files", 'error');
				return;
			}

		handleUploadPages(uploadedFiles.map((file) => file.file))
		setNumberOfPreviewPages((currentValue) => {
			if (currentValue > uploadedFiles.length) return uploadedFiles.length
			return currentValue
		})
	}

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload covers', isActive: false },
					{ label: '03 Upload pages', isActive: true },
					{ label: '04 Submitted', isActive: false },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<Form padding fullWidth className='form--edit-comic-issue-pages'>
					<Label isRequired tooltipText={pdfTooltipText}>
						PDF File
					</Label>
					<FileUpload
						id='pdf-upload'
						label='Choose a PDF file'
						className='comic-issue-pdf-input'
						onUpload={onUploadPdf}
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
						Add issue pages
					</Label>
					<FileUpload
						sortable
						allowMultipleFiles
						id='pages-upload'
						className='upload-pages'
						label={`Upload pages\nImages should have at least 1024x1484px`}
						onUpload={onUploadPages}
						options={{ accept: optimalImageTypes }}
					/>

					<FormActions marginTop>
						<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>

				<HintDrawer>
					<FormFaqItems items={UPLOAD_COMIC_ISSUE_PAGES_FAQ} />
				</HintDrawer>
			</main>
		</>
	)
}
