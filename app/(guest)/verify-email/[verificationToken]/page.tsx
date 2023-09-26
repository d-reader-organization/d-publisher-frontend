'use client'

import { useEffect } from 'react'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useFetchMe, useVerifyCreatorEmail } from '@/api/creator'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { RoutePath } from '@/enums/routePath'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'

interface Params {
	verificationToken: string
}

export default function VerifyEmailPage({ params }: { params: Params }) {
	const verificationToken = params?.verificationToken
	const { isAuthenticated } = useCreatorAuth()

	const { data: creator, mutateAsync: verifyEmail } = useVerifyCreatorEmail()
	const { data: me } = useFetchMe()

	useEffect(() => {
		if (verificationToken) {
			verifyEmail(verificationToken)
		}
	}, [verificationToken, verifyEmail])

	const name = creator?.name || me?.name || ''

	return (
		<main className='verify-email-page'>
			<h1 className='title'>
				Welcome
				<br />
				<span className='subtitle'>{'Josip test 1' || name}</span>
			</h1>
			<p className='description'>
				Your email has been <span className='description--highlighted'>successfully verified </span>! Now lets get
				started and create some awesome content!
			</p>

			<FormActions centered className='actions'>
				{isAuthenticated ? (
					<ButtonLink href={RoutePath.Dashboard} backgroundColor='green-100' className='action-button'>
						Start creating <ArrowRightIcon className='action-button-icon' />
					</ButtonLink>
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
