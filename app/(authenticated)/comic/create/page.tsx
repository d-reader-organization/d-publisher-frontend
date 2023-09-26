'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

import Header from 'components/layout/Header'
import Input from '@/components/forms/Input'
import Checkbox from 'components/Checkbox'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useCreateComic } from 'api/comic'
import { useFetchGenres } from 'api/genre'
import { CreateComicData } from 'models/comic'
import { AudienceType } from 'enums/audienceType'
import { RoutePath } from 'enums/routePath'
import { createComicValidationSchema } from '@/components/forms/schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useToaster } from '@/providers/ToastProvider'
import { audienceTypeTooltipText, currentStatusTooltipText, genresTooltipText } from '@/constants/tooltips'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import Label from '@/components/forms/Label'
import Select from '@/components/forms/Select'
import Textarea from '@/components/forms/Textarea'
import FormActions from '@/components/forms/FormActions'

type LegalAgreement = {
	ownershipConfirmation: boolean
	authorAgreement: boolean
}

export default function CreateComicPage() {
	const router = useRouter()
	const toaster = useToaster()

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
			// collaborators: [],
			ownershipConfirmation: false,
			authorAgreement: false,
		},
		resolver: yupResolver(createComicValidationSchema) as Resolver<CreateComicData & LegalAgreement>,
	})
	const { data: genres = [] } = useFetchGenres()
	const { mutateAsync: createComic } = useCreateComic()

	useAuthenticatedRoute()
	usePrefetchRoute([RoutePath.Dashboard])

	const handleSaveAndClose = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		await onSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(RoutePath.Dashboard)
	}

	const handleSaveAndGoNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit, toaster.onFormError)()
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
					<p className='description'>Title of your comic series</p>
					<Input {...register('title')} />

					<Label isRequired tooltipText={genresTooltipText}>
						Genres
					</Label>
					<p className='description'>Select up to 5 genres</p>
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
							<Label isRequired tooltipText={audienceTypeTooltipText}>
								Audience Type
							</Label>
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
							<Label isRequired tooltipText={currentStatusTooltipText}>
								Current Status
							</Label>
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

					{/* <Label isRequired tooltipText={comicIssueAuthorsTooltipText}>
						Authors list
					</Label>
					<SelectWithInput
						ref={register('collaborators').ref}
						options={ROLE_SELECT_OPTIONS}
						onChange={(inputs) => {
							setValue(
								'collaborators',
								inputs.map((input) => {
									return {
										role: input.selectValue as CollaboratorRole,
										name: input.inputValue,
									}
								})
							)
						}}
					/> */}

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
						{/* TODO: add link to TOS */}
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
