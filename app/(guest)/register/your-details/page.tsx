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
import { RoutePath } from 'enums/routePath'
import { yourDetailsValidationSchema } from '@/components/forms/schemas'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Textarea from '@/components/forms/Textarea'

export default function UpdateYourCreatorDetailsPage() {
	const router = useRouter()
	const { data: me } = useFetchMe()
	const { mutateAsync: updateCreator } = useUpdateCreator(me?.slug || '')
	const { register, handleSubmit, reset } = useForm<UpdateCreatorData>({
		defaultValues: {
			description: '',
			flavorText: '',
		},
		resolver: yupResolver(yourDetailsValidationSchema) as Resolver<UpdateCreatorData>,
	})

	useAuthenticatedRoute(RoutePath.Register)

	useEffect(() => {
		if (me) {
			reset({
				description: me.description || '',
				flavorText: me.flavorText || '',
			})
		}
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

			<main className='register-page'>
				<>
					<h1 className='title' style={{ visibility: me?.name ? 'visible' : 'hidden' }}>
						Hi {me?.name}
					</h1>

					<Form padding centered fullWidth maxSize='md'>
						<Label>Short biography</Label>
						<div className='description'>Your bio will be displayed on your dReader creator page</div>
						<Textarea
							maxCharacters={256}
							rows={5}
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

						<FormActions centered>
							<Button type='submit' onClick={onSubmitClick} backgroundColor='green-500' className='action-button'>
								Next <ArrowRightIcon className='action-button-icon' />
							</Button>
						</FormActions>
					</Form>
				</>
			</main>
		</>
	)
}
