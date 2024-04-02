// 'use client'

// import Header from 'components/layout/Header'
// import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
// import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
// import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
// import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
// import TelegramIcon from 'public/assets/vector-icons/telegram-icon.svg'
// import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
// import TikTokIcon from 'public/assets/vector-icons/tiktok-icon.svg'
// import YouTubeIcon from 'public/assets/vector-icons/youtube-icon.svg'
// import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
// import { useFetchRawComic } from '@/api/comic'
// import FlexColumn from '@/components/FlexColumn'
// import CircularProgress from '@mui/material/CircularProgress'
// import Grid from '@mui/material/Grid'
// import SkeletonImage from '@/components/SkeletonImage'
// import FlexRow from '@/components/FlexRow'
// import ButtonLink from '@/components/ButtonLink'
// import { RoutePath } from '@/enums/routePath'
// import GenreItem from '@/components/GenreItem'
// import IconLink from '@/components/IconLink'
// import { useFetchRawComicIssues } from '@/api/comicIssue'

// interface Params {
// 	slug: string
// }

// export default function ComicPage({ params }: { params: Params }) {
// 	const { data: comic, isLoading: isLoadingComic } = useFetchRawComic(params.slug)
// 	const { flatData: comicIssues } = useFetchRawComicIssues({
// 		comicSlug: params.slug,
// 		skip: 0,
// 		take: 20,
// 	})

// 	useAuthenticatedRoute()

// 	if (!comic) return <Header title='📖' />
// 	const hasComicIssues = comicIssues.length > 0

// 	return (
// 		<>
// 			<Header title={`📖 ${comic.title}`} />

// 			<main className='comic-page'>
// 				<h2 className='title'></h2>

// 				{isLoadingComic && (
// 					<FlexColumn centered>
// 						<CircularProgress size={18} />
// 						<div className='content-empty'>Fetching comic data</div>
// 					</FlexColumn>
// 				)}

// 				{!isLoadingComic && (
// 					<Grid container spacing={4}>
// 						<Grid item xs={12} md={4} lg={4} xl={3}>
// 							<FlexColumn className='comic-actions'>
// 								<div className='comic-cover-wrapper'>
// 									<SkeletonImage priority className='comic-cover' src={comic.cover} alt='' fill />
// 								</div>
// 								<FlexRow>
// 									<ButtonLink
// 										href={RoutePath.EditComic(comic.slug)}
// 										backgroundColor='transparent'
// 										borderColor='grey-100'
// 										className='action-button'
// 										clickableEffect
// 									>
// 										Edit
// 									</ButtonLink>
// 									<ButtonLink
// 										href={RoutePath.CreateComicIssue(comic.slug)}
// 										backgroundColor='green-500'
// 										className='action-button'
// 										clickableEffect
// 									>
// 										+Episode
// 									</ButtonLink>
// 								</FlexRow>
// 								<FlexRow className='socials'>
// 									<IconLink href={comic.website} Icon={WebsiteIcon} blank />
// 									<IconLink href={comic.twitter} Icon={TwitterIcon} blank />
// 									<IconLink href={comic.discord} Icon={DiscordIcon} blank />
// 									<IconLink href={comic.telegram} Icon={TelegramIcon} blank />
// 									<IconLink href={comic.instagram} Icon={InstagramIcon} blank />
// 									<IconLink href={comic.tikTok} Icon={TikTokIcon} blank />
// 									<IconLink href={comic.youTube} Icon={YouTubeIcon} blank />
// 								</FlexRow>
// 							</FlexColumn>
// 						</Grid>
// 						<Grid item xs={12} md={8} lg={8} xl={9} className='comic-details-wrapper'>
// 							<FlexRow overflow='scroll'>
// 								{comic.genres.map((genre) => (
// 									<GenreItem genre={genre} key={genre.slug} />
// 								))}
// 							</FlexRow>

// 							<FlexRow overflow='scroll' className='badge-row'>
// 								{!comic.verifiedAt && <span className='badge badge--under-review'>⌛ under review</span>}
// 								{comic.completedAt ? (
// 									<span className='badge badge--is-completed'>✅ completed</span>
// 								) : (
// 									<span className='badge badge--is-ongoing'>➡️ ongoing</span>
// 								)}
// 								{comic.publishedAt && <span className='badge badge--is-published'>📗 published</span>}
// 								{comic.popularizedAt && <span className='badge badge--is-popular'>🔥 popular</span>}
// 							</FlexRow>
// 							<h2 className='title'>
// 								{comic.title} {comic.verifiedAt && <VerifiedIcon />}
// 							</h2>

// 							<p className='subtitle'>
// 								slug: <em>{comic.slug}</em>
// 							</p>
// 							<p>Audience type (age): {comic.audienceType}</p>
// 							{/* show banner, logo, and pfp */}
// 							<p className='description'>{comic.description}</p>
// 							<p className='flavor-text'>{comic.flavorText}</p>

// 							<br />
// 							<br />
// 							{/* stats */}
// 							{/* <FlexRow>
// 								<p>{comic.stats.ratersCount}</p>
// 								<p>{comic.stats.averageRating}</p>
// 								<p>{comic.stats.favouritesCount}</p>
// 								<p>{comic.stats.issuesCount}</p>
// 								<p>{comic.stats.readersCount}</p>
// 								<p>{comic.stats.viewersCount}</p>
// 							</FlexRow> */}
// 						</Grid>
// 					</Grid>
// 				)}

