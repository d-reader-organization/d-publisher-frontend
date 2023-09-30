'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import UpdateComicBasicInfoForm from '@/components/forms/UpdateComicBasicInfoForm'
import UpdateComicAssetsForm from '@/components/forms/UpdateComicAssetsForm'
import UpdateComicSocialsForm from '@/components/forms/UpdateComicSocialsForm'
import Expandable from '@/components/Expandable'
import { useFetchRawComic } from '@/api/comic'
import { useFetchGenres } from '@/api/genre'

interface Params {
	slug: string
}

export default function EditPage({ params }: { params: Params }) {
	const { data: comic } = useFetchRawComic(params.slug)
	const { data: genres } = useFetchGenres()

	useAuthenticatedRoute()

	if (!comic || !genres) return null

	return (
		<>
			<Header title={`Edit ${comic?.title}`} />
			<main className='profile-page'>
				<Expandable title='Basic details'>
					<UpdateComicBasicInfoForm comic={comic} genres={genres} />
				</Expandable>
				<Expandable title='Visual assets'>
					<UpdateComicAssetsForm comic={comic} />
				</Expandable>
				<Expandable title='Socials'>
					<UpdateComicSocialsForm comic={comic} />
				</Expandable>
			</main>
		</>
	)
}
