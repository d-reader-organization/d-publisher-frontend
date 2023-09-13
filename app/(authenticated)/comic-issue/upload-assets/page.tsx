'use client'

import { useEffect, useState } from 'react'
import { FieldErrors } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Label from 'components/Label'
import Button from 'components/Button'
import Input from 'components/Input'
import Steps from 'components/Steps'
import Select from 'components/Select'
import Expandable from '@/components/Expandable'
import FileUpload from '@/components/FileUpload'
import Checkbox from '@/components/Checkbox'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { CreateComicIssueData } from 'models/comicIssue'
import { useToaster } from '@/providers/ToastProvider'
import { CreateStatelessCoverData } from '@/models/comicIssue/statelessCover'
import { NO_RARITIES, THREE_RARITIES, FIVE_RARITIES } from '@/constants/rarities'
import { generateRequiredArrayElementErrorMessage } from '@/utils/error'
import { ComicRarity } from '@/enums/comicRarity'
import { cloneDeep } from 'lodash'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'

export default function UploadComicIssueAssetsPage() {
	const toaster = useToaster()
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicId = searchParams.get('comicId') || ''

	const [issueCovers, setIssueCovers] = useState<CreateStatelessCoverData[]>([])
	const [numberOfRarities, setNumberOfRarities] = useState(3)

	useAuthenticatedRoute()

	useEffect(() => {
		const newIssueCovers: CreateStatelessCoverData[] = []

		newIssueCovers.push(
			...(
				(numberOfRarities === 1 && NO_RARITIES) ||
				(numberOfRarities === 3 && THREE_RARITIES) ||
				(numberOfRarities === 5 && FIVE_RARITIES) ||
				[]
			).map((rarity) => ({
				rarity,
				artist: '',
				isDefault: false,
				image: '',
			}))
		)

		setIssueCovers(newIssueCovers)
	}, [numberOfRarities])

	const handleNextClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some((issueCover) => issueCover.image === '')
		const noDefaultCover = issueCovers.every((issueCover) => !issueCover.isDefault)

		if (unsetArtist) {
			toaster.add(generateRequiredArrayElementErrorMessage('artist'), 'error')
			return
		}
		if (unsetImage) {
			toaster.add(generateRequiredArrayElementErrorMessage('image'), 'error')
			return
		}
		if (noDefaultCover) {
			toaster.add('Default cover must be selected', 'error')
			return
		}

		toaster.add('Successfuly uploaded issue assets', 'success')
		router.push(`/comic/${comicId}/issue/upload-pages`)
	}

	const handleChangeCoverImage = (rarity: ComicRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.image = value
			return deepClonedIssueCovers
		})
	}

	const handleChangeArtist = (rarity: ComicRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.artist = value
			return deepClonedIssueCovers
		})
	}

	const handleChangeIsDefault = (rarity: ComicRarity, value: boolean) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			const defaultIssueCover = deepClonedIssueCovers.find((issueCover) => issueCover.isDefault)
			if (defaultIssueCover) defaultIssueCover.isDefault = false
			issueCoverToUpdate.isDefault = value
			return deepClonedIssueCovers
		})
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
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Publish', isActive: false },
				]}
			/>

			<main>
				<form className='form form--md form--edit-comic-issue-assets'>
					<Label isRequired tooltipText='Some tooltip text'>
						Issue Covers
					</Label>
					<Label>Cover variants (rarities)</Label>
					<Select
						options={[
							{ label: 'no rarities', value: '1' },
							{ label: '3 rarities', value: '3' },
							{ label: '5 rarities', value: '5' },
						]}
						defaultSelectedOptions={[{ label: '3 rarities', value: '3' }]}
						onSelect={(selectedOptions) => {
							setNumberOfRarities(+selectedOptions[0]?.value ?? 0)
						}}
						placeholder='Number of rarities'
						className='rarities-select'
					/>
					{issueCovers.map(({ rarity, artist, isDefault }) => (
						<Expandable title={rarity} key={rarity}>
							<div className='rarity-cover-wrapper'>
								<div>
									<Label isRequired tooltipText='Some info'>
										Cover image
									</Label>
									<FileUpload
										id={`${rarity}-cover`}
										className='cover-image-upload'
										onUpload={(urls) => {
											handleChangeCoverImage(rarity, urls[0] ?? '')
										}}
									/>
								</div>
								<div>
									<Label isRequired>Artist of a cover image</Label>
									<Input onChange={(event) => handleChangeArtist(rarity, event.target.value)} value={artist} />
									<div className='default-issue-checkbox-wrapper'>
										<Checkbox
											className='default-issue-checkbox'
											onChange={(event) => {
												handleChangeIsDefault(rarity, event.target.checked)
											}}
											checked={isDefault}
										/>
										Set as default issue cover
									</div>
								</div>
							</div>
						</Expandable>
					))}

					<div className='actions'>
						<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</div>
				</form>
			</main>
		</>
	)
}
