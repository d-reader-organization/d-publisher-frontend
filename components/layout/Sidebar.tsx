import React from 'react'
import { Typography } from '@mui/material'
import clsx from 'clsx'

import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import DocumentIcon from 'public/assets/vector-icons/document.svg'
import DashboardIcon from 'public/assets/vector-icons/dashboard.svg'
import Button from 'components/Button'

const Sidebar = () => {
	return (
		<div className='sidebar'>
			<LogoIcon />
			<Button color='important' className='create-button'>
				<DocumentIcon className='document-icon' />
				Create
			</Button>
			<ul className='navigation-list'>
				<li className='navigation-item'>
					<DashboardIcon className='navigation-item-icon' />
					<Typography fontWeight={600}>Dashboard</Typography>
				</li>
				<li
					className={clsx('navigation-item', {
						'navigation-item--disabled': true,
					})}
				>
					<DashboardIcon className='navigation-item-icon' />
					<Typography fontWeight={600}>Analytics</Typography>
					<span className='soon-tag'>soon</span>
				</li>
				<li
					className={clsx('navigation-item', {
						'navigation-item--disabled': true,
					})}
				>
					<DashboardIcon className='navigation-item-icon' />
					<Typography fontWeight={600}>Inbox</Typography>
					<span className='soon-tag'>soon</span>
				</li>
			</ul>
		</div>
	)
}

export default Sidebar
