import React, { useEffect } from 'react'

import Button from 'components/Button'
import Label from 'components/Label'
import Input from 'components/Input'
import { useRouter } from 'next/navigation'
import { Resolver, useForm } from 'react-hook-form'
import { UpdateCreatorData, UpdateCreatorFilesData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { RoutePath } from 'enums/routePath'
import { updateCreatorValidationSchema, visualIdentityValidationSchema } from './schemas'
import { useFetchMe, useUpdateCreator } from '@/api/creator'
import FormActions from '../FormActions'
import Textarea from '../Textarea'
import Form from '../Form'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useUpdateCreatorFiles } from '@/api/creator/queries/useUpdateCreatorFiles'
import FileUpload from '../FileUpload'

const UpdateCreatorVisualIdentity: React.FC = () => {
	const router = useRouter()

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
			router.push(RoutePath.RegisterConnectSocials)
		})()
	}

	return (
		<Form fullWidth className='form--edit-visual-identity'>
			<Label centered isRequired tooltipText='.jpg and .jpeg preferred if no transparency'>
				Add profile avatar & cover
			</Label>
			<div className='description'>Recommended sizes are 500 x 500px for avatar and 680 x 320px for cover</div>
			<div className='profile-assets-upload'>
				<FileUpload
					id='banner-upload'
					label='Upload cover'
					className='banner-upload'
					onFileObtain={(files) => {
						setValue('banner', files[0].file)
					}}
					ref={register('banner').ref}
					previewUrl={me?.banner}
				/>
				<FileUpload
					id='avatar-upload'
					label='Upload avatar'
					className='avatar-upload'
					onFileObtain={(files) => {
						setValue('avatar', files[0].file)
					}}
					ref={register('avatar').ref}
					previewUrl={me?.avatar}
				/>
			</div>

			<FormActions centered marginTop>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateCreatorVisualIdentity
