'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import Label from 'components/Label'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useFetchMe, useUpdateCreator } from 'api/creator'
import { UpdateCreatorData } from 'models/creator'
import Textarea from 'components/Textarea'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RoutePath } from 'enums/routePath'
import CircularProgress from '@mui/material/CircularProgress'
import { yourDetailsValidationSchema } from '../schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'

export default function UpdateYourCreatorDetailsPage() {
	const router = useRouter()
	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreator } = useUpdateCreator(me?.slug || '')
	const { register, handleSubmit, reset } = useForm<UpdateCreatorData>({
		defaultValues: {
			description: me?.description || '',
			flavorText: me?.flavorText || '',
		},
		resolver: yupResolver(yourDetailsValidationSchema) as Resolver<UpdateCreatorData>,
	})

	useAuthenticatedRoute(RoutePath.Register)

	useEffect(() => {
		reset({
			description: me?.description || '',
			flavorText: me?.flavorText || '',
		})
	}, [me, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await updateCreator(data)
			router.push(RoutePath.RegisterVisualIdentity)
		})()
	}

	return (
		<>
			<Header image={<LogoIcon />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Your details', isActive: true },
					{ label: '03 Visual Identity', isActive: false },
					{ label: '04 Connect socials', isActive: false },
					{ label: '05 Submit', isActive: false },
				]}
			/>

			<main className='register-page register-page--visual-identity'>
				{me ? (
					<>
						<h1 className='title'>Hi {me.name}</h1>

						<form className='form'>
							<Label>Short biography</Label>
							<div className='description'>Your bio will be displayed on your dReader creator page</div>
							<Textarea
								maxCharacters={256}
								rows={6}
								{...register('description')}
								placeholder='Emmy award winning visual development studio. Film, television, gaming, publishing...'
							/>
							<Label>Flavor text</Label>
							<div className='description'>
								Flavor text will be displayed beneath the description, as a small testimonial
							</div>
							<Textarea
								maxCharacters={128}
								rows={2}
								{...register('flavorText')}
								placeholder="Best studio I've ever worked with - my mom"
							/>
							<Button type='submit' onClick={onSubmitClick} backgroundColor='green-100' className='action-button'>
								Next <ArrowRightIcon className='action-button-icon' />
							</Button>
						</form>
					</>
				) : (
					<div className='loading-spinner'>
						<CircularProgress />
					</div>
				)}
			</main>
		</>
	)
}
