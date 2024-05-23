import React, { useEffect, useMemo } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { useBreakpoints, useOnScreen } from '@/hooks'
import Grid from '@mui/material/Grid'
import { useFetchRawComicIssues } from '@/api/comicIssue'
import { RawComicIssueParams } from '@/models/comicIssue/comicIssueParams'
import RawComicIssueItem from './comicIssue/RawComicIssueItem'

interface Props {
	title: string
	params?: Partial<RawComicIssueParams>
	enabled: boolean
	narrow?: boolean
	hideItemsCount?: boolean
}

const DownloadComicIssueAssetList: React.FC<Props> = ({
	title,
	params,
	enabled,
	narrow = false,
	hideItemsCount = false,
}) => {
	const [, showMore, showMoreRef] = useOnScreen()
	const { xs, sm, md, lg, xl } = useBreakpoints()

	const take = useMemo(() => {
		if (xl) return narrow ? 12 : 18
		else if (lg) return narrow ? 12 : 18
		else if (md) return narrow ? 9 : 12
		else if (sm) return 9
		else if (xs) return 6
		else return 0
	}, [xl, narrow, lg, md, sm, xs])

	const {
		flatData: issues,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchRawComicIssues({ skip: 0, take, ...params }, enabled)

	const hasComicIssues = issues.length > 0
	const showItemsCount = !hasNextPage && !isFetching && !hideItemsCount

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<div className='raw-issue-list-wrapper'>
			<h2 className='title'>{title}</h2>
			{hasComicIssues ? (
				<Grid container spacing={1} className='raw-issue-list'>
					{issues.map((issue) => (
						<Grid item key={issue.id} xs={6} md={4} lg={3} xl={2}>
							<RawComicIssueItem comicIssue={issue} isAdmin isDownloadLink />
						</Grid>
					))}
				</Grid>
			) : (
				<div className='content-empty'>No issues to display!</div>
			)}
			<div ref={showMoreRef}>
				<div className='loading-more'>
					{isFetching && <CircularProgress size={32} />}
					{showItemsCount && `${issues.length} ${issues.length === 1 ? 'item' : 'items'} found`}
				</div>
			</div>
		</div>
	)
}

export default DownloadComicIssueAssetList
