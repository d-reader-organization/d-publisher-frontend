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
import { handleTooltipText } from '@/constants/tooltips'

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
			const sanitizedWebsite = removeHttps(data.website)
			const sanitizedDiscord = removeHttps(data.discord)
			const sanitizedTelegram = removeHttps(data.telegram)

			const requestData: UpdateComicSocialsData = {
				website: prependHttps(sanitizedWebsite),
				twitter: prependTwitter(data.twitter),
				instagram: prependInstagram(data.instagram),
				tikTok: prependTikTok(data.tikTok),
				youTube: prependYouTube(data.youTube),
				discord: prependHttps(sanitizedDiscord),
				telegram: prependHttps(sanitizedTelegram),
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
						TikTok
					</Label>
					<Input {...register('tikTok')} prefix='@' />
				</div>
				<div className='social-media-container'>
					<Label size='small' tooltipText={handleTooltipText}>
						YouTube
					</Label>
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
				<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
					Update
				</Button>
			</FormActions>
		</Form>
	)
}

export default UpdateComicSocialsForm
