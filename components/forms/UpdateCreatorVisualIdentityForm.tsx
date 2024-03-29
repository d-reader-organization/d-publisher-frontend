import React from 'react'

import Button from 'components/Button'
import { Resolver, useForm } from 'react-hook-form'
import { UpdateCreatorFilesData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { visualIdentityValidationSchema } from '@/components/forms/schemas'
import { useFetchMe } from '@/api/creator'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useUpdateCreatorFiles } from '@/api/creator/queries/useUpdateCreatorFiles'
import { creatorVisualIdentityTooltipText } from '@/constants/tooltips'
import FileUpload from './FileUpload'
import FormActions from './FormActions'
import Form from './Form'
import Label from './Label'
import { imageTypes } from '@/constants/fileTypes'
import { useToaster } from '@/providers/ToastProvider'

const UpdateCreatorVisualIdentityForm: React.FC = () => {
	const toaster = useToaster()

	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreatorFiles } = useUpdateCreatorFiles(me?.slug || '')

	const { register, setValue, handleSubmit } = useForm<UpdateCreatorFilesData>({
		defaultValues: {
			avatar: undefined,
			banner: undefined,
		},
		resolver: yupResolver(visualIdentityValidationSchema) as Resolver<UpdateCreatorFilesData>,
	})

	useAuthenticatedRoute()

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			const formData = new FormData()

			if (data.avatar) formData.append('avatar', data.avatar)
			if (data.banner) formData.append('banner', data.banner)
			if (data.logo) formData.append('logo', data.logo)

			await updateCreatorFiles(formData)
		}, toaster.onFormError)()
	}

	return (
		<Form fullWidth className='form--edit-visual-identity'>
			<Label centered isRequired tooltipText={creatorVisualIdentityTooltipText}>
				Add profile avatar & cover
			</Label>
			<div className='description'>Recommended sizes are 500x500px for avatar and 1920x900px for cover</div>
			<div className='profile-assets-upload'>
				<FileUpload
					id='banner-upload'
					label='Choose a picture 1920x900px'
					className='banner-upload'
					onUpload={(files) => {
						setValue('banner', files[0]?.file)
					}}
					ref={register('banner').ref}
					previewUrl={me?.banner}
					options={{ accept: imageTypes, maxFiles: 1 }}
				/>
				<FileUpload
					id='avatar-upload'
					label='500x500px'
					className='avatar-upload'
					onUpload={(files) => {
						setValue('avatar', files[0]?.file)
					}}
					ref={register('avatar').ref}
					previewUrl={me?.avatar}
					options={{ accept: imageTypes, maxFiles: 1 }}
				/>
			</div>

			<FormActions centered marginTop>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateCreatorVisualIdentityForm
