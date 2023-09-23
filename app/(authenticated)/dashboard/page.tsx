'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import ComicList from '@/components/ComicList'
import { useFetchMe } from '@/api/creator'

export default function DashboardPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	return (
		<>
			<Header title={me?.name ? `Hi, ${me.name}` : 'Hi,'} />
			{/* <DashboardStats /> */}
			<ComicList />
		</>
	)
}
