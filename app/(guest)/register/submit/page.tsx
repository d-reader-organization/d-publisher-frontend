'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useFetchMe } from 'api/creator'
import { useRouter } from 'next/navigation'
import { RoutePath } from 'enums/routePath'
import Container from '@mui/material/Container'
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'

export default function SubmitCreatorRegistrationPage() {
	const router = useRouter()
	const { data: me } = useFetchMe()

	useAuthenticatedRoute(RoutePath.Register)

	const onSubmit = () => {
		router.push(RoutePath.Dashboard)
	}

	return (
		<>
			<Header image={<LogoIcon />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Your details', isActive: false },
					{ label: '03 Visual Identity', isActive: false },
					{ label: '04 Connect socials', isActive: false },
					{ label: '05 Submit', isActive: true },
				]}
			/>

			<main className='register-page register-page--submit'>
				<Container maxWidth='sm' className='container form'>
					{me ? (
						<>
							<Image
								priority
								src={me?.avatar || '' /* TODO: fallback avatar image */}
								width={140}
								height={140}
								alt=''
								className='avatar-image'
							/>
							<h1 className='title'>
								Welcome <span style={{ whiteSpace: 'pre' }}>{me.name}</span>
							</h1>
							<p className='subtitle'>
								Account review pending
								<br />
								Review time is around 12-24 hours. In the meantime, you can start creating!
							</p>
							<Button onClick={onSubmit} backgroundColor='green-100' className='action-button'>
								Start creating <ArrowRightIcon className='action-button-icon' />
							</Button>
						</>
					) : (
						<div className='loading-spinner'>
							<CircularProgress />
						</div>
					)}
				</Container>
			</main>
		</>
	)
}
