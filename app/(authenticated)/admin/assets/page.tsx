'use client'

import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchMe } from '@/api/creator'
import { Role } from '@/enums/role'
import { useState } from 'react'
import { Box, Container, Tab, Tabs } from '@mui/material'
import DownloadComicAssetList from '@/components/DownloadComicAssetList'
import DownloadCreatorAssetList from '@/components/DownloadCreatorAssetList'
import DownloadComicIssueAssetList from '@/components/DownloadComicIssueAssetList'
type TabKey = 'comics' | 'comic-issues' | 'creators'

type TabType = {
	key: TabKey
	index: number
	label: string
}

const tabs: TabType[] = [
	{ key: 'comics', label: 'Comics', index: 0 },
	{ key: 'comic-issues', label: 'Episodes', index: 1 },
	{ key: 'creators', label: 'Creators', index: 2 },
]

const findKeyByIndex = (index: number): TabType['key'] => {
	return tabs.find((tab) => tab.index === index)?.key || 'comics'
}
const findIndexByKey = (key: string): TabType['index'] => tabs.find((tab) => tab.key === key)?.index || 0

export default function AdminAssetsPage() {
	const { data: me } = useFetchMe()

	useAuthenticatedRoute()
	const [activeTab, setActiveTab] = useState(findIndexByKey('comics'))
	const [searchString, setSearchString] = useState('')

	if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null

	const comicsTab = findKeyByIndex(activeTab) === 'comics'
	const comicIssuesTab = findKeyByIndex(activeTab) === 'comic-issues'
	const creatorsTab = findKeyByIndex(activeTab) === 'creators'

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
							className={comicsTab ? 'tab-button' : 'tab-button--inactive'}
						/>
						<Tab
							label='Issues'
							disableRipple
							id='Issues'
							className={comicIssuesTab ? 'tab-button' : 'tab-button--inactive'}
						/>
						<Tab
							label='Creators'
							disableRipple
							id='Creators'
							className={creatorsTab ? 'tab-button' : 'tab-button--inactive'}
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

					<Box hidden={!comicsTab} className='discover-content'>
						<DownloadComicAssetList
							title='Comics'
							params={{ titleSubstring: searchString }}
							enabled={comicsTab}
							isAdmin
						/>
					</Box>
					<Box hidden={!comicIssuesTab} className='discover-content'>
						<DownloadComicIssueAssetList
							title='Issues'
							params={{ titleSubstring: searchString }}
							enabled={comicIssuesTab}
						/>
					</Box>
					<Box hidden={!creatorsTab} className='discover-content'>
						<DownloadCreatorAssetList title='Creators' params={{ nameSubstring: searchString }} enabled={creatorsTab} />
					</Box>
				</Container>
			</main>
		</>
	)
}
