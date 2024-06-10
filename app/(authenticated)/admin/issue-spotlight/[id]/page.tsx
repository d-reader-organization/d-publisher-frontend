'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchRawComic } from '@/api/comic'
import FlexColumn from '@/components/FlexColumn'
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import SkeletonImage from '@/components/SkeletonImage'
import FlexRow from '@/components/FlexRow'
import {useFetchRawComicIssue } from '@/api/comicIssue'
import {  useFetchMe } from '@/api/creator'
import { useFetchRawCreator } from '@/api/creator/queries/useFetchRawCreator'
import { removeTwitter } from '@/utils/helpers'
import { Role } from '@/enums/role'
import { useFetchTwitterIntentIssueSpotlight } from '@/api/twitter/queries/useFetchIntentIssueSpotlight'
import Link from 'next/link'

interface Params {
	id: string
}

export default function ComicIssueSpotlightPage({ params }: { params: Params }) {
    const { data: me } = useFetchMe()
	const {data:issue,isLoading:isLoadingIssue} = useFetchRawComicIssue(params.id);
	const {data:creator} = useFetchRawCreator(issue?.creatorSlug || '');
	const {data:comic} = useFetchRawComic(issue?.comicSlug || '');
	const {data:issueSpotlightTwitterIntent} = useFetchTwitterIntentIssueSpotlight(params.id)


	useAuthenticatedRoute()
    if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null
	
	if (!issue || !creator || !issueSpotlightTwitterIntent) return <Header title='📖' />
	return (
		<div className='issue-spotlight-page'>
			<div className='head'>
			<h1>{`📖 ${issue.title}`} </h1>
			<Link href={issueSpotlightTwitterIntent} target='_blank' className='twitter-button'>Share Spotlight On &#120143;</Link>
			</div>


			<main className='issue-spotlight-content'>
				<h2 className='title'></h2>

				{isLoadingIssue && (
					<FlexColumn centered>
						<CircularProgress size={18} />
						<div className='content-empty'>Fetching comic issue data</div>
					</FlexColumn>
				)}

				{!isLoadingIssue && (
					<Grid container spacing={4}>
						<Grid className='details-wrapper'>
							<Grid item xs={12} md={8} lg={8} xl={9} className='details'>
							<h3 className='subtitle'>Creator: <em>{creator?.name}</em></h3>
								<p className='description'>{creator?.description}</p>
								<p className='flavor-text'>{creator?.flavorText}</p>
								<p className='twitter'>twitter: <strong>@{removeTwitter(creator?.twitter)}</strong></p>
							</Grid>
							<div className='creator-avatar-wrapper'>
								<SkeletonImage className='creator-avatar' src={creator.avatar} alt='' fill />
							</div>
						</Grid>
						
						<Grid className='details-wrapper'>
						<Grid item xs={12} md={8} lg={8} xl={9} className='details'>
						<h3 className='subtitle'>Comic Series: <em>{comic?.title}</em></h3>
							<p className='description'>{comic?.description}</p>
							<p className='flavor-text'>{comic?.flavorText}</p>

							<FlexRow overflow='scroll'>
								{comic?.genres.map((genre) => (
									<p className='genre' key={genre.slug} >{genre.name}</p>
								))}
							</FlexRow>
						</Grid>
							<div className='comic-cover-wrapper'>
								<SkeletonImage  className='comic-cover' src={comic?.cover} alt='' fill />
							</div>
						</Grid>
						
						<Grid className='details-wrapper'>
						<Grid item xs={12} md={8} lg={8} xl={9} className='details'>
						<h3 className='subtitle'>Comic Issue: <em>{issue?.title}</em></h3>
							<p className='description'>{issue?.description}</p>
							<p className='flavor-text'>{issue?.flavorText}</p>

							<FlexRow overflow='scroll'>
								{issue.genres.map((genre) => (
									<p className='genre' key={genre.slug} >{genre.name}</p>
								))}
							</FlexRow>
							<FlexRow overflow='scroll'>
								{issue.statelessCovers.map((cover) => (
									<div className='stateless-cover-wrapper' key={cover.rarity}>
                                    	<div className='issue-cover-wrapper'>
											<SkeletonImage  className='issue-cover' src={cover.image} alt='' fill/>
										</div>								
										<p className='cover-rarity'>{cover.rarity}</p>	
										<p>{cover.artistTwitterHandle ? `@${cover.artistTwitterHandle}` : ''}</p>
									</div>
									
								))}
							</FlexRow>
						</Grid>
							<div className='issue-cover-wrapper'>
								<SkeletonImage  className='issue-cover' src={issue.cover} alt='' fill />
							</div>
							</Grid>
					</Grid>
				)}

			</main>
		</div>
	)
}
