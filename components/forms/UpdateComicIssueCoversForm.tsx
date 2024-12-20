'use client'

import React, { useCallback, useEffect, useState } from 'react'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import Checkbox from '@/components/Checkbox'
import { useToaster } from '@/providers/ToastProvider'
import { CreateStatelessCoverData, StatelessCover } from '@/models/comicIssue/statelessCover'
import { getRarityShares } from '@/constants/rarities'
import { generateRequiredArrayElementErrorMessage } from '@/utils/error'
import { ComicRarity } from '@/enums/comicRarity'
import { cloneDeep } from 'lodash'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useUpdateComicIssueStatelessCovers } from '@/api/comicIssue'
import { issueCoverImageTooltipText, coverVariantsTooltipText, handleTooltipText } from '@/constants/tooltips'
import FileUpload, { UploadedFile } from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Select from '@/components/forms/Select'
import { imageTypes } from '@/constants/fileTypes'
import { RARITY_SELECT_OPTIONS, findOptions } from '@/constants/selectOptions'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'
import { isASocialHandle } from '@/utils/helpers'

interface Props {
	comicIssue: RawComicIssue
	onUpdate?: VoidFunction
}

const toCreateStatelessCoverData = (statelessCovers: StatelessCover[]): CreateStatelessCoverData[] => {
	const createStatelessCoverData = statelessCovers.map((cover) => {
		return {
			...cover,
			imageSrc: cover.image,
			image: undefined,
		}
	})
	return createStatelessCoverData
}

const UpdateComicIssueCoversForm: React.FC<Props> = ({ comicIssue, onUpdate }) => {
	const toaster = useToaster()

	const [issueCovers, setIssueCovers] = useState<CreateStatelessCoverData[]>(
		toCreateStatelessCoverData(comicIssue.statelessCovers)
	)
	const [numberOfRarities, setNumberOfRarities] = useState(comicIssue.statelessCovers.length)

	const { mutateAsync: updateStatelessCovers } = useUpdateComicIssueStatelessCovers(comicIssue.id)

	useAuthenticatedRoute()

	useEffect(() => {
		setIssueCovers((covers) => {
			const newIssueCovers: CreateStatelessCoverData[] = getRarityShares(numberOfRarities).map((rarity) => {
				const existing = covers.find((existingCover) => existingCover.rarity === rarity)
				return (
					existing ?? {
						rarity,
						artist: '',
						isDefault: false,
						image: undefined,
					}
				)
			})
			return newIssueCovers
		})
	}, [numberOfRarities])

	const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some(
			(issueCover) => issueCover.image === undefined && issueCover.imageSrc === undefined
		)
		const noDefaultCover = issueCovers.every((issueCover) => !issueCover.isDefault)
		const isNotASocialHandle = issueCovers.some((issueCover) =>
			issueCover.artistTwitterHandle ? !isASocialHandle(issueCover.artistTwitterHandle) : false
		)

		if (unsetArtist) {
			toaster.add(generateRequiredArrayElementErrorMessage('artist'), 'error')
		} else if (unsetImage) {
			toaster.add(generateRequiredArrayElementErrorMessage('image'), 'error')
		} else if (noDefaultCover) {
			toaster.add('Default cover must be selected', 'error')
		} else if (isNotASocialHandle) {
			toaster.add('Twitter handle should not contain URLs or @ characters', 'error')
		} else {
			const formData = new FormData()

			let i = 0
			for (const cover of issueCovers) {
				formData.append(
					`covers[${i}][image]`,
					cover.image ? cover.image : (new Blob([new Uint8Array(0)], { type: 'buffer' }) as Blob)
				)
				formData.append(`covers[${i}][artist]`, cover.artist)
				formData.append(`covers[${i}][isDefault]`, cover.isDefault.toString())
				formData.append(`covers[${i}][rarity]`, cover.rarity)
				formData.append(`covers[${i}][artistTwitterHandle]`, cover.artistTwitterHandle ?? '')
				i = i + 1
			}
			await updateStatelessCovers(formData)
		}

		if (typeof onUpdate === "function") onUpdate()
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

	const handleChangeArtistTwitterHandle = (rarity: ComicRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.artistTwitterHandle = value
			return deepClonedIssueCovers
		})
	}

	const onUpload = useCallback((files: UploadedFile[], rarity: ComicRarity) => {
		handleChangeCoverImage(rarity, files[0]?.file ?? '')
	}, [])

	const resizeExpandable = new Event('resize-expandable')

	return (
		<>
			<main>
				<Form padding fullWidth className='form--edit-comic-issue-covers'>
					<Label isRequired tooltipText={coverVariantsTooltipText}>
						Episode covers
					</Label>
					<Select
						options={RARITY_SELECT_OPTIONS}
						defaultSelectedOptions={findOptions(RARITY_SELECT_OPTIONS, comicIssue.statelessCovers.length.toString())}
						onSelect={(selectedOptions) => {
							setNumberOfRarities(+selectedOptions[0]?.value)
							document.dispatchEvent(resizeExpandable)
						}}
						unselectableIfAlreadySelected
						placeholder='Number of rarities'
						className='rarities-select'
					/>
					{issueCovers.map(({ rarity, artist, isDefault, artistTwitterHandle, imageSrc }) => {
						return (
							<div key={rarity}>
								<div className='rarity-cover-wrapper'>
									<div>
										<Label tooltipText={issueCoverImageTooltipText}>{rarity} cover</Label>
										<FileUpload
											id={`${rarity}-cover`}
											label='Choose a picture 1024x1484px'
											className='cover-image-upload'
											onUpload={(files) => onUpload(files, rarity)}
											previewUrl={imageSrc}
											options={{ accept: imageTypes, maxFiles: 1 }}
										/>
									</div>
									<div>
										<div>
											<Label>Cover artist</Label>
											<Input onChange={(event) => handleChangeArtist(rarity, event.target.value)} value={artist} />
										</div>
										<div>
											<Label tooltipText={handleTooltipText}>Artist&apos;s Twitter handle</Label>
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
