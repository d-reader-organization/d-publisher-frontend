'use client'

import { useRouter } from 'next/navigation'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { RoutePath } from 'enums/routePath'
import Button from 'components/Button'
import useGuestRoute from '@/hooks/useCreatorGuestRoute'

export default function Home() {
	const router = useRouter()

	useGuestRoute()

	return (
		<main className='index'>
			<h1 className='title'>Welcome artist & creators</h1>

			<div className='actions'>
				<Button
					onClick={() => {
						router.push(RoutePath.Register)
					}}
					backgroundColor='grey-100'
					className='action-button'
				>
					Register
				</Button>
				<Button
					onClick={() => {
						router.push(RoutePath.Login)
					}}
					backgroundColor='green-100'
					className='action-button'
				>
					Login
				</Button>
			</div>

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
