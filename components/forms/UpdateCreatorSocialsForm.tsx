import React, { useEffect, useState } from 'react'

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
import { useFetchDiscordAuthorization } from '@/api/creator/queries/usefetchDiscordAuthorization'
import { useUpdateCreatorDiscord } from '@/api/creator/queries/useUpdateCreatorDiscord'

const UpdateCreatorSocialsForm: React.FC = () => {
	const toaster = useToaster()
	const [prevCode, setPrevCode] = useState<string | null>(null)
	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreator } = useUpdateCreator(me?.slug || '')
	const { refetch: fetchDiscordAuthorization } = useFetchDiscordAuthorization(false)
	const [discordUpdated, setDiscordUpdated] = useState(false)
	const { mutateAsync: updateCreatorDiscord } = useUpdateCreatorDiscord()
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
		}, toaster.onFormError)()
	}

	const onConnectDiscordClick = async () => {
		try {
			const { data: authorizationUri } = await fetchDiscordAuthorization()
			if (authorizationUri) {
				window.location.href = authorizationUri
			}
		} catch (error) {
			toaster.add('Failed to fetch Discord authorization URI.', 'error')
		}
	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search)
		const code = params.get('code')
		if (code && code !== prevCode) {
			updateCreatorDiscord({ slug: me?.slug || '', code })
				.then(() => {
					setDiscordUpdated(true)
				})
				.catch((error) => {
					console.error('Failed to update Discord ID:', error)
				})
			setPrevCode(code)
		}
	}, [me, prevCode, updateCreatorDiscord])

	useEffect(() => {
		if (discordUpdated) {
			setTimeout(() => {
				window.location.href = '/profile'
			}, 2000)
		}
	}, [discordUpdated])
	return (
		<Form fullWidth>
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
			<div className='discord-button'>
				<Button type='button' onClick={onConnectDiscordClick} backgroundColor='transparent' borderColor='grey-100'>
					Connect Discord
				</Button>
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
