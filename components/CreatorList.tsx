import React, { useEffect, useMemo } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { CreatorParams } from '@/models/creator/creatorParams'
import { useFetchCreators } from '@/api/creator/queries/useFetchCreators'
import { useBreakpoints, useOnScreen } from '@/hooks'
import CreatorItem from './creator/CreatorItem'

interface Props {
	title: string
	params?: Partial<CreatorParams>
	enabled: boolean
	narrow?: boolean
	hideItemsCount?: boolean
}

const CreatorList: React.FC<Props> = ({ title, params, enabled, narrow = false, hideItemsCount = false }) => {
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
		flatData: creators,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchCreators({ skip: 0, take, ...params }, enabled)

	const hasCreators = creators.length > 0
	const showItemsCount = !hasNextPage && !isFetching && !hideItemsCount
	console.log(hasNextPage, isFetching, hideItemsCount)

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<div className='creator-list-wrapper'>
			<h2 className='title'>{title}</h2>
			{hasCreators && (
				<table>
					<thead>
						<tr>
							<td>Name</td>
							<td>Email</td>
							<td>Avatar</td>
							<td>Logo</td>
							<td>Banner</td>
							<td>Twitter</td>
							<td>Is Email Verified</td>
							<td>Is Verified</td>
						</tr>
					</thead>
					<tbody>
						{creators.map((creator)=> <CreatorItem key={creator.name} creator={creator}/>)}
					</tbody>
			</table>
			)}
			{!hasCreators && <div className='content-empty'>No creators to display!</div>}
			<div ref={showMoreRef}>
				<div className='loading-more'>
					{isFetching && <CircularProgress size={32} />}
					{showItemsCount && `${creators.length} ${creators.length === 1 ? 'item' : 'items'} found`}
				</div>
			</div>
		</div>
	)
}

export default CreatorList
