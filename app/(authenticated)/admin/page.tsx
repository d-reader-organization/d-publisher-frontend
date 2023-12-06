'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import ComicList from '@/components/ComicList'
import { useFetchMe } from '@/api/creator'
import CreatorList from '@/components/CreatorList'

export default function AdminPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	if (!me || me.email !== 'studionx@fake.com') return null

	return (
		<>
			<Header title={`Hi, ${me.name}`} />
			<CreatorList title='creators' />
			<ComicList title='comics' enabled />
		</>
	)
}
