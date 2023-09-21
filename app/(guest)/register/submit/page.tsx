'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import Button from 'components/Button'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import AvatarPlaceholderImage from 'public/assets/images/avatar-placeholder.jpg'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import SkeletonImage from '@/components/SkeletonImage'
import SkeletonText from '@/components/SkeletonText'
import Container from '@mui/material/Container'
import { useRouter } from 'next/navigation'
import { useFetchMe } from 'api/creator'
import { RoutePath } from 'enums/routePath'
import FormActions from '@/components/FormActions'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import Form from '@/components/Form'

export default function SubmitCreatorRegistrationPage() {
	const router = useRouter()

	const nextPage = RoutePath.Dashboard

	const { data: me } = useFetchMe()

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute(RoutePath.Register)

	const onSubmit = () => {
		router.push(nextPage)
	}

	// if user is fetched but has no avatar defined, fallback to placeholder
	const avatar = me && !me.avatar ? AvatarPlaceholderImage : me?.avatar

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
				<Form padding centered maxSize='sm' className='container form form--submit-registration'>
					<SkeletonImage priority src={avatar} width={140} height={140} alt='' className='avatar-image' />
					<h1 className='title'>
						Welcome&nbsp;
						<br />
						<SkeletonText isLoading={!me?.name} className='title'>
							{me?.name}
						</SkeletonText>
					</h1>

					<p className='subtitle'>
						Account review pending
						<br />
						<br />
						Verification mail has been sent to your email.
						<br />
						<br />
						Review time is around 2-3 days. In the meantime, you can start creating!
					</p>

					<FormActions centered>
						<Button onClick={onSubmit} backgroundColor='green-100' className='action-button'>
							Start creating <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
