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

export default function UploadComicIssuePagesPage() {
	const toaster = useToaster()
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicId = searchParams.get('comicId') || ''

	const [imageUrls, setImageUrls] = useState<string[]>([])

	useAuthenticatedRoute()

	const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		if (imageUrls.length === 0) {
			toaster.add(yupRequiredMessage('Issue pages'), 'error')
			return
		}

		toaster.add('Successfuly uploaded issue pages', 'success')
		router.push(`/comic/${comicId}/issue/publish`)
	}

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Upload pages', isActive: true },
					{ label: '04 Publish', isActive: false },
				]}
			/>

			<main>
				<form className='form form--edit-comic-issue-pages'>
					<Label isRequired tooltipText='some info'>
						Add issue pages
					</Label>
					<FileUpload
						id='pages-upload'
						allowMultipleFiles
						className='upload-pages'
						label='Upload multiple images'
						onUpload={(urls) => setImageUrls(urls)}
					/>

					<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
						Next <ArrowRightIcon className='action-button-icon' />
					</Button>
				</form>
			</main>
		</>
	)
}
