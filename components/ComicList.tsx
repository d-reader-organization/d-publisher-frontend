import React, { useEffect, useMemo } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import { RawComicParams } from '@/models/comic/comicParams'
import { useFetchRawComics } from '@/api/comic/queries/useFetchRawComics'
import { useBreakpoints, useOnScreen } from '@/hooks'
import RawComicItem from './comic/RawComicItem'
import Grid from '@mui/material/Grid'

interface Props {
	title: string
	params?: Partial<RawComicParams>
	enabled: boolean
	narrow?: boolean
	hideItemsCount?: boolean
}

const ComicList: React.FC<Props> = ({ title, params, enabled, narrow = false, hideItemsCount = false }) => {
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
		flatData: comics,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchRawComics({ skip: 0, take, ...params }, enabled)

	const hasComics = comics.length > 0
	const showItemsCount = !hasNextPage && !isFetching && !hideItemsCount

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<div className='raw-comic-list-wrapper'>
			<h2 className='title'>{title}</h2>
			{hasComics && (
				<Grid container spacing={1} className='raw-comic-list'>
					{comics.map((comic) => (
						<Grid item key={comic.slug} xs={6} md={4} lg={3} xl={2}>
							<RawComicItem comic={comic} key={comic.slug} />
						</Grid>
					))}
				</Grid>
			)}
			{!hasComics && <div className='content-empty'>No comics to display!</div>}
			<div ref={showMoreRef}>
				<div className='loading-more'>
					{isFetching && <CircularProgress size={32} />}
					{showItemsCount && `${comics.length} ${comics.length === 1 ? 'item' : 'items'} found`}
				</div>
			</div>
		</div>
	)
}

export default ComicList
