'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

import Header from 'components/layout/Header'
import Input from 'components/Input'
import Label from 'components/Label'
import Select from 'components/Select'
import Textarea from 'components/Textarea'
import Checkbox from 'components/Checkbox'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useCreateComic } from 'api/comic'
import { useFetchGenres } from 'api/genre'
import { CreateComicData } from 'models/comic'
import { AudienceType } from 'enums/audienceType'
import { RoutePath } from 'enums/routePath'
import { createComicValidationSchema } from '../schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'

type LegalAgreement = {
	ownershipConfirmation: boolean
	authorAgreement: boolean
}

export default function CreateComicPage() {
	const router = useRouter()
	const {
		register,
		setValue,
		watch,
		handleSubmit: onSubmit,
	} = useForm<CreateComicData & LegalAgreement>({
		defaultValues: {
			title: '',
			genres: [],
			audienceType: AudienceType.Everyone,
			isCompleted: false,
			description: '',
			flavorText: '',
			ownershipConfirmation: false,
			authorAgreement: false,
		},
		resolver: yupResolver(createComicValidationSchema) as Resolver<CreateComicData & LegalAgreement>,
	})
	const { data: genres = [] } = useFetchGenres()
	const { mutateAsync: createComic } = useCreateComic()

	useAuthenticatedRoute()

	const handleSaveAndClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit)()
	}

	const handleSaveAndGoNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit)()
	}

	const handleFormSubmit = async (data: CreateComicData) => {
		const comic = await createComic(data)
		router.push(`${RoutePath.ComicUploadAssets}?slug=${comic.slug}`)
	}

	return (
		<>
			<Header title='Create Comic' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: true },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Connect social', isActive: false },
				]}
			/>

			<main>
				<Form padding maxSize='md' fullWidth className='form--create-comic'>
					<Label isRequired>Comic title</Label>
					<Input {...register('title')} />
					<Label isRequired>Genres</Label>
					<Select
						isSearchable
						isMultipleSelect
						placeholder='Search genres...'
						options={genres.map((genre) => {
							return { label: genre.name, value: genre.slug, icon: genre.icon }
						})}
						onSelect={(selectedOptions = []) => {
							setValue(
								'genres',
								selectedOptions.map((genre) => genre.value)
							)
						}}
						ref={register('genres').ref}
					/>
					<div className='audience-status-wrapper'>
						<div className='audience-status-container'>
							<Label isRequired>Audience Type</Label>
							<Select
								className='audience-status-input'
								placeholder='Mature / Teen / Everyone'
								options={[
									{ label: 'Everyone', value: AudienceType.Everyone },
									{ label: 'Mature', value: AudienceType.Mature },
									{ label: 'Teen', value: AudienceType.Teen },
									{ label: 'Teen+', value: AudienceType.TeenPlus },
								]}
								onSelect={(selectedOptions) => {
									if (!selectedOptions[0]) {
										setValue('audienceType', AudienceType.Everyone)
									}
									setValue('audienceType', (selectedOptions[0]?.value as AudienceType) ?? '')
								}}
								unselectableIfAlreadySelected
								defaultSelectedOptions={[{ label: 'Everyone', value: 'false' }]}
								ref={register('audienceType').ref}
							/>
						</div>
						<div className='audience-status-container'>
							<Label isRequired>Current Status</Label>
							<Select
								className='audience-status-input'
								placeholder='Completed / Ongoing'
								options={[
									{ label: 'Ongoing', value: 'false' },
									{ label: 'Completed', value: 'true' },
								]}
								onSelect={(selectedOptions) => {
									if (!selectedOptions[0]) {
										setValue('isCompleted', false)
									}
									setValue('isCompleted', Boolean(selectedOptions[0]?.value) ?? false)
								}}
								unselectableIfAlreadySelected
								defaultSelectedOptions={[{ label: 'Ongoing', value: 'false' }]}
								ref={register('isCompleted').ref}
							/>
						</div>
					</div>
					<Label isRequired>Description</Label>
					<Textarea maxCharacters={256} rows={6} {...register('description')} placeholder='My comic description' />
					<Label>Flavor text</Label>
					<Textarea maxCharacters={128} rows={2} {...register('flavorText')} placeholder='Some sweet flavor text' />
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
							checked={watch('authorAgreement')}
							onChange={(event) => {
								setValue('authorAgreement', Boolean(event.target.checked))
							}}
							ref={register('authorAgreement').ref}
						/>
						<span className='checkmark-text'>
							I agree to dReader&apos;s&nbsp;
							<span className='checkmark-text--highlighted'>Author Registration and Uploading Agreement</span>
						</span>
					</div>

					<FormActions marginTop>
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
					</FormActions>
				</Form>
			</main>
		</>
	)
}
