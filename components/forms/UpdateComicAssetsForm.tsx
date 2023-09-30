import React from 'react'

import Button from 'components/Button'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { uploadComicAssetsValidationSchema } from './schemas'
import Form from './Form'
import Label from './Label'
import FormActions from './FormActions'
import { useUpdateComicFiles } from '@/api/comic'
import { RawComic } from '@/models/comic/rawComic'
import { UpdateComicFilesData } from '@/models/comic'
import {
	comicBannerTooltipText,
	comicCoverTooltipText,
	comicLogoTooltipText,
	comicPfpTooltipText,
} from '@/constants/tooltips'
import { useToaster } from '@/providers/ToastProvider'
import FileUpload from './FileUpload'
import { imageTypes } from '@/constants/fileTypes'

interface Props {
	comic: RawComic
}

const UpdateComicAssetsForm: React.FC<Props> = ({ comic }) => {
	const toaster = useToaster()

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
		resolver: yupResolver(uploadComicAssetsValidationSchema) as Resolver<UpdateComicFilesData>,
	})
	const { mutateAsync: updateComicFiles, isLoading: isUploadingFiles } = useUpdateComicFiles(comic.slug)

	const onSubmitClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		await onSubmit(handleFormSubmit, toaster.onFormError)()
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
		<Form fullWidth className='form--edit-comic-assets'>
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
						previewUrl={comic.banner}
						isUploading={isUploadingFiles}
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
						previewUrl={comic.cover}
						isUploading={isUploadingFiles}
						options={{ accept: imageTypes, maxFiles: 1 }}
					/>
				</div>

				<div className='comic-file-container'>
					<Label tooltipText={comicPfpTooltipText}>Comic &quot;Avatar&quot; (PFP)</Label>
					<FileUpload
						id='pfp-upload'
						label='500x500px'
						className='comic-pfp-input'
						onUpload={(files) => {
							setValue('pfp', files[0]?.file)
						}}
						ref={register('pfp').ref}
						previewUrl={comic.pfp}
						isUploading={isUploadingFiles}
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
						previewUrl={comic.logo}
						isUploading={isUploadingFiles}
						options={{ accept: imageTypes, maxFiles: 1 }}
					/>
				</div>
			</div>

			<FormActions>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateComicAssetsForm
