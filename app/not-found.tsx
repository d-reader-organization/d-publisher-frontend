'use client'

import ButtonLink from '@/components/ButtonLink'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import FormActions from '@/components/forms/FormActions'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { RoutePath } from '@/enums/routePath'
import 'app/styles/app.scss'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function PageNotFound() {
	const router = useRouter()
	const { isAuthenticated } = useCreatorAuth()

	return (
		<main className='not-found-page'>
			<h1 className='title'>Page not found</h1>
			<p className='description'>
				The page you were looking for was <span className='description--highlighted'>not found</span>!
			</p>

			<FormActions centered className='actions'>
				{isAuthenticated ? (
					<>
						<Button
							onClick={() => {
								router.back()
							}}
							backgroundColor='grey-100'
							className='action-button'
						>
							Go Back
						</Button>
						<ButtonLink href={RoutePath.Dashboard} backgroundColor='green-100' className='action-button'>
							Dashboard
							<ArrowRightIcon className='action-button-icon' />
						</ButtonLink>
					</>
				) : (
					<>
						<ButtonLink href={RoutePath.Register} backgroundColor='grey-100' className='action-button'>
							Register
						</ButtonLink>
						<ButtonLink href={RoutePath.Login} backgroundColor='green-100' className='action-button'>
							Login
						</ButtonLink>
					</>
				)}
			</FormActions>

			<div className='footer'>
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
