import React from 'react'
import Link from 'next/link'
import { Typography } from '@mui/material'
import clsx from 'clsx'

import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import DocumentIcon from 'public/assets/vector-icons/document.svg'
import DashboardIcon from 'public/assets/vector-icons/dashboard.svg'
import ProfileIcon from 'public/assets/vector-icons/profile.svg'
import AnalyticsIcon from 'public/assets/vector-icons/analytics.svg'
import InboxIcon from 'public/assets/vector-icons/inbox.svg'
import { useCreatorAuth } from 'providers/CreatorAuthProvider'
import { RoutePath } from 'enums/routePath'
import Button from 'components/Button'

const NAVIGATION_LIST_ITEMS = [
	{
		href: RoutePath.Dashboard,
		comingSoon: false,
		title: 'Dashboard',
		icon: <DashboardIcon className='navigation-item-icon' />,
	},
	{
		href: RoutePath.Profile,
		comingSoon: false,
		title: 'Profile',
		icon: <ProfileIcon className='navigation-item-icon navigation-item-icon--profile' />,
	},
	{
		href: RoutePath.Analytics,
		comingSoon: true,
		title: 'Analytics',
		icon: <AnalyticsIcon className='navigation-item-icon' />,
	},
	{
		href: RoutePath.Inbox,
		comingSoon: true,
		title: 'Inbox',
		icon: <InboxIcon className='navigation-item-icon' />,
	},
]

interface Props {
	hidden?: boolean
}

const Sidebar: React.FC<Props> = ({ hidden = false }) => {
	const { logout } = useCreatorAuth()

	if (hidden) return null

	return (
		<div className='sidebar'>
			<div className='sidebar-upper'>
				<LogoIcon />
				<Link href='/comic/create' replace={true} className='create-button-link'>
					<Button backgroundColor='important' className='create-button'>
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
					<div className='action'>
						<Link href={RoutePath.Settings}>Settings </Link>
					</div>
					<div className='action' onClick={logout}>
						Log out
					</div>
				</div>
			</div>
		</div>
	)
}

export default Sidebar
