'use client'

import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import { createCarouselSlideValidationSchema } from '@/components/forms/schemas'
import { useFetchBasicComicIssues } from 'api/comicIssue'
import { CAROUSEL_LOCATION_OPTIONS, findOptions } from '@/constants/selectOptions'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useToaster } from '@/providers/ToastProvider'
import Label from '@/components/forms/Label'
import FormActions from '@/components/forms/FormActions'
import FileUpload from '@/components/forms/FileUpload'
import { imageTypes } from '@/constants/fileTypes'
import { CarouselLocation } from '@/enums/carouselLocation'
import Select from '@/components/forms/Select'
import { useState } from 'react'
import { CreateCarouselSlideData } from '@/models/carousel/carouselSlide'
import { useCreateCarouselSlide } from '@/api/carousel'
import { useFetchBasicComics } from '@/api/comic'
import { useFetchMe } from '@/api/creator'
import { Role } from '@/enums/role'
import CustomDatePicker from '@/components/forms/CustomDatePicker'
import SearchInput from '@/components/forms/SearchInput'
import { CarouselSlideSearchInputOption } from '@/types/carouseSlideSearchInputOption'

export default function CreateCarouselSlidePage() {
	const toaster = useToaster()
	const [searchComicIssue, setSearchComicIssue] = useState('')
	const [searchComic, setSearchComic] = useState('')

	const { flatData: comicIssues } = useFetchBasicComicIssues({ titleSubstring: searchComicIssue, skip: 0, take: 10 })
	const { flatData: comics } = useFetchBasicComics({ titleSubstring: searchComic, skip: 0, take: 10 })

	const form = useForm<CreateCarouselSlideData>({
		defaultValues: {
			priority: 1,
			location: CarouselLocation.Home,
		},
		resolver: yupResolver(createCarouselSlideValidationSchema) as Resolver<CreateCarouselSlideData>,
	})
	const { register, setValue, handleSubmit } = form
	const { mutateAsync: createCarouselSlide } = useCreateCarouselSlide()

	const { data: me } = useFetchMe()

	useAuthenticatedRoute()
	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: CreateCarouselSlideData) => {
		const formData = new FormData()
		formData.append('image', data.image)
		formData.append('priority', data.priority.toString())
		formData.append('location', data.location)
		if (data.title) formData.append('title', data.title)
		if (data.subtitle) formData.append('subtitle', data.subtitle)
		if (data.comicIssueId) formData.append('comicIssueId', data.comicIssueId.toString())
		if (data.comicSlug) formData.append('comicSlug', data.comicSlug)
		if (data.externalLink) formData.append('externalLink', data.externalLink)
		if(data.expiredAt) formData.append('expiresAt',data.expiredAt.toDateString())

		await createCarouselSlide(formData)
	}

	const handleChangeCoverImage = async (value: File) => {
		setValue('image', value)
	}

	const handleChangeComicIssue = async (value: number, title: string) => {
		setValue('comicIssueId', value)
		setSearchComicIssue(title)
	}

	const handleChangeComic = async (value: string, title: string) => {
		setValue('comicSlug', value)
		setSearchComic(title)
	}

	const handleChangeLocation = (value: string) => {
		setValue('location', value)
	}

	if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null
	return (
		<>
			<Header title='Add Carousel Slide' />
			<main className='form--create-carousel-slide'>
				<FormProvider {...form}>
					<Form padding fullWidth className='create-crousel-slide'>
						<div className='form-wrapper'>
							<div className='inputs--top'>
								<div className='location'>
									<Label isRequired>Location</Label>
									<Select
										options={CAROUSEL_LOCATION_OPTIONS}
										defaultSelectedOptions={findOptions(CAROUSEL_LOCATION_OPTIONS, CarouselLocation.Home)}
										onSelect={(selectedOptions) => handleChangeLocation(selectedOptions[0].value)}
										unselectableIfAlreadySelected
										placeholder='Carousel Location'
									/>
								</div>
								<div>
									<Label>Expires At</Label>
									<CustomDatePicker name='expiredAt' className='date-picker' />
								</div>
							</div>
							
							<div className='inputs--bottom'>
							<Label>Comic Issue</Label>
							<SearchInput
									options={comicIssues.map(issue => ({ value: issue.id, label: issue.title }))}
									value={searchComicIssue}
									onChange={(value:string, option?:CarouselSlideSearchInputOption) => {
										setSearchComicIssue(value);
										if (option) {
											handleChangeComicIssue(option.value as number, option.label);
										}
									}}
									onInputChange={setSearchComicIssue}
									placeholder="Select Comic Issues"
								/>
								<div>
									<Label>Comic</Label>
									<SearchInput
										options={comics.map(comic => ({ value: comic.slug, label: comic.title }))}
										value={searchComic}
										onChange={(value:string, option?:CarouselSlideSearchInputOption) => {
											setSearchComic(value);
											if (option) {
												handleChangeComic(option.value as string, option.label);
											}
										}}
									onInputChange={setSearchComic}
									placeholder="Select Comics"
								/>
							</div>
								<div>
									<Label>Title</Label>
									<Input {...register('title')} />
								</div>
								<div>
									<Label>Sub Title</Label>
									<Input {...register('subtitle')} />
								</div>
								<div>
									<Label isRequired>Priority</Label>
									<Input {...register('priority')} />
								</div>
								<div>
									<Label>External Link</Label>
									<Input {...register('externalLink')} />
								</div>
							</div>
						</div>

						<div className='carousel-image-submit'>
							<Label isRequired>Carousel Image</Label>
							<FileUpload
								id='Carousel'
								label='Choose a picture'
								className='carousel-image-upload'
								onUpload={(files) => {
									handleChangeCoverImage(files[0]?.file ?? '')
								}}
								options={{ accept: imageTypes, maxFiles: 1 }}
							/>
							<FormActions marginTop className='action-button-wrapper'>
								<Button type='submit' onClick={onSubmitClick} className='action-button'>
									Create
								</Button>
							</FormActions>
						</div>
					</Form>
				</FormProvider>
			</main>
		</>
	)
}
