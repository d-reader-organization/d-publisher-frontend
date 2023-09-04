'use client'

import Sidebar from 'components/layout/Sidebar'
import 'app/styles/app.scss'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Sidebar />
			<div className='container'>{children}</div>
		</>
	)
}
