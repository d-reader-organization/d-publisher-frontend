'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchRawComicIssue } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import UpdateComicIssueCoversForm from '@/components/forms/UpdateComicIssueCoversForm'

interface Params {
	id: string | number
}

export default function MakeCollectibleCoverVariants({ params }: { params: Params }) {
	const comicIssueId = params.id || ''
	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const nextPage = RoutePath.ComicIssueMakeCollectibleGamifiedCovers(comicIssueId)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	if (!comicIssue) {
		return null
	}

	return (
		<>
			<Header title='Publish collectibles' />
			<Steps
				steps={[
					{ label: '01 Cover variants', isActive: true },
					{ label: '02 Gamified covers', isActive: false },
					{ label: '03 Sale details', isActive: false },
				]}
			/>

			<main>
				<UpdateComicIssueCoversForm comicIssue={comicIssue} />
			</main>
		</>
	)
}
