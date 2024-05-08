'use client'

import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { createComicIssueValidationSchema } from '@/components/forms/schemas'
import { useCreateComicIssue } from 'api/comicIssue'
import { CreateComicIssueData } from 'models/comicIssue'
import { CollaboratorRole } from 'enums/collaboratorRole'
import { ROLE_SELECT_OPTIONS } from '@/constants/selectOptions'
import { RoutePath } from '@/enums/routePath'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import Checkbox from '@/components/Checkbox'
import { useToaster } from '@/providers/ToastProvider'
import {
	issueAuthorsTooltipText,
	isComicFreeToReadTooltipText,
	issueNumberTooltipText,
	issueTitleTooltipText,
	releaseDateTooltipText,
} from '@/constants/tooltips'
import Label from '@/components/forms/Label'
import IntegerInput from '@/components/forms/IntegerInput'
import SelectWithInput from '@/components/forms/SelectWithInput'
import Textarea from '@/components/forms/Textarea'
import FormActions from '@/components/forms/FormActions'
import CustomDatePicker from '@/components/forms/CustomDatePicker'
import HintDrawer from '@/components/layout/HintDrawer'
import FormFaqItems from '@/components/layout/FormFaqItem'
import { CREATE_COMIC_ISSUE_FAQ } from '@/constants/hints'
import { useLocalStorage } from '@/hooks'

export default function CreateComicIssuePage() {
	const router = useRouter()
	const toaster = useToaster()

	const searchParams = useSearchParams()
	const comicSlug = searchParams.get('comicSlug') || ''
	const [isHintDrawerOpen] = useLocalStorage('hint-drawer-open', true)
	
	const form = useForm<CreateComicIssueData>({
		defaultValues: {
			title: '',
			number: 1,
			description: '',
			flavorText: '',
			releaseDate: new Date(),
			comicSlug: comicSlug,
			isFreeToRead: false,
			collaborators: [],
		},
		resolver: yupResolver(createComicIssueValidationSchema) as Resolver<CreateComicIssueData>,
	})
	const { register, setValue, getValues, watch, handleSubmit } = form
	const { mutateAsync: createComicIssue } = useCreateComicIssue()

	useAuthenticatedRoute()

	if (!comicSlug) return null

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: CreateComicIssueData) => {
		const comicIssue = await createComicIssue(data)
		router.push(RoutePath.ComicIssueUploadCovers(comicIssue.id))
	}

	return (
		<>
			<Header title='Create Issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload covers', isActive: false },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Submitted', isActive: false },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<FormProvider {...form}>
					<Form padding maxSize='md' fullWidth className='form--create-comic-issue' hiddenOnMobile={isHintDrawerOpen}>
						<Label isRequired tooltipText={issueTitleTooltipText}>
							Issue title
						</Label>
						<Input {...register('title')} placeholder='Name of the episode' />
						<div className='issue-number-wrapper'>
							<div>
								<Label isRequired tooltipText={issueNumberTooltipText}>
									Issue number
								</Label>
								<p className='description'>Choose the episode number</p>
							</div>
							<IntegerInput
								min={1}
								ref={register('number').ref}
								value={watch('number')}
								onChange={(step) => {
									const currentNumber = getValues('number')
									setValue('number', currentNumber + step)
								}}
							/>
						</div>
						<div className='issue-release-date-wrapper'>
							<Label isRequired tooltipText={releaseDateTooltipText}>
								Release Date
							</Label>
							<CustomDatePicker name='releaseDate' />
						</div>

						<Label isRequired tooltipText={issueAuthorsTooltipText}>
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
						/>

						<Label>Description</Label>
						<Textarea
							maxCharacters={1024}
							rows={6}
							{...register('description')}
							placeholder='My comic issue description'
						/>
						<Label>Flavor text</Label>
						<Textarea maxCharacters={128} rows={2} {...register('flavorText')} placeholder='Some sweet flavor text' />

						<Label isRequired tooltipText={isComicFreeToReadTooltipText}>
							Is this comic free to read?
						</Label>
						<div className='checkmark-row'>
							<Checkbox
								checked={watch('isFreeToRead')}
								onChange={(event) => {
									setValue('isFreeToRead', Boolean(event.target.checked))
								}}
								ref={register('isFreeToRead').ref}
							/>
							<span className='checkmark-text'>Free to read</span>
						</div>

						<FormActions marginTop>
							<Button type='submit' onClick={onSubmitClick} backgroundColor='grey-100' className='action-button'>
								Next <ArrowRightIcon className='action-button-icon' />
							</Button>
						</FormActions>
					</Form>
				</FormProvider>
				<HintDrawer>
					<FormFaqItems items={CREATE_COMIC_ISSUE_FAQ} />
				</HintDrawer>
			</main>
		</>
	)
}
