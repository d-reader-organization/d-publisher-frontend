'use client'

import Header from 'components/layout/Header'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TelegramIcon from 'public/assets/vector-icons/telegram-icon.svg'
import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
import TikTokIcon from 'public/assets/vector-icons/tiktok-icon.svg'
import YouTubeIcon from 'public/assets/vector-icons/youtube-icon.svg'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import { useFetchRawComic } from '@/api/comic'
import FlexColumn from '@/components/FlexColumn'
import { CircularProgress, Grid } from '@mui/material'
import SkeletonImage from '@/components/SkeletonImage'
import FlexRow from '@/components/FlexRow'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import GenreItem from '@/components/GenreItem'
import IconLink from '@/components/IconLink'
// import { useFetchRawComicIssues } from '@/api/comicIssue'

interface Params {
	slug: string
}

export default function ComicPage({ params }: { params: Params }) {
	const { data: comic, isLoading: isLoadingComic } = useFetchRawComic(params.slug)
	// const { flatData: comicIssues, isLoading: isLoadingComicIssues } = useFetchRawComicIssues({
	// 	comicSlug: params.slug,
	// 	skip: 0,
	// 	take: 20,
	// })

	useAuthenticatedRoute()

	if (!comic) return <Header title='📖' />
	// const hasComics = comic.stats.issuesCount > 0

	return (
		<>
			<Header title={`📖 ${comic.title}`} />

			<main className='comic-page'>
				<h2 className='title'></h2>

				{isLoadingComic && (
					<FlexColumn centered>
						<CircularProgress size={18} />
						<div className='content-empty'>Fetching comic data</div>
					</FlexColumn>
				)}

				{!isLoadingComic && (
					<Grid container spacing={4}>
						<Grid item xs={12} md={4} lg={3}>
							<FlexColumn className='comic-actions'>
								<div className='comic-cover-wrapper'>
									<SkeletonImage className='comic-cover' src={comic.cover} alt='' fill />
								</div>
								<ButtonLink
									href={`${RoutePath.EditComic}?comicSlug=${comic.slug}`}
									backgroundColor='transparent'
									borderColor='grey-100'
									className='action-button'
									clickableEffect
								>
									Edit details
								</ButtonLink>
								<ButtonLink
									href={`${RoutePath.CreateComicIssue}?comicSlug=${comic.slug}`}
									backgroundColor='green-100'
									className='action-button'
									clickableEffect
								>
									Add episode
								</ButtonLink>
								<FlexRow className='socials'>
									<IconLink href={comic.website} Icon={WebsiteIcon} blank />
									<IconLink href={comic.twitter} Icon={TwitterIcon} blank />
									<IconLink href={comic.discord} Icon={DiscordIcon} blank />
									<IconLink href={comic.telegram} Icon={TelegramIcon} blank />
									<IconLink href={comic.instagram} Icon={InstagramIcon} blank />
									<IconLink href={comic.tikTok} Icon={TikTokIcon} blank />
									<IconLink href={comic.youTube} Icon={YouTubeIcon} blank />
								</FlexRow>
							</FlexColumn>
						</Grid>
						<Grid item xs={12} md={8} lg={9} className='comic-details-wrapper'>
							<FlexRow overflow='scroll'>
								{comic.genres.map((genre) => (
									<GenreItem genre={genre} key={genre.slug} />
								))}
							</FlexRow>

							<FlexRow overflow='scroll' className='badge-row'>
								{comic.verifiedAt ? (
									<VerifiedIcon />
								) : (
									<span className='badge badge--under-review'>⌛ under review</span>
								)}
								{comic.completedAt ? (
									<span className='badge badge--is-completed'>✅ completed</span>
								) : (
									<span className='badge badge--is-ongoing'>➡️ ongoing</span>
								)}
								{comic.publishedAt && <span className='badge badge--is-published'>📗 published</span>}
								{comic.popularizedAt && <span className='badge badge--is-popular'>🔥 popular</span>}
							</FlexRow>
							<h2 className='title'>{comic.title}</h2>

							<p className='subtitle'>
								slug: <em>{comic.slug}</em>
							</p>
							<p>Audience type (age): {comic.audienceType}</p>
							{/* TODO: show banner, logo, and pfp */}
							<p className='description'>{comic.description}</p>
							<p className='flavor-text'>{comic.flavorText}</p>

							<p>{`Note: Comic "edit" and comic issue "view" and "edit" screens are coming soon`}</p>
							{/* TODO: stats */}
							{/* <FlexRow>
								<p>{comic.stats.ratersCount}</p>
								<p>{comic.stats.averageRating}</p>
								<p>{comic.stats.favouritesCount}</p>
								<p>{comic.stats.issuesCount}</p>
								<p>{comic.stats.readersCount}</p>
								<p>{comic.stats.viewersCount}</p>
							</FlexRow> */}
							<table className='content-table'>
								<thead className='content-table-head'>
									<tr className='content-table-row'>
										<td className='content-table-cell'></td>
										<td className='content-table-cell'>Comic Title</td>
										<td className='content-table-cell'>Number of issues</td>
										<td className='content-table-cell'>Verified / not</td>
									</tr>
								</thead>
								<tbody>
									{/* {comicIssues.map((issue) => {
										return (
											<tr className='content-table-row' key={issue.slug}>
												<td className='content-table-cell'>
													<SkeletonImage
														className='comic-issue-cover'
														src={issue.cover}
														height={60}
														width={60}
														alt=''
													/>
												</td>
												<td className='content-table-cell'>{issue.title}</td>
												<td className='content-table-cell center'>{issue.isFreeToRead}</td>
												<td className='content-table-cell center'>{issue.verifiedAt ? '✅' : '❌'}</td>
											</tr>
										)
									})} */}
								</tbody>
							</table>
						</Grid>
					</Grid>
				)}
			</main>
		</>
	)
}
