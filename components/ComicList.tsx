import React from 'react'
import { useFetchRawComics } from '@/api/comic/queries/useFetchRawComics'
import { useFetchMe } from '@/api/creator'
import RawComicItem from './comic/RawComicItem'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import FlexColumn from './FlexColumn'

const ComicList = () => {
	const { data: me } = useFetchMe()
	const { flatData: comics, isLoading } = useFetchRawComics({ creatorSlug: me?.slug, skip: 0, take: 20 })

	const hasComics = comics.length > 0

	if (isLoading) {
		return (
			<div className='raw-comic-list-wrapper'>
				<FlexColumn centered>
					<CircularProgress size={18} />
					<div className='content-empty'>Fetching comics</div>
				</FlexColumn>
			</div>
		)
	}

	return (
		<div className='raw-comic-list-wrapper'>
			<h2 className='title'>📖 my comics</h2>
			{hasComics && (
				<Grid container spacing={1} className='raw-comic-list'>
					{comics.map((comic) => (
						<Grid item key={comic.slug} xs={6} sm={4} md={3} lg={2}>
							<RawComicItem comic={comic} key={comic.slug} />
						</Grid>
					))}
				</Grid>
			)}
			{!hasComics && <div className='content-empty'>No comics to display!</div>}
		</div>
	)
}

export default ComicList