// 				{hasComicIssues && (
// 					<div className='content-table-wrapper'>
// 						<table className='content-table'>
// 							<thead>
// 								<tr>
// 									<td></td>
// 									<td>Title</td>
// 									<td className='centered'>Viewers</td>
// 									<td className='centered'>Readers</td>
// 									<td className='centered'>Likes</td>
// 									<td className='centered'>Rating</td>
// 									<td className='centered'>Status</td>
// 									<td></td>
// 								</tr>
// 							</thead>
// 							<tbody>
// 								{comicIssues.map((issue) => {
// 									return (
// 										<tr key={issue.slug}>
// 											<td className='centered'>#{issue.number}</td>
// 											<td className='no-wrap'>{issue.title}</td>
// 											<td className='centered'>{issue.stats.viewersCount}</td>
// 											<td className='centered'>{issue.stats.readersCount}</td>
// 											<td className='centered'>{issue.stats.favouritesCount}</td>
// 											<td className='centered'>{issue.stats.averageRating}</td>
// 											<td className='centered'>{issue.verifiedAt ? '✅' : '❌'}</td>
// 											<td className='centered'>
// 												<ButtonLink noMinWidth backgroundColor='transparent' href='#'>
// 													Edit
// 												</ButtonLink>
// 											</td>
// 										</tr>
// 									)
// 								})}
// 							</tbody>
// 						</table>
// 					</div>
// 				)}
// 			</main>
// 		</>
// 	)
// }

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
import CircularProgress from '@mui/material/CircularProgress'
import Grid from '@mui/material/Grid'
import SkeletonImage from '@/components/SkeletonImage'
import FlexRow from '@/components/FlexRow'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import GenreItem from '@/components/GenreItem'
import IconLink from '@/components/IconLink'
import { useFetchRawComicIssues } from '@/api/comicIssue'

interface Params {
	slug: string
}

export default function ComicPage({ params }: { params: Params }) {
	const { data: comic, isLoading: isLoadingComic } = useFetchRawComic(params.slug)
	const { flatData: comicIssues } = useFetchRawComicIssues({
		comicSlug: params.slug,
		skip: 0,
		take: 20,
	})

	useAuthenticatedRoute()

	if (!comic) return <Header title='📖' />
	const hasComicIssues = comicIssues.length > 0

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
						<Grid item xs={12} md={4} lg={4} xl={3}>
							<FlexColumn className='comic-actions'>
								<div className='comic-cover-wrapper'>
									<SkeletonImage priority className='comic-cover' src={comic.cover} alt='' fill />
								</div>
								<FlexRow>
									<ButtonLink
										href={RoutePath.EditComic(comic.slug)}
										backgroundColor='transparent'
										borderColor='grey-100'
										className='action-button'
										clickableEffect
									>
										Edit
									</ButtonLink>
									<ButtonLink
										href={RoutePath.CreateComicIssue(comic.slug)}
										backgroundColor='green-500'
										className='action-button'
										clickableEffect
									>
										+Episode
									</ButtonLink>
								</FlexRow>
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
						<Grid item xs={12} md={8} lg={8} xl={9} className='comic-details-wrapper'>
							<FlexRow overflow='scroll'>
								{comic.genres.map((genre) => (
									<GenreItem genre={genre} key={genre.slug} />
								))}
							</FlexRow>

							<FlexRow overflow='scroll' className='badge-row'>
								{!comic.verifiedAt && <span className='badge badge--under-review'>⌛ under review</span>}
								{comic.completedAt ? (
									<span className='badge badge--is-completed'>✅ completed</span>
								) : (
									<span className='badge badge--is-ongoing'>➡️ ongoing</span>
								)}
								{comic.publishedAt && <span className='badge badge--is-published'>📗 published</span>}
								{comic.popularizedAt && <span className='badge badge--is-popular'>🔥 popular</span>}
							</FlexRow>
							<h2 className='title'>
								{comic.title} {comic.verifiedAt && <VerifiedIcon />}
							</h2>

							<p className='subtitle'>
								slug: <em>{comic.slug}</em>
							</p>
							<p>Audience type (age): {comic.audienceType}</p>
							{/* show banner, logo, and pfp */}
							<p className='description'>{comic.description}</p>
							<p className='flavor-text'>{comic.flavorText}</p>

							<br />
							<br />
							{/* stats */}
							{/* <FlexRow>
								<p>{comic.stats.ratersCount}</p>
								<p>{comic.stats.averageRating}</p>
								<p>{comic.stats.favouritesCount}</p>
								<p>{comic.stats.issuesCount}</p>
								<p>{comic.stats.readersCount}</p>
								<p>{comic.stats.viewersCount}</p>
							</FlexRow> */}
						</Grid>
					</Grid>
				)}

				{hasComicIssues && (
					<div className='content-table-wrapper'>
						<table className='content-table'>
							<thead>
								<tr>
									<td></td>
									<td>Title</td>
									<td className='centered'>Viewers</td>
									<td className='centered'>Readers</td>
									<td className='centered'>Likes</td>
									<td className='centered'>Rating</td>
									<td className='centered'>Status</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{comicIssues.map((issue) => {
									return (
										<tr key={issue.slug}>
											<td className='centered'>#{issue.number}</td>
											<td className='no-wrap'>{issue.title}</td>
											<td className='centered'>{issue.stats.viewersCount}</td>
											<td className='centered'>{issue.stats.readersCount}</td>
											<td className='centered'>{issue.stats.favouritesCount}</td>
											<td className='centered'>{issue.stats.averageRating}</td>
											<td className='centered'>{issue.verifiedAt ? '✅' : '❌'}</td>
											<td className='centered'>
												<ButtonLink noMinWidth backgroundColor='transparent' href={RoutePath.EditComicIssue(issue.id)}>
													Edit
												</ButtonLink>
											</td>
										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</>
	)
}
