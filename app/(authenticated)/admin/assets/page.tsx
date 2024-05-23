'use client'

import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from '@/api/creator'
import { Role } from '@/enums/role'
import { useState } from 'react'
import { Box, Container, Tab, Tabs } from '@mui/material'
import DownloadComicAssetList from '@/components/DownloadComicAssetList'
import DownloadCreatorAssetList from '@/components/DownloadCreatorAssetList'
import DownloadComicIssueAssetList from '@/components/DownloadComicIssueAssetList'

export default function AdminAssetsPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()
	const [activeTab, setActiveTab] = useState(0)
	const [searchString, setSearchString] = useState('')

	if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null

	const isComicsTabActive = activeTab === 0
	const isComicIssuesTabActive = activeTab === 1
	const isCreatorsTabActive = activeTab === 2

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
	}

	return (
		<>
			<main className='admin-assets-page '>
				<Container className='admin-assets-page-container' maxWidth='xl'>
					<div className='header-image' />
					<Tabs
						className='tabs'
						indicatorColor='secondary'
						textColor='secondary'
						value={activeTab}
						onChange={handleTabChange}
						aria-label=''
					>
						<Tab
							label='Comics'
							disableRipple
							id='Comics'
							className={isComicsTabActive ? 'tab-button' : 'tab-button--inactive'}
						/>
						<Tab
							label='Issues'
							disableRipple
							id='Issues'
							className={isComicIssuesTabActive ? 'tab-button' : 'tab-button--inactive'}
						/>
						<Tab
							label='Creators'
							disableRipple
							id='Creators'
							className={isCreatorsTabActive ? 'tab-button' : 'tab-button--inactive'}
						/>
					</Tabs>

					<Box className='search-box'>
						<input
							value={searchString}
							type='text'
							placeholder='Search comics, episodes, games, and creators'
							onChange={(e) => {
								setSearchString(e.target.value)
							}}
							className='search-input'
						/>
					</Box>

					<Box hidden={!isComicsTabActive} className='discover-content'>
						<DownloadComicAssetList
							title='Comics'
							params={{ titleSubstring: searchString }}
							enabled={isComicsTabActive}
							isAdmin
						/>
					</Box>
					<Box hidden={!isComicIssuesTabActive} className='discover-content'>
						<DownloadComicIssueAssetList
							title='Issues'
							params={{ titleSubstring: searchString }}
							enabled={isComicIssuesTabActive}
						/>
					</Box>
					<Box hidden={!isCreatorsTabActive} className='discover-content'>
						<DownloadCreatorAssetList
							title='Creators'
							params={{ nameSubstring: searchString }}
							enabled={isCreatorsTabActive}
						/>
					</Box>
				</Container>
			</main>
		</>
	)
}
