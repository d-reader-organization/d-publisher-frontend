import React, { useEffect } from 'react'

import Button from 'components/Button'
import Label from './Label'
import Input from '@/components/forms/Input'
import { Resolver, useForm } from 'react-hook-form'
import { UpdateCreatorData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFetchMe, useUpdateCreator } from '@/api/creator'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { connectSocialsValidationSchema } from './schemas'
import FormActions from './FormActions'
import Form from './Form'
import {
	removeTwitter,
	removeInstagram,
	removeHttps,
	removeLynkfire,
	prependTwitter,
	prependInstagram,
	prependHttps,
	prependLynkfire,
} from '@/utils/helpers'
import { useToaster } from '@/providers/ToastProvider'
import { handleTooltipText } from '@/constants/tooltips'

const UpdateCreatorSocialsForm: React.FC = () => {
	const toaster = useToaster()

	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreator } = useUpdateCreator(me?.slug || '')

	const { register, handleSubmit, reset } = useForm<UpdateCreatorData>({
		defaultValues: {
			twitter: removeTwitter(me?.twitter),
			instagram: removeInstagram(me?.instagram),
			website: removeHttps(me?.website),
			lynkfire: removeLynkfire(me?.lynkfire),
		},
		resolver: yupResolver(connectSocialsValidationSchema) as Resolver<UpdateCreatorData>,
	})

	useAuthenticatedRoute()

	useEffect(() => {
		if (me) {
			reset({
				twitter: removeTwitter(me.twitter),
				instagram: removeInstagram(me.instagram),
				website: removeHttps(me.website),
				lynkfire: removeLynkfire(me.lynkfire),
			})
		}
	}, [me, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			const sanitizedWebsite = removeHttps(data.website)

			const formattedData = {
				twitter: prependTwitter(data.twitter),
				instagram: prependInstagram(data.instagram),
				website: prependHttps(sanitizedWebsite),
				lynkfire: prependLynkfire(data.lynkfire),
			}

			await updateCreator(formattedData)
		}, toaster.onFormError)()
	}

	return (
		<Form fullWidth>
			<div className='social-media-wrapper'>
				<div className='social-media-container'>
					<Label size='small' tooltipText={handleTooltipText}>
						Twitter
					</Label>
					<Input {...register('twitter')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small' tooltipText={handleTooltipText}>
						Instagram
					</Label>
					<Input {...register('instagram')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small' tooltipText={handleTooltipText}>
						Lynkfire
					</Label>
					<Input {...register('lynkfire')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Website</Label>
					<Input {...register('website')} prefix='https://' />
				</div>
			</div>

			<FormActions>
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateCreatorSocialsForm
