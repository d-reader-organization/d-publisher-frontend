import { NextPage } from 'next'
import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'
import Input from 'components/Input'
import Label from 'components/Label'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import GenrePlaceholder from 'public/assets/vector-icons/genre-placeholder.svg'
import FileUpload from 'components/FileUpload'
import Checkbox from 'components/Checkbox'
import Button from 'components/Button'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { SelectOption } from 'types/selectOption'
import { AudienceType } from 'enums/audienceType'
import { CurrentStatus } from 'enums/currentStatus'
import { CreateComicFormData } from 'types/createComicFormData'
import {
	generateMaxLengthErrorMessage,
	generateMinLengthErrorMessage,
	generateNotCheckedErrorMessage,
	generateRequiredErrorMessage,
} from 'utils/error'
import { useToaster } from 'providers/ToastProvider'

const validationSchema = yup.object().shape({
	title: yup
		.string()
		.required(generateRequiredErrorMessage('Title'))
		.min(3, generateMinLengthErrorMessage('title', 3))
		.max(20, generateMaxLengthErrorMessage('title', 20)),
	genres: yup
		.array()
		.of(yup.object({ label: yup.string().required(), value: yup.string().required() }))
		.required(generateRequiredErrorMessage('Genres'))
		.min(1, generateRequiredErrorMessage('Genres')),
	audienceType: yup.string().required(generateRequiredErrorMessage('Audience type')),
	currentStatus: yup.string().required(generateRequiredErrorMessage('Current status')),
	logo: yup.string().required(generateRequiredErrorMessage('Logo')),
	banner: yup.string().required(generateRequiredErrorMessage('Banner')),
	description: yup
		.string()
		.required(generateRequiredErrorMessage('Description'))
		.min(3, generateMinLengthErrorMessage('description', 3))
		.max(200, generateMaxLengthErrorMessage('description', 200)),
	flavourText: yup.string().notOneOf([undefined]).max(60, generateMaxLengthErrorMessage('flavourText', 60)),
	website: yup.string().max(30, generateMaxLengthErrorMessage('website', 30)),
	twitter: yup.string().max(30, generateMaxLengthErrorMessage('twitter', 30)),
	discord: yup.string().max(30, generateMaxLengthErrorMessage('discord', 30)),
	instagram: yup.string().max(30, generateMaxLengthErrorMessage('instagram', 30)),
	lynkfire: yup.string().max(30, generateMaxLengthErrorMessage('lynkfire', 30)),
	ownershipConfirmation: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Ownership confirmation')),
	authorRegistrationAndUploadingAgreement: yup
		.boolean()
		.required()
		.oneOf([true], generateNotCheckedErrorMessage('Author registration and uploading agreement')),
})

