'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from '@/api/creator'
import { useRouter } from 'next/navigation'
import Expandable from '@/components/Expandable'
import RegisterForm from '@/components/forms/RegisterForm'

export default function ProfilePage() {
	const router = useRouter()
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	const header = <Header title='Edit Account' />
	if (!me) return header

	return (
		<>
			{header}

			<main className='profile-page'>
				<Expandable title='Basic info'>
					<RegisterForm />
				</Expandable>
				<Expandable title='Your details'>Your Details</Expandable>
				<Expandable title='Visual Identity'>Visual Identity</Expandable>
				<Expandable title='Socials'>Socials</Expandable>
			</main>
		</>
	)
}
