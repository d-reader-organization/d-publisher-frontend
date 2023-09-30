'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter, useParams } from 'next/navigation'

import Header from 'components/layout/Header'
import Input from '@/components/forms/Input'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { RoutePath } from 'enums/routePath'
import { prependHttps, prependTwitter, prependInstagram, prependTikTok, prependYouTube } from 'utils/helpers'
import { UpdateComicSocialsData } from 'models/comic'
import { useUpdateComic } from 'api/comic'
import { connectComicSocialsValidationSchema } from '@/components/forms/schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { useToaster } from '@/providers/ToastProvider'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'

export default function ConnectComicSocialsPage() {
	const router = useRouter()
	const toaster = useToaster()
	const params = useParams()
	const comicSlug = params['slug'] || ''
	const nextPage = RoutePath.CreateComicIssue(comicSlug)

	const { register, handleSubmit: onSubmit } = useForm<UpdateComicSocialsData>({
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
	const { mutateAsync: updateComic } = useUpdateComic(comicSlug)

	usePrefetchRoute([nextPage, RoutePath.Dashboard])
	useAuthenticatedRoute()

	const handleSaveAndClose = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		await onSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(RoutePath.Dashboard)
	}

	const handleSaveAndGoNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		onSubmit(handleFormSubmit, toaster.onFormError)()
	}

	const handleFormSubmit = async (data: UpdateComicSocialsData) => {
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
		router.push(nextPage)
	}

	return (
		<>
			<Header title='Create Comic' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: false },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Connect social', isActive: true },
				]}
			/>

			<main>
				<Form padding maxSize='md' fullWidth className='form--edit-comic-socials'>
					<Label className='group-label'>Additional Links</Label>
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
