import React from 'react'
import { Typography } from '@mui/material'
import clsx from 'clsx'

import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import DocumentIcon from 'public/assets/vector-icons/document.svg'
import DashboardIcon from 'public/assets/vector-icons/dashboard.svg'
import AnalyticsIcon from 'public/assets/vector-icons/analytics.svg'
import InboxIcon from 'public/assets/vector-icons/inbox.svg'
import Button from 'components/Button'
import Link from 'next/link'

const NAVIGATION_LIST_ITEMS = [
	{
		href: 'dashboard',
		comingSoon: false,
		title: 'Dashboard',
		icon: <DashboardIcon className='navigation-item-icon' />,
	},
	{
		href: 'analytics',
		comingSoon: true,
		title: 'Analytics',
		icon: <AnalyticsIcon className='navigation-item-icon' />,
	},
	{
		href: 'inbox',
		comingSoon: true,
		title: 'Inbox',
		icon: <InboxIcon className='navigation-item-icon' />,
	},
]

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<div className='sidebar-upper'>
				<LogoIcon />
				<Link href='create'>
					<Button color='important' className='create-button'>
						<DocumentIcon className='document-icon' />
						Create
					</Button>
				</Link>
				<ul className='navigation-list'>
					{NAVIGATION_LIST_ITEMS.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							className={clsx('navigation-item', {
								'navigation-item--disabled': item.comingSoon,
							})}
						>
							<li>
								{item.icon}
								<Typography fontWeight={600}>{item.title}</Typography>
								{item.comingSoon && <span className='soon-tag'>soon</span>}
							</li>
						</Link>
					))}
				</ul>
			</div>
			<div className='sidebar-lower'>
				<div className='actions'>
					<div className='action'>Settings</div>
					<div className='action'>Log out</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
