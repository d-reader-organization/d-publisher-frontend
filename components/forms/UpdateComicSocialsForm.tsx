import React, { useEffect } from 'react'

import Button from 'components/Button'
import Input from '@/components/forms/Input'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { connectComicSocialsValidationSchema } from './schemas'
import Form from './Form'
import Label from './Label'
import FormActions from './FormActions'
import { useUpdateComic } from '@/api/comic'
import { RawComic } from '@/models/comic/rawComic'
import { UpdateComicSocialsData } from '@/models/comic'
import { useToaster } from '@/providers/ToastProvider'
import {
	prependHttps,
	prependInstagram,
	prependTikTok,
	prependTwitter,
	prependYouTube,
	removeHttps,
	removeInstagram,
	removeTikTok,
	removeTwitter,
	removeYouTube,
} from '@/utils/helpers'

interface Props {
	comic: RawComic
}

const UpdateComicSocialsForm: React.FC<Props> = ({ comic }) => {
	const toaster = useToaster()

	const { mutateAsync: updateComic } = useUpdateComic(comic.slug)
	const { register, handleSubmit, reset } = useForm<UpdateComicSocialsData>({
		defaultValues: {
			website: undefined,
			twitter: undefined,
			discord: undefined,
			instagram: undefined,
			telegram: undefined,
			tikTok: undefined,
			youTube: undefined,
		},
		resolver: yupResolver(connectComicSocialsValidationSchema) as Resolver<UpdateComicSocialsData>,
	})

	useEffect(() => {
		if (comic) {
			reset({
				website: removeHttps(comic.website),
				twitter: removeTwitter(comic.twitter),
				instagram: removeInstagram(comic.instagram),
				tikTok: removeTikTok(comic.tikTok),
				youTube: removeYouTube(comic.youTube),
				discord: removeHttps(comic.discord),
				telegram: removeHttps(comic.telegram),
			})
		}
	}, [comic, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			const requestData: UpdateComicSocialsData = {
				website: prependHttps(data.website),
				twitter: prependTwitter(data.twitter),
				instagram: prependInstagram(data.instagram),
				tikTok: prependTikTok(data.tikTok),
				youTube: prependYouTube(data.youTube),
				discord: prependHttps(data.discord),
				telegram: prependHttps(data.telegram),
			}

			await updateComic(requestData)
		}, toaster.onFormError)()
	}

	return (
		<Form fullWidth className='form--edit-comic-socials'>
			<Label size='small'>Website</Label>
			<Input prefix='https://' {...register('website')} />
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
					<Label size='small'>TikTok</Label>
					<Input {...register('tikTok')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>YouTube</Label>
					<Input {...register('youTube')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Discord</Label>
					<Input {...register('discord')} prefix='https://' />
				</div>
				<div className='social-media-container'>
					<Label size='small'>Telegram</Label>
					<Input {...register('telegram')} prefix='https://' />
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

export default UpdateComicSocialsForm
