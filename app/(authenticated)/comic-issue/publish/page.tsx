'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Label from 'components/Label'
import Button from 'components/Button'
import Steps from 'components/Steps'
import FileUpload from '@/components/FileUpload'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from '@/providers/ToastProvider'
import { yupRequiredMessage } from '@/utils/error'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useUpdateComicIssuePages } from '@/api/comicIssue'

export default function PublishComicIssuePage() {
	const toaster = useToaster()
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicIssueId = searchParams.get('id') || ''
	const nextPage = `${RoutePath.ComicIssuePublish}?id=${comicIssueId}`

	const [pageFiles, setPageFiles] = useState<File[]>([])
	const { mutateAsync: updatePages } = useUpdateComicIssuePages(comicIssueId)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	const handleUploadPages = (pageFiles: File[]) => {
		setPageFiles(pageFiles)
	}

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		if (pageFiles.length === 0) {
			toaster.add(yupRequiredMessage('Issue pages'), 'error')
			return
		}

		const formData = new FormData()

		const numberOfPreviewPages = 3
		let i = 0
		for (const pageFile of pageFiles) {
			const pageNumber = i + 1
			if (pageFile) formData.append(`pages[${i}][image]`, pageFile)
			formData.append(`pages[${i}][pageNumber]`, pageNumber.toString())
			formData.append(`pages[${i}][isPreviewable]`, (pageNumber < numberOfPreviewPages).toString())
			i = i + 1
		}

		await updatePages(formData)
		router.push(nextPage)
	}

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload covers', isActive: false },
					{ label: '03 Upload assets', isActive: false },
					{ label: '04 Upload pages', isActive: false },
					{ label: '05 Publish', isActive: true },
				]}
			/>

			<main>
				<Form padding className='form--edit-comic-issue-pages'>
					<Label isRequired tooltipText='optimized .jpg or .jpeg formats preferred for optimal download speed'>
						Add issue pages
					</Label>
					<FileUpload
						id='pages-upload'
						allowMultipleFiles
						className='upload-pages'
						label='Upload multiple images'
						onUpload={(uploadedFiles) => {
							handleUploadPages(uploadedFiles.map((file) => file.file))
						}}
					/>

					<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
						Next <ArrowRightIcon className='action-button-icon' />
					</Button>
				</Form>
			</main>
		</>
	)
}
