'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useSearchParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Label from 'components/Label'
import FileUpload from 'components/FileUpload'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { UpdateComicFilesData } from 'models/comic'
import { RoutePath } from 'enums/routePath'
import { useUpdateComicFiles } from 'api/comic'
import { uploadAssetsValidationSchema } from '../schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FormActions from '@/components/FormActions'
import Form from '@/components/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'

export default function UploadComicAssetsPage() {
	const router = useRouter()

	const searchParams = useSearchParams()
	const comicSlug = searchParams.get('slug') || ''
	const nextPage = `${RoutePath.ComicConnectSocials}?slug=${comicSlug}`

	const {
		register,
		setValue,
		handleSubmit: onSubmit,
	} = useForm<UpdateComicFilesData>({
		defaultValues: {
			cover: undefined,
			logo: undefined,
			pfp: undefined,
			banner: undefined,
		},
		resolver: yupResolver(uploadAssetsValidationSchema) as Resolver<UpdateComicFilesData>,
	})
	const { mutateAsync: updateComicFiles } = useUpdateComicFiles(comicSlug)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	const handleSaveAndClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit)()
	}

	const handleSaveAndGoNext = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit)()
	}

	const handleFormSubmit = async (data: UpdateComicFilesData) => {
		const formData = new FormData()

		if (data.cover) formData.append('cover', data.cover)
		if (data.banner) formData.append('banner', data.banner)
		if (data.pfp) formData.append('pfp', data.pfp)
		if (data.logo) formData.append('logo', data.logo)

		await updateComicFiles(formData)
		router.push(nextPage)
	}

	return (
		<>
			<Header title='Create Comic' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: false },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Connect social', isActive: false },
				]}
			/>

			<main>
				<Form padding minSize='md' className='form--edit-comic-assets'>
					<div className='comic-file-wrapper'>
						<div className='comic-file-container'>
							<Label isRequired tooltipText='.jpg or .jpeg formats preferred, .png allowed'>
								Comic Cover
							</Label>
							<FileUpload
								id='cover-upload'
								label='Choose a picture 663x1024px'
								className='comic-cover-input'
								onUpload={(files) => {
									setValue('cover', files[0].file)
								}}
								ref={register('cover').ref}
							/>
						</div>
						<div className='comic-file-container'>
							<Label isRequired tooltipText='.png if transparent background, otherwise .jpg or .jpeg'>
								Comic Banner
							</Label>
							<FileUpload
								id='banner-upload'
								label='Choose a picture 1600x900px'
								className='comic-banner-input'
								onUpload={(files) => {
									setValue('banner', files[0].file)
								}}
								ref={register('banner').ref}
							/>
						</div>
					</div>
					<div className='comic-file-wrapper'>
						<div className='comic-file-container'>
							<Label isRequired tooltipText='.png or .gif with transparent background'>
								Comic Logo
							</Label>
							<FileUpload
								id='logo-upload'
								label='Choose a picture 512x512px'
								className='comic-logo-input'
								onUpload={(files) => {
									setValue('logo', files[0].file)
								}}
								ref={register('logo').ref}
							/>
						</div>
						<div className='comic-file-container'>
							<Label isRequired tooltipText='.png if transparent background, otherwise .jpg, .jpeg, or .gif'>
								Comic PFP
							</Label>
							<FileUpload
								id='pfp-upload'
								label='Choose a picture 512x512px'
								className='comic-pfp-input'
								onUpload={(files) => {
									setValue('pfp', files[0].file)
								}}
								ref={register('pfp').ref}
							/>
						</div>
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
