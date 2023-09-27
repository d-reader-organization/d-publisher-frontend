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

	return (
		<>
			<Header title={me?.name ? `Hi, ${me.name}` : 'Hi,'} />
			{/* <DashboardStats /> */}
			<ComicList />
			<Box px={3}>
				<p>{`You'll notice '?' help buttons thrown around the app. Make sure to hover over those for help!`}</p>
				<h4>At any point of the comic creation feel free to reach out if you need additional help/advice</h4>
				<p>
					✉️ email:&nbsp;
					<Link className='text--important text--underline' href='mailto:support@dreader.io' target='_blank'>
						support@dreader.io
					</Link>
				</p>
				<p>
					🐦 twitter:&nbsp;
					<Link className='text--important text--underline' href='https://x.com/dPublisherApp' target='_blank'>
						dPublisherApp
					</Link>
				</p>
				<p>
					🫂 discord:&nbsp;
					<Link className='text--important text--underline' href='https://discord.gg/rrZsRvC9mh' target='_blank'>
						invite link
					</Link>
				</p>
			</Box>
		</>
	)
}
