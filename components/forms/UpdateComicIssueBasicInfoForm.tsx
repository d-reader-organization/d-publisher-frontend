import { useEffect } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import SelectWithInput from './SelectWithInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateComicIssueValidationSchema } from './schemas'
import Form from './Form'
import Label from './Label'
import Textarea from './Textarea'
import FormActions from './FormActions'
import { issueAuthorsTooltipText, isComicFreeToReadTooltipText } from '@/constants/tooltips'
import IntegerInput from './IntegerInput'
import Checkbox from '../Checkbox'
import { useToaster } from '@/providers/ToastProvider'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'
import { UpdateComicIssueData } from '@/models/comicIssue'
import { ROLE_SELECT_OPTIONS, mapCollaboratorsToSelectInput } from '@/constants/selectOptions'
import { useUpdateComicIssue } from '@/api/comicIssue'
import { CollaboratorRole } from '@/enums/collaboratorRole'
import CustomDatePicker from './CustomDatePicker'

interface Props {
	comicIssue: RawComicIssue
}

const UpdateComicIssueBasicInfoForm: React.FC<Props> = ({ comicIssue }) => {
	const toaster = useToaster()

	const { mutateAsync: updateComicIssue } = useUpdateComicIssue(comicIssue.id)
	const form = useForm<UpdateComicIssueData>({
		defaultValues: {
			title: comicIssue.title,
			number: 1,
			description: '',
			flavorText: '',
			isFreeToRead: false,
			collaborators: comicIssue.collaborators,
			releaseDate: new Date(comicIssue.releaseDate),
		},
		resolver: yupResolver(updateComicIssueValidationSchema) as Resolver<UpdateComicIssueData>,
	})
	const { register, handleSubmit, setValue, watch, reset, getValues } = form

	useEffect(() => {
		if (comicIssue) {
			reset({
				description: comicIssue.description,
				flavorText: comicIssue.flavorText,
				number: comicIssue.number,
				isFreeToRead: comicIssue.isFreeToRead,
				collaborators: comicIssue.collaborators,
				releaseDate: new Date(comicIssue.releaseDate),
			})
		}
	}, [comicIssue, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await updateComicIssue(data)
		}, toaster.onFormError)()
	}

	return (
		<FormProvider {...form}>
			<Form padding maxSize='md' fullWidth className='form--create-comic-issue'>
				<Label isRequired>Comic issue title</Label>
				<Input placeholder={comicIssue.title} {...register('title')} />

				<Label isRequired>Slug</Label>
				<Input disabled placeholder={comicIssue.slug} />

				<div className='issue-number-wrapper'>
					<div>
						<Label isRequired>Issue number</Label>
						<p className='description'>Choose the episode number</p>
					</div>

					<IntegerInput
						min={1}
						ref={register('number').ref}
						value={watch('number')}
						onChange={(step) => {
							const currentNumber = getValues('number')
							setValue('number', currentNumber! + step)
						}}
					/>
				</div>
				<div className='issue-release-date-wrapper'>
					<Label isRequired>Release Date</Label>
					<CustomDatePicker name='releaseDate' />
				</div>
				<Label isRequired tooltipText={issueAuthorsTooltipText}>
					Authors list
				</Label>

				<SelectWithInput
					ref={register('collaborators').ref}
					defaultValues={mapCollaboratorsToSelectInput(comicIssue.collaborators)}
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
				<Textarea maxCharacters={1024} rows={6} {...register('description')} placeholder='My comic issue description' />
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
				<FormActions>
					<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
						Update
					</Button>
				</FormActions>
			</Form>
		</FormProvider>
	)
}

export default UpdateComicIssueBasicInfoForm
