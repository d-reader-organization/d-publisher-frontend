'use client'

import Header from 'components/layout/Header'
import Steps from 'components/Steps'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchRawComicIssue } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import UpdateComicIssueCoversForm from '@/components/forms/UpdateComicIssueCoversForm'
import HintDrawer from '@/components/layout/HintDrawer'
import { Box } from '@mui/material'
import Expandable from '@/components/Expandable'
import HintWithImage from '@/components/HintWithImage'
import { coverVariantsTooltipText, issueCoverImageTooltipText, issueCoverPreviews, issueCoverVariantsPreviews } from '@/constants/tooltips'
import { useRouter } from 'next/navigation'

interface Params {
	id: string | number
}

export default function MakeCollectibleCoverVariants({ params }: { params: Params }) {
	const comicIssueId = params.id || ''
	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const router = useRouter()
	const nextPage = RoutePath.ComicIssueMakeCollectibleGamifiedCovers(comicIssueId)

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	const onUpdate = () => {
		router.push(RoutePath.Dashboard)
	}

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

			<main className='main--with-hint-drawer'>
				<UpdateComicIssueCoversForm comicIssue={comicIssue} onUpdate={onUpdate} />
				<HintDrawer>
					<Box>
						<Expandable title='Cover rarities'>
							<HintWithImage previews={issueCoverVariantsPreviews} text={coverVariantsTooltipText} />
						</Expandable>
						<Expandable title='Cover'>
							<HintWithImage previews={issueCoverPreviews} text={issueCoverImageTooltipText} />
						</Expandable>
					</Box>
				</HintDrawer>
			</main>
		</>
	)
}
