'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from '@/api/creator'

export default function ComicPage({ params }: { params: { slug: string } }) {
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
