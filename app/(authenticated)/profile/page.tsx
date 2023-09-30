'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import UpdateCreatorBasicInfoForm from '@/components/forms/UpdateCreatorBasicInfoForm'
import UpdateCreatorVisualIdentityForm from '@/components/forms/UpdateCreatorVisualIdentityForm'
import UpdateCreatorSocialsForm from '@/components/forms/UpdateCreatorSocialsForm'
import Expandable from '@/components/Expandable'
import { useFetchMe } from '@/api/creator'

export default function ProfilePage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	const header = <Header title='Edit Account' />
	if (!me) return header

	return (
		<>
			{header}

			<main className='profile-page'>
				<Expandable title='Basic info'>
					<UpdateCreatorBasicInfoForm />
				</Expandable>
				<Expandable title='Visual identity'>
					<UpdateCreatorVisualIdentityForm />
				</Expandable>
				<Expandable title='Socials'>
					<UpdateCreatorSocialsForm />
				</Expandable>
			</main>
		</>
	)
}
