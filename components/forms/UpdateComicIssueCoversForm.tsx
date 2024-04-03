'use client'

import React, { useEffect, useState } from 'react'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import Expandable from '@/components/Expandable'
import Checkbox from '@/components/Checkbox'
import { useToaster } from '@/providers/ToastProvider'
import { CreateStatelessCoverData } from '@/models/comicIssue/statelessCover'
import { getRarityShares } from '@/constants/rarities'
import { generateRequiredArrayElementErrorMessage } from '@/utils/error'
import { ComicRarity } from '@/enums/comicRarity'
import { cloneDeep } from 'lodash'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useUpdateComicIssueStatelessCovers } from '@/api/comicIssue'
import { comicIssueCoverImageTooltipText, coverVariantsTooltipText } from '@/constants/tooltips'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Select from '@/components/forms/Select'
import { imageTypes } from '@/constants/fileTypes'
import { RARITY_SELECT_OPTIONS, findOptions } from '@/constants/selectOptions'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'

interface Props {
	comicIssue: RawComicIssue
}

const UpdateComicIssueCoversForm: React.FC<Props> = ({ comicIssue }) => {
	const toaster = useToaster()

	const [issueCovers, setIssueCovers] = useState<CreateStatelessCoverData[]>([])
	const [numberOfRarities, setNumberOfRarities] = useState(comicIssue.statelessCovers.length)

	const { mutateAsync: updateStatelessCovers } = useUpdateComicIssueStatelessCovers(comicIssue.id)

	useAuthenticatedRoute()

	useEffect(() => {
		setNumberOfRarities(numberOfRarities)
		const newIssueCovers: CreateStatelessCoverData[] = getRarityShares(numberOfRarities).map((rarity) => ({
			rarity,
			artist: '',
			isDefault: false,
			image: undefined,
		}))

		setIssueCovers(newIssueCovers)
	}, [numberOfRarities])

	const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some((issueCover) => issueCover.image === undefined)
		const noDefaultCover = issueCovers.every((issueCover) => !issueCover.isDefault)

		if (unsetArtist) {
			toaster.add(generateRequiredArrayElementErrorMessage('artist'), 'error')
		} else if (unsetImage) {
			toaster.add(generateRequiredArrayElementErrorMessage('image'), 'error')
		} else if (noDefaultCover) {
			toaster.add('Default cover must be selected', 'error')
		} else {
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
			<main>
				<Form padding fullWidth className='form--edit-comic-issue-covers'>
					<Label isRequired tooltipText={coverVariantsTooltipText}>
						Comic Issue Covers
					</Label>
					<Label>Reupload Cover variants (rarities)</Label>
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
					{issueCovers.map(({ rarity, artist, isDefault }) => {
						return (
							<div key={rarity}>
								<h2 className='rarity-header'>{rarity}</h2>
								<div className='rarity-cover-wrapper'>
									<div>
										<Label isRequired tooltipText={comicIssueCoverImageTooltipText}>
											Reupload Cover image
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
										<Label isRequired>Artist of a cover image</Label>
										<Input
											onChange={(event) => handleChangeArtist(rarity, event.target.value)}
											value={comicIssue.statefulCovers.find((cover) => cover.artist === artist)?.artist}
											defaultValue={artist}
										/>
										<div className='default-issue-checkbox-wrapper'>
											<Checkbox
												className='default-issue-checkbox'
												onChange={(event) => {
													handleChangeIsDefault(rarity, event.target.checked)
												}}
												checked={isDefault}
												defaultChecked={isDefault}
											/>
											Set as default issue cover
										</div>
									</div>
								</div>
							</div>
						)
					})}
					<FormActions>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
							Update
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}

export default UpdateComicIssueCoversForm
