import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { cloneDeep } from 'lodash'

import Steps from 'components/Steps'
import Label from 'components/Label'
import Publisher from 'components/layout/Publisher'
import Select from 'components/Select'
import FileUpload from 'components/FileUpload'
import Expandable from 'components/Expandable'
import Input from 'components/Input'
import Checkbox from 'components/Checkbox'
import Header from 'components/layout/Header'
import { IssueCover } from 'models/issueCover'
import Button from 'components/Button'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from 'providers/ToastProvider'
import { generateRequiredArrayElementErrorMessage } from 'utils/error'
import { CoverRarity } from 'models/coverRarity'

import { FIVE_RARITIES, THREE_RARITIES } from './constants'

const UploadAssetsPage: NextPage = () => {
	const toaster = useToaster()
	const router = useRouter()
	const [issueCovers, setIssueCovers] = useState<IssueCover[]>([])
	const [numberOfRarities, setNumberOfRarities] = useState(3)

	useEffect(() => {
		const newIssueCovers: IssueCover[] = []

		newIssueCovers.push(
			...((numberOfRarities === 3 && THREE_RARITIES) || (numberOfRarities === 5 && FIVE_RARITIES) || []).map(
				(rarity) => ({
					rarity,
					artist: '',
					isDefault: false,
					image: '',
				})
			)
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
		router.push(`/comic/${router.query.comicId}/issue/upload-pages`)
	}

	const handleChangeCoverImage = (rarity: CoverRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.image = value
			return deepClonedIssueCovers
		})
	}

	const handleChangeArtist = (rarity: CoverRarity, value: string) => {
		setIssueCovers((currentIssueCovers) => {
			const deepClonedIssueCovers = cloneDeep(currentIssueCovers)
			const issueCoverToUpdate = deepClonedIssueCovers.find((issueCover) => issueCover.rarity === rarity)
			if (!issueCoverToUpdate) return currentIssueCovers
			issueCoverToUpdate.artist = value
			return deepClonedIssueCovers
		})
	}

	const handleChangeIsDefault = (rarity: CoverRarity, value: boolean) => {
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
		<Publisher>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Publish', isActive: false },
				]}
			/>
			<form className='form'>
				<Label isRequired tooltipText='Some tooltip text'>
					Issue Covers
				</Label>
				<Label>Cover variants (rarities)</Label>
				<Select
					options={[
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
				<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
					Next <ArrowRightIcon className='action-button-icon' />
				</Button>
			</form>
		</Publisher>
	)
}

export default UploadAssetsPage
