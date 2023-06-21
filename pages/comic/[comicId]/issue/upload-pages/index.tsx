import { NextPage } from 'next'
import { useState } from 'react'

import Steps from 'components/Steps'
import Header from 'components/layout/Header'
import Publisher from 'components/layout/Publisher'
import Label from 'components/Label'
import FileUpload from 'components/FileUpload'
import Button from 'components/Button'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from 'providers/ToastProvider'
import { generateRequiredErrorMessage } from 'utils/error'
import { useRouter } from 'next/router'

const PublishIssue: NextPage = () => {
	const toaster = useToaster()
	const router = useRouter()
	const [imageUrls, setImageUrls] = useState<string[]>([])

	const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		if (imageUrls.length === 0) {
			toaster.add(generateRequiredErrorMessage('Issue pages'), 'error')
			return
		}

		toaster.add('Successfuly uploaded issue pages', 'success')
		router.push(`/comic/${router.query.comicId}/issue/publish`)
	}

	return (
		<Publisher>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Upload pages', isActive: true },
					{ label: '04 Publish', isActive: true },
				]}
			/>
			<form className='form'>
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
		</Publisher>
	)
}

export default PublishIssue
