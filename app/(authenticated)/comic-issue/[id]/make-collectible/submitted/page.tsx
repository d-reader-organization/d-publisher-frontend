'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { Box } from '@mui/material'

export default function MakeCollectibleSubmittedPage() {
	useAuthenticatedRoute()

	return (
		<>
			<Header title='Submitted for sale' />
			<Box p={4}>
				<p>Your request for comic sale has been submitted! 🎉</p>
				<p>We&apos;ll review it soon and get back to you</p>
			</Box>
		</>
	)
}
