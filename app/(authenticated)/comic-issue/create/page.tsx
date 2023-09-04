'use client'

import { FieldErrors, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Label from 'components/Label'
import Button from 'components/Button'
import Input from 'components/Input'
import Steps from 'components/Steps'
import Textarea from 'components/Textarea'
import IntegerInput from 'components/IntegerInput'
import SelectWithInput from 'components/SelectWithInput'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { createComicIssueValidationSchema } from '../schemas'
import { useCreateComicIssue } from 'api/comicIssue'
import { CreateComicIssueData } from 'models/comicIssue'
import { CollaboratorRole } from 'enums/collaboratorRole'
import { ROLE_SELECT_OPTIONS } from '@/constants/roles'
import { RoutePath } from '@/enums/routePath'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'

export default function CreateComicIssuePage() {
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicSlug = searchParams.get('comicSlug') || ''

	const { register, setValue, getValues, watch, handleSubmit } = useForm<CreateComicIssueData>({
		defaultValues: {
			title: '',
			number: 1,
			description: '',
			flavorText: '',
			releaseDate: new Date(),
			comicSlug: comicSlug,
			collaborators: [],
		},
		resolver: yupResolver(createComicIssueValidationSchema) as Resolver<CreateComicIssueData>,
	})
	const { mutateAsync: createComicIssue } = useCreateComicIssue()

	useAuthenticatedRoute()

	if (!comicSlug) return null

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit((data) => {
			handleFormSubmit(data)
		}, handleFormError)()
	}

	const handleFormSubmit = async (data: CreateComicIssueData) => {
		try {
			const comicIssue = await createComicIssue(data)
			router.push(`${RoutePath.ComicIssueUploadAssets}?id=${comicIssue.id}`)
		} catch {
			// do something?
		}
	}

	const handleFormError = (errors: FieldErrors<CreateComicIssueData>) => {
		const [_, errorValue] = Object.entries(errors)[0]

		console.log(errors, errorValue)
	}

	return (
		<>
			<Header title='Create Issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Upload pages', isActive: false },
					{ label: '04 Publish', isActive: false },
				]}
			/>

			<main className='create-comic-issue-page'>
				<form className='form'>
					<Label isRequired>Issue title</Label>
					<Input {...register('title')} placeholder='Name of the episode' />
					<div className='issue-number-wrapper'>
						<div>
							<Label isRequired>Issue number</Label>
							<p className='description'>Choose the episode number</p>
						</div>
						<IntegerInput
							ref={register('number').ref}
							value={watch('number')}
							onChange={(increment) => {
								const currentNumber = getValues('number')
								setValue('number', currentNumber + increment)
							}}
						/>
					</div>
					<Label isRequired>Authors list</Label>
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
						maxCharacters={256}
						rows={6}
						{...register('description')}
						placeholder='My comic issue description'
					/>
					<Label>Flavor text</Label>
					<Textarea maxCharacters={128} rows={2} {...register('flavorText')} placeholder='Some sweet flavor text' />
					<Button type='submit' onClick={onSubmitClick} backgroundColor='grey-100' className='action-button'>
						Next <ArrowRightIcon className='action-button-icon' />
					</Button>
				</form>
			</main>
		</>
	)
}
