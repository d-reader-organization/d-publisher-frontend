import React, { useEffect } from 'react'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateComicValidationSchema } from './schemas'
import Form from './Form'
import Label from './Label'
import Textarea from './Textarea'
import FormActions from './FormActions'
import { useUpdateComic } from '@/api/comic'
import { RawComic } from '@/models/comic/rawComic'
import { UpdateComicData } from '@/models/comic'
import { audienceTypeTooltipText, currentStatusTooltipText, genresTooltipText } from '@/constants/tooltips'
import Select from './Select'
import { AudienceType } from '@/enums/audienceType'
import { useToaster } from '@/providers/ToastProvider'
import {
	AUDIENCE_TYPE_SELECT_OPTIONS,
	IS_ONGOING_SELECT_OPTIONS,
	findOptions,
	genresToSelectOptions,
} from '@/constants/selectOptions'
import { genresToSlugs } from '@/utils/helpers'
import { Genre } from '@/models/genre'

interface Props {
	comic: RawComic
	genres: Genre[]
}

const UpdateComicBasicInfoForm: React.FC<Props> = ({ comic, genres }) => {
	const toaster = useToaster()

	const { mutateAsync: updateComic } = useUpdateComic(comic.slug)
	const { register, handleSubmit, setValue, reset } = useForm<UpdateComicData>({
		defaultValues: {
			genres: [],
			audienceType: AudienceType.Everyone,
			isCompleted: false,
			description: '',
			flavorText: '',
		},
		resolver: yupResolver(updateComicValidationSchema) as Resolver<UpdateComicData>,
	})

	useEffect(() => {
		if (comic) {
			reset({
				genres: genresToSlugs(comic.genres),
				audienceType: comic.audienceType,
				isCompleted: !!comic.completedAt,
				description: comic.description,
				flavorText: comic.flavorText,
			})
		}
	}, [comic, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await updateComic(data)
		}, toaster.onFormError)()
	}

	return (
		<Form fullWidth className='form--update-comic-basic-info'>
			<Label isRequired>Comic title</Label>
			<Input disabled placeholder={comic.title} />

			<Label isRequired>Slug</Label>
			<Input disabled placeholder={comic.slug} />

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
				defaultSelectedOptions={findOptions(genresToSelectOptions(genres), ...genresToSlugs(comic.genres))}
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
						defaultSelectedOptions={findOptions(AUDIENCE_TYPE_SELECT_OPTIONS, comic.audienceType)}
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
						defaultSelectedOptions={findOptions(IS_ONGOING_SELECT_OPTIONS, (!!comic.completedAt).toString())}
						ref={register('isCompleted').ref}
					/>
				</div>
			</div>

			<Label isRequired>Description</Label>
			<Textarea
				maxCharacters={1024}
				rows={6}
				{...register('description')}
				defaultValue={comic.description}
				placeholder='My comic description'
			/>

			<Label>Flavor text</Label>
			<Textarea
				maxCharacters={128}
				rows={2}
				{...register('flavorText')}
				defaultValue={comic.flavorText}
				placeholder='Some sweet flavor text'
			/>

			<FormActions>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateComicBasicInfoForm
