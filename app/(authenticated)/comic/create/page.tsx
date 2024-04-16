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
import {
	AUDIENCE_TYPE_SELECT_OPTIONS,
	IS_ONGOING_SELECT_OPTIONS,
	findOptions,
	genresToSelectOptions,
} from '@/constants/selectOptions'
import Dialog from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { FIRST_TIME_PUBLISHING_NOTICE } from '@/constants/staticText'
import HintDrawer from '@/components/layout/HintDrawer'
import FormFaqItems from '@/components/layout/FormFaqItem'
import { CREATE_COMIC_FAQ } from '@/constants/hints'

type LegalAgreement = {
	ownershipConfirmation: boolean
	authorAgreement: boolean
}

export default function CreateComicPage() {
	const router = useRouter()
	const toaster = useToaster()

	const [isFirstTimePublishing, setIsFirstPublishing] = useLocalStorage('first-time-publishing', true)
	const [isHintDrawerOpen] = useLocalStorage('hint-drawer-open', true)

	const { register, setValue, watch, handleSubmit } = useForm<CreateComicData & LegalAgreement>({
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
		await handleSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(RoutePath.Dashboard)
	}

	const handleSaveAndGoNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: CreateComicData) => {
		const comic = await createComic(data)
		router.push(RoutePath.ComicUploadAssets(comic.slug))
	}

	return (
		<>
			<Header title='Create comic series' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: true },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Connect social', isActive: false },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<Form padding maxSize='sm' fullWidth className='form--create-comic' hiddenOnMobile={isHintDrawerOpen}>
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
						options={genresToSelectOptions(genres)}
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
								options={AUDIENCE_TYPE_SELECT_OPTIONS}
								onSelect={(selectedOptions) => {
									if (!selectedOptions[0]) {
										setValue('audienceType', AudienceType.Everyone)
									}
									setValue('audienceType', (selectedOptions[0]?.value as AudienceType) ?? '')
								}}
								unselectableIfAlreadySelected
								defaultSelectedOptions={findOptions(AUDIENCE_TYPE_SELECT_OPTIONS, AudienceType.Everyone)}
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
								options={IS_ONGOING_SELECT_OPTIONS}
								onSelect={(selectedOptions) => {
									if (!selectedOptions[0]) {
										setValue('isCompleted', false)
									}
									setValue('isCompleted', selectedOptions[0]?.value === 'true')
								}}
								unselectableIfAlreadySelected
								defaultSelectedOptions={findOptions(IS_ONGOING_SELECT_OPTIONS, 'false')}
								ref={register('isCompleted').ref}
							/>
						</div>
					</div>

					<Label isRequired>Description</Label>
					<Textarea maxCharacters={1024} rows={6} {...register('description')} placeholder='My comic description' />

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

				<HintDrawer>
					<FormFaqItems items={CREATE_COMIC_FAQ} />
				</HintDrawer>
			</main>

			<Dialog
				style={{ backdropFilter: 'blur(4px)' }}
				PaperProps={{ className: 'text-dialog' }}
				onClose={() => setIsFirstPublishing(false)}
				open={isFirstTimePublishing}
			>
				<div className='close-icon-wrapper'>
					<CloseIcon className='close-icon' onClick={() => setIsFirstPublishing(false)} />
				</div>
				<strong>IMPORTANT NOTICE!</strong>
				{/* TODO: add a link to the "publishing-instructions.pdf" document */}
				<p>{FIRST_TIME_PUBLISHING_NOTICE}</p>
			</Dialog>
		</>
	)
}
