import { useEffect } from 'react'
import { NextPage } from 'next'
import { useAuth } from '@open-sauce/solomon'
import { useRouter } from 'next/router'

import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Button from 'components/Button'
import SolflareIcon from 'public/assets/vector-icons/solflare.svg'
import PhantomIcon from 'public/assets/vector-icons/phantom.svg'

const HomePage: NextPage = () => {
	const router = useRouter()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (isAuthenticated) router.push('/dashboard')
	}, [isAuthenticated, router])

	return (
		<main className='index'>
			<div>
				<h1 className='title'>Welcome artist & creators</h1>
			</div>
			<div>
				<ConnectWalletButton />
				<div className='wallet-text'>Don&apos;t have a wallet yet?</div>
				<div className='wallet-link-wrapper'>
					<a href='https://solflare.com/download' target='_blank' className='wallet-link'>
						<Button backgroundColor='transparent' borderColor='grey-100' className='wallet-link-button'>
							<SolflareIcon className='wallet-link-icon' /> Get Solflare
						</Button>
					</a>
					<a href='https://phantom.app/download' target='_blank' className='wallet-link'>
						<Button backgroundColor='transparent' borderColor='grey-100' className='wallet-link-button'>
							<PhantomIcon className='wallet-link-icon' />
							Get Phantom
						</Button>
					</a>
				</div>
			</div>
			<div>
				<LogoWithTextIcon className='logo' />
				<p className='description'>
					dPublisher is the onboarding platform for creators on{' '}
					<span className='description--highlighted'>dReader app</span>.
				</p>
				<p className='description'>Sign with your wallet & start creating.</p>
			</div>
		</main>
	)
}

export default HomePage
