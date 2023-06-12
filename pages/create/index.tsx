import { NextPage } from 'next'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Input from 'components/Input'
import Label from 'components/Label'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import GenrePlaceholder from 'public/assets/vector-icons/genre-placeholder.svg'
import FileUpload from 'components/FileUpload'
import Checkbox from 'components/Checkbox'
import Button from 'components/Button'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useForm } from 'react-hook-form'
import { SelectOption } from 'types/SelectOption'
import { AudienceType } from 'enums/audienceType'
import { CurrentStatus } from 'enums/currentStatus'

const CreatePage: NextPage = () => {
	const { register, setValue } = useForm({
		defaultValues: {
			title: '',
			genres: [] as SelectOption[],
			audienceType: null as AudienceType | null,
			currentStatus: null as CurrentStatus | null,
			logo: null as string | null,
			banner: null as string | null,
			description: '',
			flavourText: '',
			website: '',
			twitter: '',
			discord: '',
			instagram: '',
			ownershipConfirmation: false,
			authorRegistradionAndUploadingAgreement: false,
		},
	})

	const handleSaveAndClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
	}

	const handleSaveAndAddIssue = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
	}

	return (
		<Publisher>
			<Header title='Create Comic' />
			<Steps
				steps={[
					{ label: '01 Create Comic', isActive: true },
					{ label: '02 Add Issue', isActive: false },
					{ label: '03 Publish', isActive: false },
				]}
			/>
			<form className='form'>
				<Label isRequired>Comic title</Label>
				<Input {...register('title', { required: true, minLength: 3, maxLength: 20 })} />
				<Label isRequired>Genres</Label>
				<Select
					isSearchable
					isMultipleSelect
					placeholder='Search genres...'
					options={[
						{ label: 'Manga', value: 'manga', icon: <GenrePlaceholder /> },
						{ label: 'Adventure', value: 'adventure', icon: <GenrePlaceholder /> },
						{ label: 'Horror', value: 'horror', icon: <GenrePlaceholder /> },
					]}
					onSelect={(selectedOptions) => {
						setValue('genres', selectedOptions)
					}}
				/>
				<div className='audience-status-wrapper'>
					<div className='audience-status-container'>
						<Label isRequired>Audience Type</Label>
						<Select
							className='audience-status-input'
							placeholder='Mature / Teen / Young / All'
							options={[
								{ label: 'Mature', value: 'mature' },
								{ label: 'Teen', value: 'teen' },
								{ label: 'Young', value: 'young' },
								{ label: 'All', value: 'all' },
							]}
							onSelect={(selectedOptions) => {
								if (!selectedOptions[0]) return
								setValue('audienceType', selectedOptions[0].value as AudienceType)
							}}
						/>
					</div>
					<div className='audience-status-container'>
						<Label isRequired>Current Status</Label>
						<Select
							className='audience-status-input'
							placeholder='On going / Finished'
							options={[
								{ label: 'On going', value: 'ongoing' },
								{ label: 'Finished', value: 'finished' },
							]}
							onSelect={(selectedOptions) => {
								if (!selectedOptions[0]) return
								setValue('currentStatus', selectedOptions[0].value as CurrentStatus)
							}}
						/>
					</div>
				</div>
				<div className='comic-file-wrapper'>
					<div className='comic-file-container'>
						<Label isRequired>Comic Logo</Label>
						<FileUpload
							label='Choose a picture 200x280px'
							className='comic-logo-input'
							onUpload={(url) => {
								setValue('logo', url)
							}}
						/>
					</div>
					<div className='comic-file-container'>
						<Label isRequired>Comic Banner</Label>
						<FileUpload
							label='Choose a picture 557x280px'
							className='comic-banner-input'
							onUpload={(url) => {
								setValue('banner', url)
							}}
						/>
					</div>
				</div>
				<Label isRequired>Description</Label>
				<Textarea
					maxCharacters={200}
					rows={5}
					{...register('description', { required: true, minLength: 3, maxLength: 200 })}
				/>
				<Label>Flavour text</Label>
				<Textarea maxCharacters={60} rows={1} {...register('description', { required: false, maxLength: 60 })} />
				<Label className='group-label'>Additional Links</Label>
				<Label size='small'>Website</Label>
				<Input {...register('website', { required: false, minLength: 3, maxLength: 20 })} />
				<div className='social-media-wrapper'>
					<div className='social-media-container'>
						<Label size='small'>Twitter</Label>
						<Input {...register('twitter', { required: false, minLength: 3, maxLength: 20 })} />
					</div>
					<div className='social-media-container'>
						<Label size='small'>Discord</Label>
						<Input {...register('discord', { required: false, minLength: 3, maxLength: 20 })} />
					</div>
					<div className='social-media-container'>
						<Label size='small'>Instagram</Label>
						<Input {...register('instagram', { required: false, minLength: 3, maxLength: 20 })} />
					</div>
				</div>
				<div className='checkmark-row'>
					<Checkbox />
					<span className='checkmark-text'>I confirm that this Comic is created by myself and belongs to me.</span>
				</div>
				<div className='checkmark-row'>
					<Checkbox />
					<span className='checkmark-text'>
						I agree to dReader’s{' '}
						<span className='checkmark-text--highlighted'>Author Registration and Uploading Agreement</span>
					</span>
				</div>
				<div className='actions'>
					<Button onClick={handleSaveAndClose} color='transparent' className='action-button'>
						Save & Close
					</Button>
					<Button onClick={handleSaveAndAddIssue} color='grey-100' className='action-button'>
						Save & Add Issue <ArrowRightIcon className='action-button-icon' />
					</Button>
				</div>
			</form>
		</Publisher>
	)
}

export default CreatePage
