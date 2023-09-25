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
import { useFetchMe } from '@/api/creator'
import { useFetchRawComic } from '@/api/comic'
import FlexColumn from '@/components/FlexColumn'
import { CircularProgress, Grid } from '@mui/material'
import SkeletonImage from '@/components/SkeletonImage'
import FlexRow from '@/components/FlexRow'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import GenreItem from '@/components/GenreItem'
import IconLink from '@/components/IconLink'

interface Params {
	slug: string
}

export default function ComicPage({ params }: { params: Params }) {
	const { data: me } = useFetchMe()
	const { data: comic, isLoading } = useFetchRawComic(params.slug)

	useAuthenticatedRoute()

	if (!comic) return <Header title='📖' />
	const hasComics = comic.stats.issuesCount > 0

	return (
		<>
			<Header title={`📖 ${comic.title}`} />

			<main className='comic-page'>
				<h2 className='title'></h2>

				{isLoading && (
					<FlexColumn centered>
						<CircularProgress size={18} />
						<div className='content-empty'>Fetching comic data</div>
					</FlexColumn>
				)}

				{!isLoading && (
					<Grid container spacing={4}>
						<Grid item xs={12} md={3}>
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
							</FlexColumn>
						</Grid>
						<Grid item xs={12} md={6} className='comic-details-wrapper'>
							<FlexRow>
								{comic.genres.map((genre) => (
									<GenreItem genre={genre} key={genre.slug} />
								))}
							</FlexRow>
							<FlexRow centered className='title-row'>
								<h2 className='title'>{comic.title}</h2>
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
							<p className='subtitle'>slug: {comic.slug}</p>
							<p>Audience type (age): {comic.audienceType}</p>
							{/* TODO: show banner, logo, and pfp */}
							<p className='description'>{comic.description}</p>
							<p className='flavor-text'>{comic.flavorText}</p>
							<FlexRow className='socials'>
								<IconLink href={comic.website} Icon={WebsiteIcon} blank />
								<IconLink href={comic.twitter} Icon={TwitterIcon} blank />
								<IconLink href={comic.discord} Icon={DiscordIcon} blank />
								<IconLink href={comic.telegram} Icon={TelegramIcon} blank />
								<IconLink href={comic.instagram} Icon={InstagramIcon} blank />
								<IconLink href={comic.tikTok} Icon={TikTokIcon} blank />
								<IconLink href={comic.youTube} Icon={YouTubeIcon} blank />
							</FlexRow>
							<p>Note: Comic "edit" and comic issue "view" and "edit" screens are coming soon</p>
							{/* TODO: stats */}
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
			</main>
		</>
	)
}
