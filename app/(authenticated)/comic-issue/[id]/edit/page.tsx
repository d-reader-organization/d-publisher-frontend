'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import UpdateComicIssueBasicInfoForm from '@/components/forms/UpdateComicIssueBasicInfoForm'
import Expandable from '@/components/Expandable'

import { useFetchRawComicIssue } from '@/api/comicIssue'
import UpdateComicIssuePagesForm from '@/components/forms/UpdateComicIssuePagesForm'
import UpdateComicIssueCoversForm from '@/components/forms/UpdateComicIssueCoversForm'

interface Params {
	id: string | number
}

export default function EditComicIssuePage({ params }: { params: Params }) {
	const { data: comicIssue } = useFetchRawComicIssue(params.id)
	useAuthenticatedRoute()
	if (!comicIssue) return null

	return (
		<>
			<Header title={`Edit ${comicIssue?.title}`} />
			<main className='profile-page'>
				<Expandable title='Basic details'>
					<UpdateComicIssueBasicInfoForm comicIssue={comicIssue} />
				</Expandable>
				<Expandable title='Covers'>
					<UpdateComicIssueCoversForm comicIssue={comicIssue} />
				</Expandable>
				<Expandable title='Pages'>
					<UpdateComicIssuePagesForm comicIssue={comicIssue} />
				</Expandable>
			</main>
		</>
	)
}
