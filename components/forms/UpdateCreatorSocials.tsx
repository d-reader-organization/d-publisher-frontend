import React, { useEffect } from 'react'

import Button from 'components/Button'
import Label from 'components/Label'
import Input from 'components/Input'
import { useRouter } from 'next/navigation'
import { Resolver, useForm } from 'react-hook-form'
import { UpdateCreatorData } from 'models/creator'
import { yupResolver } from '@hookform/resolvers/yup'
import { RoutePath } from 'enums/routePath'
import { useFetchMe, useUpdateCreator } from '@/api/creator'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { connectSocialsValidationSchema } from './schemas'
import FormActions from '../FormActions'
import Form from '../Form'
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

const UpdateCreatorSocials: React.FC = () => {
	const router = useRouter()

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
			const formattedData = {
				twitter: prependTwitter(data.twitter),
				instagram: prependInstagram(data.instagram),
				website: prependHttps(data.website),
				lynkfire: prependLynkfire(data.lynkfire),
			}

			await updateCreator(formattedData)
			router.push(RoutePath.RegisterSubmit)
		})()
	}

	return (
		<Form fullWidth minSize='sm'>
			<div className='social-media-wrapper'>
				<div className='social-media-container'>
					<Label size='small'>Twitter</Label>
					<Input {...register('twitter')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Instagram</Label>
					<Input {...register('instagram')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Lynkfire</Label>
					<Input {...register('lynkfire')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Website</Label>
					<Input {...register('website')} prefix='https://' />
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

export default UpdateCreatorSocials
