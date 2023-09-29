import React from 'react'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'

import CloseIcon from 'public/assets/vector-icons/close.svg'
import MenuIcon from 'public/assets/vector-icons/document.svg'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import DocumentIcon from 'public/assets/vector-icons/document.svg'
import DashboardIcon from 'public/assets/vector-icons/dashboard.svg'
import ProfileIcon from 'public/assets/vector-icons/profile.svg'
import AnalyticsIcon from 'public/assets/vector-icons/analytics.svg'
import InboxIcon from 'public/assets/vector-icons/inbox.svg'
import Button from 'components/Button'
import ButtonLink from '../ButtonLink'
import Hidden from '@mui/material/Hidden'
import { useCreatorAuth } from 'providers/CreatorAuthProvider'
import { RoutePath } from 'enums/routePath'
import { useToggle } from '@/hooks'

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

const Sidebar: React.FC = () => {
	const { logout } = useCreatorAuth()
	const [open, toggleSidebar, closeSidebar] = useToggle()

	const menuButton = (
		<button
			className={clsx('menu-button', {
				'menu-button--open': !open,
				'menu-button--close': open,
			})}
			onClick={toggleSidebar}
		>
			{open ? <CloseIcon /> : <MenuIcon />}
		</button>
	)

	const content = (
		<>
			<div className='sidebar-upper'>
				<Link className='logo-link' onClick={closeSidebar} href={RoutePath.Dashboard}>
					<LogoIcon />
				</Link>

				<ButtonLink
					href={RoutePath.CreateComic}
					replace={true}
					onClick={closeSidebar}
					backgroundColor='important'
					className='create-button-link'
				>
					<DocumentIcon className='document-icon' />
					Create
				</ButtonLink>
				<ul className='navigation-list'>
					{NAVIGATION_LIST_ITEMS.map((item) => (
						<Link
							key={item.title}
							href={item.href}
							onClick={closeSidebar}
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
					<Button
						className='action'
						backgroundColor='transparent'
						borderColor='grey-100'
						onClick={() => {
							logout()
							closeSidebar()
						}}
					>
						Log out
					</Button>
				</div>
			</div>
		</>
	)

	return (
		<>
			{menuButton}
			<Hidden smDown>
				<div className='sidebar'>{content}</div>
			</Hidden>
			<Hidden smUp>
				<div className={clsx('sidebar', { 'sidebar--hidden': !open })}>{content}</div>
			</Hidden>
		</>
	)
}

export default Sidebar
