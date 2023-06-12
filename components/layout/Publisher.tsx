import React, { useEffect } from 'react'

import Sidebar from './Sidebar'
import { useAuth } from '@open-sauce/solomon'
import { useRouter } from 'next/router'

interface Props {
	children: React.ReactNode
}

const Publisher: React.FC<Props> = ({ children }) => {
	const router = useRouter()
	const { isAuthenticated } = useAuth()

	useEffect(() => {
		if (!isAuthenticated) router.push('/')
	}, [isAuthenticated, router])

	return (
		<div className='publisher'>
			<Sidebar />
			<main className='main'>{children}</main>
		</div>
	)
}

export default Publisher
