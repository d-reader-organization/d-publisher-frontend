'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFetchMe, useUpdateCreator } from 'api/creator'
import { UpdateCreatorData } from 'models/creator'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/forms/Input'
import {
	prependHttps,
	prependInstagram,
	prependLynkfire,
	prependTwitter,
	removeHttps,
	removeInstagram,
	removeLynkfire,
	removeTwitter,
} from 'utils/helpers'
import { RoutePath } from 'enums/routePath'
import { connectSocialsValidationSchema } from '@/components/forms/schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import { useToaster } from '@/providers/ToastProvider'

export default function ConnectCreatorSocialsPage() {
	const router = useRouter()
	const toaster = useToaster()
	const nextPage = RoutePath.RegisterSubmit

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

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute(RoutePath.Register)

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

	const onSkipClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		router.push(nextPage)
	}

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
			router.push(nextPage)
		}, toaster.onFormError)()
	}

	return (
		<>
			<Header image={<LogoIcon />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Your details', isActive: false },
					{ label: '03 Visual Identity', isActive: false },
					{ label: '04 Connect socials', isActive: true },
					{ label: '05 Submit', isActive: false },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Connect socials</h1>
				<p className='subtitle'>Artists with connected socials perform 30% greater</p>

				<Form centered fullWidth maxSize='sm'>
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

					<FormActions centered>
						<Button
							type='submit'
							onClick={onSkipClick}
							backgroundColor='transparent'
							borderColor='grey-100'
							className='action-button'
						>
							Skip
						</Button>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
							Submit <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
