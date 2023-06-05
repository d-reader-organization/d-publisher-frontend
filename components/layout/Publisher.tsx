import React from 'react'

import Sidebar from './Sidebar'

interface Props {
	children: React.ReactNode
}

const Publisher: React.FC<Props> = ({ children }) => {
	return (
		<div className='publisher'>
			<Sidebar />
			<main className='main'>{children}</main>
		</div>
	)
}

export default Publisher
