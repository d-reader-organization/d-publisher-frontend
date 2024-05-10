'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'

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
	comicBannerPreviews,
	comicBannerTooltipText,
	comicCoverPreviews,
	comicCoverTooltipText,
	comicLogoPreviews,
	comicLogoTooltipText,
} from '@/constants/tooltips'
import FileUpload from '@/components/forms/FileUpload'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import { imageTypes } from '@/constants/fileTypes'
import TooltipContent from '@/components/TooltipContent'
import { useLocalStorage } from '@/hooks'
import HintDrawer from '@/components/layout/HintDrawer'
import Box from '@mui/material/Box'
import HintWithImage from '@/components/HintWithImage'
import Expandable from '@/components/Expandable'

interface Params {
	slug: string
}

export default function UploadComicAssetsPage({ params }: { params: Params }) {
	const router = useRouter()
	const toaster = useToaster()
	const comicSlug = params.slug || ''
	const nextPage = RoutePath.ComicConnectSocials(comicSlug)
	const [isHintDrawerOpen] = useLocalStorage('hint-drawer-open', true)

	const { register, setValue, handleSubmit } = useForm<UpdateComicFilesData>({
		defaultValues: {
			cover: undefined,
			logo: undefined,
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
		if (data.logo) formData.append('logo', data.logo)

		await updateComicFiles(formData)
	}

	return (
		<>
			<Header title='Create comic series' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: false },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Connect social', isActive: false },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<Form padding maxSize='lg' fullWidth className='form--edit-comic-assets' hiddenOnMobile={isHintDrawerOpen}>
					<div className='comic-file-wrapper'>
						<div className='comic-file-container'>
							<Label isRequired tooltipText={<TooltipContent text={comicBannerTooltipText} />}>
								Comic banner
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
							<Label isRequired tooltipText={<TooltipContent text={comicCoverTooltipText} />}>
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
							<Label isRequired tooltipText={<TooltipContent text={comicLogoTooltipText} />}>
								Comic logo (title)
							</Label>
							<FileUpload
								id='logo-upload'
								label='landscape orientation'
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

				<HintDrawer>
					<Box>
						<Expandable title='Banner'>
							<HintWithImage previews={comicBannerPreviews} text={comicBannerTooltipText} />
						</Expandable>
						<Expandable title='Cover'>
							<HintWithImage previews={comicCoverPreviews} text={comicCoverTooltipText} />
						</Expandable>
						<Expandable title='Logo'>
							<HintWithImage previews={comicLogoPreviews} text={comicLogoTooltipText} />
						</Expandable>
					</Box>
				</HintDrawer>
			</main>
		</>
	)
}
