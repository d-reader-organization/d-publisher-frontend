'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import Steps from 'components/Steps'
import Expandable from '@/components/Expandable'
import Checkbox from '@/components/Checkbox'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from '@/providers/ToastProvider'
import { CreateStatelessCoverData } from '@/models/comicIssue/statelessCover'
import { getRarityShares } from '@/constants/rarities'
import { generateRequiredArrayElementErrorMessage } from '@/utils/error'
import { ComicRarity } from '@/enums/comicRarity'
import { cloneDeep } from 'lodash'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useUpdateComicIssueStatelessCovers } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import {
	issueCoverImageTooltipText,
	coverVariantsTooltipText,
	issueCoverVariantsPreviews,
	issueCoverPreviews,
	handleTooltipText,
} from '@/constants/tooltips'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Select from '@/components/forms/Select'
import { imageTypes } from '@/constants/fileTypes'
import { RARITY_SELECT_OPTIONS, findOptions } from '@/constants/selectOptions'
import HintDrawer from '@/components/layout/HintDrawer'
import HintWithImage from '@/components/HintWithImage'
import { Box } from '@mui/material'
import { isASocialHandle } from '@/utils/helpers'

interface Params {
	id: string | number
}

export default function UploadComicIssueStatelessCoversPage({ params }: { params: Params }) {
	const toaster = useToaster()
	const router = useRouter()
	const comicIssueId = params.id || ''
	const nextPage = RoutePath.ComicIssueUploadPages(comicIssueId)

	const [issueCovers, setIssueCovers] = useState<CreateStatelessCoverData[]>([])
	const [numberOfRarities, setNumberOfRarities] = useState(1)

	const { mutateAsync: updateStatelessCovers } = useUpdateComicIssueStatelessCovers(comicIssueId)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	useEffect(() => {
		const newIssueCovers: CreateStatelessCoverData[] = getRarityShares(numberOfRarities).map((rarity) => ({
			rarity,
			artist: '',
			artistTwitterHandle: '',
			isDefault: false,
			image: undefined,
		}))

		setIssueCovers(newIssueCovers)
	}, [numberOfRarities])

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some((issueCover) => issueCover.image === undefined)
		const noDefaultCover = issueCovers.every((issueCover) => !issueCover.isDefault)
		const isNotASocialHandle = issueCovers.some((issueCover) =>
			issueCover.artistTwitterHandle ? !isASocialHandle(issueCover.artistTwitterHandle) : false
		)

		if (unsetArtist) {
			toaster.add(generateRequiredArrayElementErrorMessage('artist'), 'error')
		} else if (unsetImage) {
			// TODO: this error was thrown to the Star Atlas guys for some reason.
			// maybe it has something to do with changing number of rarities...
			toaster.add(generateRequiredArrayElementErrorMessage('image'), 'error')
		} else if (noDefaultCover) {
			toaster.add('Default cover must be selected', 'error')
		} else if (isNotASocialHandle) {
			toaster.add('Only Twitter handle is required', 'error')
		} else {
			const formData = new FormData()

			let i = 0
			for (const cover of issueCovers) {
				if (cover.image) formData.append(`covers[${i}][image]`, cover.image)
				formData.append(`covers[${i}][artist]`, cover.artist)
				formData.append(`covers[${i}][isDefault]`, cover.isDefault.toString())
				formData.append(`covers[${i}][rarity]`, cover.rarity)
				formData.append(`covers[${i}][artistTwitterHandle]`, cover.artistTwitterHandle ?? '')
				i = i + 1
			}

			await updateStatelessCovers(formData)
			router.push(nextPage)
		}
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

	const handleChangeArtistTwitterHandle = (rarity: ComicRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.artistTwitterHandle = value
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

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload covers', isActive: true },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Submitted', isActive: false },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<Form padding maxSize='md' fullWidth className='form--edit-comic-issue-covers'>
					<Label isRequired tooltipText={coverVariantsTooltipText}>
						Cover rarities
					</Label>
					<Select
						options={RARITY_SELECT_OPTIONS}
						defaultSelectedOptions={findOptions(RARITY_SELECT_OPTIONS, '1')}
						onSelect={(selectedOptions) => {
							setNumberOfRarities(+selectedOptions[0]?.value ?? 0)
						}}
						unselectableIfAlreadySelected
						placeholder='Number of rarities'
						className='rarities-select'
					/>
					{issueCovers.map(({ rarity, artist, isDefault, artistTwitterHandle }) => (
						<Expandable open={issueCovers.length === 1} title={rarity} key={rarity}>
							<div className='rarity-cover-wrapper'>
								<div>
									<Label isRequired tooltipText={issueCoverImageTooltipText}>
										Cover image
									</Label>
									<FileUpload
										id={`${rarity}-cover`}
										label='Choose a picture 1024x1484px'
										className='cover-image-upload'
										onUpload={(files) => {
											handleChangeCoverImage(rarity, files[0]?.file ?? '')
										}}
										options={{ accept: imageTypes, maxFiles: 1 }}
									/>
								</div>
								<div>
									<div>
										<Label isRequired>Artist of a cover image</Label>
										<Input onChange={(event) => handleChangeArtist(rarity, event.target.value)} value={artist} />
									</div>
									<div>
										<Label tooltipText={handleTooltipText}>Artist&apos;s Twitter Handle</Label>
										<Input
											prefix='@'
											onChange={(event) => handleChangeArtistTwitterHandle(rarity, event.target.value)}
											value={artistTwitterHandle}
										/>
									</div>

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

				<HintDrawer>
					<Box>
						<Expandable title='Cover & rarities'>
							<HintWithImage previews={issueCoverVariantsPreviews} text={coverVariantsTooltipText} />
						</Expandable>
						<Expandable title='Cover'>
							<HintWithImage previews={issueCoverPreviews} text={issueCoverImageTooltipText} />
						</Expandable>
					</Box>
				</HintDrawer>
			</main>
		</>
	)
}
