'use client'

import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/navigation'
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
import HintDrawer from '@/components/layout/HintDrawer'
import Box from '@mui/material/Box'

interface Params {
	slug: string
}

export default function ConnectComicSocialsPage({ params }: { params: Params }) {
	const router = useRouter()
	const toaster = useToaster()
	const comicSlug = params.slug || ''
	const nextPage = RoutePath.CreateComicIssue(comicSlug)

	const { register, handleSubmit } = useForm<UpdateComicSocialsData>({
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
		await handleSubmit(handleFormSubmit, toaster.onFormError)()
		router.push(RoutePath.Dashboard)
	}

	const handleSaveAndGoNext = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		handleSubmit(handleFormSubmit, toaster.onFormError)()
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
			<Header title='Create comic series' />
			<Steps
				steps={[
					{ label: '01 Create comic', isActive: false },
					{ label: '02 Upload assets', isActive: false },
					{ label: '03 Connect social', isActive: true },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<Form padding maxSize='sm' fullWidth className='form--edit-comic-socials'>
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

				<HintDrawer>
					<Box px={2.5} py={1}>
						In case your comic series has any social media links, feel free to add them. These links will be shown on
						the comic series page.
					</Box>
				</HintDrawer>
			</main>
		</>
	)
}
