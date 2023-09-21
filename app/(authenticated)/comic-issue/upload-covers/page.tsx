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
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'
import { useUpdateComicIssueStatelessCovers } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'

const coverVariantsTooltipText = `Comic episodes can have up to 5 rarities. You might opt into:
- no rarities
- 3 rarities (common, rare, legendary)
- 5 rarities (common, uncommon, rare, epic, legendary)

Ideally, these rarities would represent variants done by different featured cover artists`

export default function UploadComicIssueCoversPage() {
	const toaster = useToaster()
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicIssueId = searchParams.get('id') || ''
	const nextPage = `${RoutePath.ComicIssueUploadAssets}?id=${comicIssueId}`

	const [issueCovers, setIssueCovers] = useState<CreateStatelessCoverData[]>([])
	const [numberOfRarities, setNumberOfRarities] = useState(1)

	const { mutateAsync: updateStatelessCovers } = useUpdateComicIssueStatelessCovers(comicIssueId)

	usePrefetchRoute(nextPage)
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
				image: undefined,
			}))
		)

		setIssueCovers(newIssueCovers)
	}, [numberOfRarities])

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some((issueCover) => issueCover.image === undefined)
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

		const formData = new FormData()

		let i = 0
		for (const cover of issueCovers) {
			if (cover.image) formData.append(`covers[${i}][image]`, cover.image)
			formData.append(`covers[${i}][artist]`, cover.artist)
			formData.append(`covers[${i}][isDefault]`, cover.isDefault.toString())
			formData.append(`covers[${i}][rarity]`, cover.rarity)
			i = i + 1
		}

		await updateStatelessCovers(formData)
		router.push(nextPage)
	}

	const handleChangeCoverImage = (rarity: ComicRarity, value: File) => {
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
					{ label: '02 Upload covers', isActive: true },
					{ label: '03 Upload assets', isActive: false },
					{ label: '04 Upload pages', isActive: false },
					{ label: '05 Publish', isActive: false },
				]}
			/>

			<main>
				<Form padding minSize='md' className='form--edit-comic-issue-covers'>
					<Label isRequired tooltipText={coverVariantsTooltipText}>
						Issue Covers
					</Label>
					<Label>Cover variants (rarities)</Label>
					<Select
						options={[
							{ label: 'no rarities', value: '1' },
							{ label: '3 rarities', value: '3' },
							{ label: '5 rarities', value: '5' },
						]}
						defaultSelectedOptions={[{ label: 'no rarities', value: '1' }]}
						onSelect={(selectedOptions) => {
							setNumberOfRarities(+selectedOptions[0]?.value ?? 0)
						}}
						unselectableIfAlreadySelected
						placeholder='Number of rarities'
						className='rarities-select'
					/>
					{issueCovers.map(({ rarity, artist, isDefault }) => (
						<Expandable title={rarity} key={rarity}>
							<div className='rarity-cover-wrapper'>
								<div>
									<Label isRequired tooltipText='.jpg or .jpeg formats preferred, .png allowed'>
										Cover image
									</Label>
									<FileUpload
										id={`${rarity}-cover`}
										className='cover-image-upload'
										onUpload={(files) => {
											handleChangeCoverImage(rarity, files[0].file ?? '')
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