const CreatePage: NextPage = () => {
	const router = useRouter()
	const {
		register,
		setValue,
		watch,
		handleSubmit: onSubmit,
	} = useForm<CreateComicFormData>({
		defaultValues: {
			title: '',
			genres: [],
			audienceType: '',
			currentStatus: '',
			logo: '',
			banner: '',
			description: '',
			flavourText: '',
			website: '',
			twitter: '',
			discord: '',
			instagram: '',
			lynkfire: '',
			ownershipConfirmation: false,
			authorRegistrationAndUploadingAgreement: false,
		},
		resolver: yupResolver(validationSchema) as Resolver<CreateComicFormData>,
	})
	const toaster = useToaster()

	const handleSaveAndClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit, handleFormError)()
	}

	const handleSaveAndGoNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit((data) => {
			handleFormSubmit(data)
			router.push('/comic/issue/create')
		}, handleFormError)()
	}

	const handleFormSubmit = (data: CreateComicFormData) => {
		toaster.add('Successfuly created new comic', 'success')
	}

	const handleFormError = (errors: FieldErrors<CreateComicFormData>) => {
		const [_, errorValue] = Object.entries(errors)[0]

		if (!errorValue.message) {
			toaster.add('Error while submitting the form', 'error')
			return
		}

		toaster.add(errorValue.message, 'error')
	}

	return (
		<Publisher>
			<Header title='Create Comic' />
			<form className='form'>
				<Label isRequired>Comic title</Label>
				<Input {...register('title')} />
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
						setValue('genres', selectedOptions.length > 0 ? selectedOptions : [])
					}}
					ref={register('genres').ref}
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
								if (!selectedOptions[0]) {
									setValue('audienceType', '')
								}
								setValue('audienceType', selectedOptions[0].value as AudienceType)
							}}
							ref={register('audienceType').ref}
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
								if (!selectedOptions[0]) {
									setValue('currentStatus', '')
								}
								setValue('currentStatus', selectedOptions[0].value as CurrentStatus)
							}}
							ref={register('currentStatus').ref}
						/>
					</div>
				</div>
				<div className='comic-file-wrapper'>
					<div className='comic-file-container'>
						<Label isRequired tooltipText={'.png or .gif with transparent background'}>
							Comic Logo
						</Label>
						<FileUpload
							label='Choose a picture 200x200px'
							className='comic-logo-input'
							onUpload={(url) => {
								setValue('logo', url)
							}}
							ref={register('logo').ref}
						/>
					</div>
					<div className='comic-file-container'>
						<Label isRequired tooltipText='.png or .gif with transparent background'>
							Comic Banner
						</Label>
						<FileUpload
							label='Choose a picture 557x280px'
							className='comic-banner-input'
							onUpload={(url) => {
								setValue('banner', url)
							}}
							ref={register('banner').ref}
						/>
					</div>
				</div>
				<Label isRequired>Description</Label>
				<Textarea maxCharacters={200} rows={5} {...register('description')} />
				<Label>Flavour text</Label>
				<Textarea maxCharacters={60} rows={1} {...register('flavourText')} />
				<Label className='group-label'>Additional Links</Label>
				<Label size='small'>Website</Label>
				<Input
					prefix='https://'
					{...register('website', { maxLength: { value: 30, message: generateMaxLengthErrorMessage('website', 30) } })}
				/>
				<div className='social-media-wrapper'>
					<div className='social-media-container'>
						<Label size='small'>Twitter</Label>
						<Input {...register('twitter')} prefix='https://' />
					</div>
					<div className='social-media-container'>
						<Label size='small'>Discord</Label>
						<Input {...register('discord')} prefix='https://' />
					</div>
					<div className='social-media-container'>
						<Label size='small'>Instagram</Label>
						<Input {...register('instagram')} prefix='https://' />
					</div>
					<div className='social-media-container'>
						<Label size='small'>Lynkfire</Label>
						<Input {...register('lynkfire')} prefix='https://' />
					</div>
				</div>
				<div className='checkmark-row'>
					<Checkbox
						checked={watch('ownershipConfirmation')}
						onChange={(event) => {
							setValue('ownershipConfirmation', Boolean(event.target.checked))
						}}
						ref={register('ownershipConfirmation').ref}
					/>
					<span className='checkmark-text'>I confirm that this Comic is created by myself and belongs to me.</span>
				</div>
				<div className='checkmark-row'>
					<Checkbox
						checked={watch('authorRegistrationAndUploadingAgreement')}
						onChange={(event) => {
							setValue('authorRegistrationAndUploadingAgreement', Boolean(event.target.checked))
						}}
						ref={register('authorRegistrationAndUploadingAgreement').ref}
					/>
					<span className='checkmark-text'>
						I agree to dReader’s{' '}
						<span className='checkmark-text--highlighted'>Author Registration and Uploading Agreement</span>
					</span>
				</div>
				<div className='actions'>
					<Button
						type='submit'
						onClick={handleSaveAndClose}
						backgroundColor='transparent'
						borderColor='grey-100'
						className='action-button'
					>
						Save & Close
					</Button>
					<Button type='submit' onClick={handleSaveAndGoNext} backgroundColor='grey-100' className='action-button'>
						Next <ArrowRightIcon className='action-button-icon' />
					</Button>
				</div>
			</form>
		</Publisher>
	)
}

export default CreatePage
