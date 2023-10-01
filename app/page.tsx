'use client'

import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { RoutePath } from 'enums/routePath'
import useGuestRoute from '@/hooks/useCreatorGuestRoute'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'

export default function Home() {
	useGuestRoute()

	return (
		<main className='index'>
			<h1 className='title'>Welcome artist & creators</h1>

			<FormActions className='actions'>
				<ButtonLink href={RoutePath.Register} backgroundColor='grey-100' className='action-button'>
					Register
				</ButtonLink>
				<ButtonLink href={RoutePath.Login} backgroundColor='green-500' className='action-button'>
					Login
				</ButtonLink>
			</FormActions>

			<div>
				<LogoWithTextIcon className='logo' />
				<p className='description'>
					dPublisher is the onboarding platform for creators on&nbsp;
					<span className='description--highlighted'>dReader app</span>.
				</p>
				<p className='description'>Sign in & start creating.</p>
			</div>
		</main>
	)
}
