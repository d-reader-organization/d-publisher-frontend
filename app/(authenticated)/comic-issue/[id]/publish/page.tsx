/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import { useToaster } from '@/providers/ToastProvider'
import { yupRequiredMessage } from '@/utils/error'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useUpdateComicIssuePages } from '@/api/comicIssue'

export default function PublishComicIssuePage() {
	const toaster = useToaster()
	const router = useRouter()
	const params = useParams()
	const comicIssueId = params['id'] || ''
	const nextPage = RoutePath.ComicIssuePublish(comicIssueId)

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
					<p>Thanks for publishing your comic episode 🎉</p>
					<p>We&apos;ll review it soon and get back to you</p>
					{/* <FormActions marginTop>
						<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions> */}
				</Form>
			</main>
		</>
	)
}
