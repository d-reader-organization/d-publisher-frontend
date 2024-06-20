'use client'

import { useForm } from 'react-hook-form'
import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import { useFetchComicIssues, useFetchRawComicIssue } from 'api/comicIssue'
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
import { useEffect, useState } from 'react'
import { UpdateCarouselSlideData } from '@/models/carousel/carouselSlide'
import { useExpireCarouselSlide, useFetchCarouselSlide, useUpdateCarouselSlide, useUpdateCarouselSlideImage } from '@/api/carousel'
import { useFetchComics, useFetchRawComic } from '@/api/comic'
import { Role } from '@/enums/role'
import { useFetchMe } from '@/api/creator'

interface Params {
    id: string | number
}

export default function CreateCarouselSlidePage({ params }: { params: Params }){
	const toaster = useToaster();
	const [searchComicIssue, setSearchComicIssue] = useState('');
	const [searchComic, setSearchComic] = useState('');
	const [carouselSlideImage, setCarouselSlideImage] = useState<File>();
	const [oldSlideImage, setOldSlideImage] = useState('');
	const [isSearchingIssues, setIsSearchingIssues] = useState(false);
	const [isSearchingComics, setIsSearchingComics] = useState(false);
	
	const { data: carouselSlide } = useFetchCarouselSlide(params.id);
	const { flatData: comicIssues } = useFetchComicIssues({ titleSubstring: searchComicIssue, skip: 0, take: 10 });
	const { flatData: comics } = useFetchComics({ titleSubstring: searchComic, skip: 0, take: 10 });
	const { data: comicIssue } = useFetchRawComicIssue(carouselSlide?.comicIssueId ?? '');
	const { data: comic } = useFetchRawComic(carouselSlide?.comicSlug ?? '');
	
	const form = useForm<UpdateCarouselSlideData>();
	const { register, setValue, handleSubmit } = form;
	const { mutateAsync: updateCarouselSlide } = useUpdateCarouselSlide(params.id);
	const { mutateAsync: updateCarouselSlideImage } = useUpdateCarouselSlideImage(params.id);
	const { mutateAsync: expireCarouselSlide } = useExpireCarouselSlide(params.id);
	
	useAuthenticatedRoute();
	const { data: me } = useFetchMe()

	useEffect(() => {
		setValue('title', carouselSlide?.title);
		setValue('subtitle', carouselSlide?.subtitle);
		setValue('comicIssueId', carouselSlide?.comicIssueId);
		setValue('comicSlug', carouselSlide?.comicSlug);
		setValue('creatorSlug', carouselSlide?.creatorSlug);
		setValue('externalLink', carouselSlide?.externalLink);
		setValue('priority', carouselSlide?.priority);
		setValue('location', carouselSlide?.location);
		setOldSlideImage(carouselSlide?.image ?? '');
	}, [carouselSlide,setValue]);
	
	useEffect(() => {
		setSearchComicIssue(comicIssue?.title ?? '');
	}, [comicIssue]);
	
	useEffect(() => {
		setSearchComic(comic?.title ?? '');
	}, [comic]);
	
	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
		handleSubmit(handleFormSubmit, toaster.onFormError)();
	};
	
	const handleFormSubmit = async (data: UpdateCarouselSlideData) => {
		const formData = new FormData();
		if (carouselSlideImage) {
			formData.append('image', carouselSlideImage);
			await updateCarouselSlideImage(formData);
		}
		await updateCarouselSlide(data);
	};
	
	const handleChangeComicIssue = (value: number, title: string) => {
		setValue('comicIssueId', value);
		setSearchComicIssue(title);
		setIsSearchingIssues(false);
	};
	
	const handleChangeComic = (value: string, title: string) => {
		setValue('comicSlug', value);
		setSearchComic(title);
		setIsSearchingComics(false);
	};
	
	const handleChangeLocation = (value: string) => {
		setValue('location', value);
	};
	
	const onDelete = async () => {
		await expireCarouselSlide();
	};	

	if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null

	return (
		<>
			<Header title='Update Carousel' />
			<main className='form--update-carousel-slide-info'>
				<Form padding fullWidth className='update-carousel-slide-info'>
					<div className='form-wrapper'>
						<Label isRequired>Location</Label>
						<Select
							options={CAROUSEL_LOCATION_OPTIONS}
							defaultSelectedOptions={findOptions(CAROUSEL_LOCATION_OPTIONS, CarouselLocation.Home)}
							onSelect={(selectedOptions) => handleChangeLocation(selectedOptions[0].value)}
							unselectableIfAlreadySelected
							placeholder='Carousel Location'
						/>
						<div className='items'>
							<div onMouseLeave={() => setIsSearchingIssues(false)}>
								<Input
									value={searchComicIssue}
									type='text'
									placeholder='Select Comic Issues'
									onMouseEnter={() => setIsSearchingIssues(true)}
									onChange={(e) => {
										setSearchComicIssue(e.target.value)
									}}
								/>
								{isSearchingIssues
									? comicIssues.map((issue) => (
											<p 
												key={issue.id} 
												style={{ cursor: 'pointer', zIndex: 1 }} 
												onClick={() => handleChangeComicIssue(issue.id, issue.title)}
											>
												{issue.title}
											</p>
									  ))
									: null}
							</div>
							<div onMouseLeave={() => setIsSearchingComics(false)}>
								<Input
									value={searchComic}
									type='text'
									placeholder='Select Comics'
									onChange={(e) => {
										setSearchComic(e.target.value)
									}}
									onMouseEnter={() => setIsSearchingComics(true)}
								/>
								{isSearchingComics
									? comics.map((comic) => (
											<p
												key={comic.slug}
												style={{ cursor: 'pointer', zIndex: 1 }}
												onClick={() => handleChangeComic(comic.slug, comic.title)}
											>
												{comic.title}
											</p>
									  ))
									: null}
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
								setCarouselSlideImage(files[0]?.file ?? '')
							}}
                            previewUrl={!carouselSlideImage ? oldSlideImage : undefined}
							options={{ accept: imageTypes, maxFiles: 1 }}
						/>
						<FormActions marginTop className='action-button-wrapper'>
							<Button type='submit' onClick={onSubmitClick} className='action-button'>
								Update
							</Button>
						</FormActions>
                        {!carouselSlide?.isExpired ? <Button type='submit' onClick={onDelete} className='button--delete'>
								Delete
						</Button> : <Button className='button--expired'>
								Expired
						</Button>}
					</div>
				</Form>
			</main>
		</>
	)
}
