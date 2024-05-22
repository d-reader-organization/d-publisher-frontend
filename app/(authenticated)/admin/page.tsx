'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import ComicList from '@/components/ComicList'
import { useFetchMe } from '@/api/creator'
import CreatorList from '@/components/CreatorList'
import { Role } from '@/enums/role'

export default function AdminPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()
	if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null

	return (
		<>
			<Header title={`Hi, ${me.name}`} />
			<CreatorList title='creators' enabled />
			<ComicList title='comics' enabled isAdmin />
		</>
	)
}
