'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from '@/api/creator'

interface Params {
	slug: string
}

export default function ComicPage({ params }: { params: Params }) {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	const header = <Header title='Comic' />
	if (!me) return header

	return (
		<>
			{header}

			<main className='profile-page'>
				<div>My comic: {params.slug}</div>
			</main>
		</>
	)
}
