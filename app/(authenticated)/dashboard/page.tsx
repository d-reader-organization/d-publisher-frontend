'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import ComicList from '@/components/ComicList'
import { useFetchMe } from '@/api/creator'
import Box from '@mui/material/Box'
import Link from 'next/link'

export default function DashboardPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()

	if (!me) return null

	return (
		<>
			<Header title={`Hi, ${me.name}`} />
			<ComicList title='📖 my comics' params={{ creatorSlug: me.slug }} enabled hideItemsCount />
			<Box px={3} className='help-box'>
				<h4>Reach out if you need help/advice!</h4>
				<p>
					email:&nbsp;
					<Link className='text--important text--underline' href='mailto:support@dreader.io' target='_blank'>
						support@dreader.io
					</Link>
				</p>
				<p>
					discord:&nbsp;
					<Link className='text--important text--underline' href='https://discord.gg/rrZsRvC9mh' target='_blank'>
						invite link
					</Link>
				</p>
			</Box>
		</>
	)
}
