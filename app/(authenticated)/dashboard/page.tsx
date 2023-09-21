'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import DashboardStats from '@/components/DashboardStats'
import ContentTable from '@/components/ContentTable'
import { useFetchMe } from '@/api/creator'

export default function DashboardPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	return (
		<>
			<Header title={me?.name ? `Hi, ${me.name}` : 'Hi,'} />
			{/* <DashboardStats /> */}
			<ContentTable />
		</>
	)
}
