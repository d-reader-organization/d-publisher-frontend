import React, { useEffect } from 'react'
import { useAuth } from '@open-sauce/solomon'
import { useRouter } from 'next/router'

import Sidebar from './Sidebar'

interface Props {
	children: React.ReactNode
}

const Publisher: React.FC<Props> = ({ children }) => {
	const router = useRouter()
	const { isAuthenticated, isAuthenticating } = useAuth()

	useEffect(() => {
		// if (!isAuthenticated && isAuthenticated) router.push('/')
	}, [isAuthenticated, isAuthenticating, router])

	return (
		<div className='publisher'>
			<Sidebar />
			<main className='main'>{children}</main>
		</div>
	)
}

export default Publisher
