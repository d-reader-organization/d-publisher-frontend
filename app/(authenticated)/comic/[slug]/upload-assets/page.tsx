'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { UpdateComicFilesData } from 'models/comic'
import { RoutePath } from 'enums/routePath'
import { useUpdateComicFiles } from 'api/comic'
import { uploadComicAssetsValidationSchema } from '@/components/forms/schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useToaster } from '@/providers/ToastProvider'
import {
	comicBannerTooltipText,
	comicCoverTooltipText,
	comicLogoTooltipText,
	comicPfpTooltipText,
} from '@/constants/tooltips'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import { imageTypes } from '@/constants/fileTypes'

export default function UploadComicAssetsPage() {
	const router = useRouter()
	const toaster = useToaster()
	const params = useParams()
	const comicSlug = params['slug'] || ''
	const nextPage = RoutePath.ComicConnectSocials(comicSlug)

	const { register, setValue, handleSubmit } = useForm<UpdateComicFilesData>({
		defaultValues: {
			cover: undefined,
			logo: undefined,
			pfp: undefined,
			banner: undefined,
		},
		resolver: yupResolver(uploadComicAssetsValidationSchema) as Resolver<UpdateComicFilesData>,
	})
	const { mutateAsync: updateComicFiles } = useUpdateComicFiles(comicSlug)

	usePrefetchRoute([nextPage, RoutePath.Dashboard])
	useAuthenticatedRoute()

	const handleSaveAndClose = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		await handleSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(RoutePath.Dashboard)
	}

	const handleSaveAndGoNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		await handleSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(nextPage)
	}

	const handleFormSubmit = async (data: UpdateComicFilesData) => {
		const formData = new FormData()

		if (data.cover) formData.append('cover', data.cover)
		if (data.banner) formData.append('banner', data.banner)
		if (data.pfp) formData.append('pfp', data.pfp)
		if (data.logo) formData.append('logo', data.logo)

		await updateComicFiles(formData)
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
				<Form padding maxSize='lg' fullWidth className='form--edit-comic-assets'>
					<div className='comic-file-wrapper'>
						<div className='comic-file-container'>
							<Label isRequired tooltipText={comicBannerTooltipText}>
								Comic Banner
							</Label>
							<FileUpload
								id='banner-upload'
								label='Choose a picture 1920x900px'
								className='comic-banner-input'
								onUpload={(files) => {
									setValue('banner', files[0]?.file)
								}}
								ref={register('banner').ref}
								options={{ accept: imageTypes, maxFiles: 1 }}
							/>
						</div>
					</div>
					<div className='comic-file-wrapper'>
						<div className='comic-file-container'>
							<Label isRequired tooltipText={comicCoverTooltipText}>
								Comic series cover
							</Label>
							<FileUpload
								id='cover-upload'
								label='1000x900px'
								className='comic-cover-input'
								onUpload={(files) => {
									setValue('cover', files[0]?.file)
								}}
								ref={register('cover').ref}
								options={{ accept: imageTypes, maxFiles: 1 }}
							/>
						</div>

						<div className='comic-file-container'>
							<Label tooltipText={comicPfpTooltipText}>Comic Avatar/PFP</Label>
							<FileUpload
								id='pfp-upload'
								label='500x500px'
								className='comic-pfp-input'
								onUpload={(files) => {
									setValue('pfp', files[0]?.file)
								}}
								ref={register('pfp').ref}
								options={{ accept: imageTypes, maxFiles: 1 }}
							/>
						</div>

						<div className='comic-file-container'>
							<Label isRequired tooltipText={comicLogoTooltipText}>
								Comic Logo (title)
							</Label>
							<FileUpload
								id='logo-upload'
								label='800x450px'
								className='comic-logo-input'
								onUpload={(files) => {
									setValue('logo', files[0]?.file)
								}}
								ref={register('logo').ref}
								options={{ accept: imageTypes, maxFiles: 1 }}
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
