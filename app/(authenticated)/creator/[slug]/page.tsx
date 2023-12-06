'use client'

import { useFetchRawComics } from "@/api/comic"
import { useFetchRawCreator } from "@/api/creator"
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
import ComicList from "@/components/ComicList"
import FlexColumn from "@/components/FlexColumn"
import FlexRow from "@/components/FlexRow"
import IconLink from "@/components/IconLink"
import SkeletonImage from "@/components/SkeletonImage"
import Header from "@/components/layout/Header"
import { useAuthenticatedRoute } from "@/hooks"
import { CircularProgress, Grid } from "@mui/material"

interface Params {
	slug: string
}

export default function CreatorPage({ params }: { params: Params }) {
    const { data: creator, isLoading: isLoadingCreator } = useFetchRawCreator(params.slug)
	const { flatData: comics } = useFetchRawComics({
		creatorSlug: params.slug,
		skip: 0,
		take: 20,
	})

	useAuthenticatedRoute()

	if (!creator) return <Header title='📖' />
	const hasComics = comics.length > 0

	return (
		<>
			<Header title={`📖 ${creator.name}`} />

			<main className='creator-page'>
				<h2 className='title'></h2>

				{isLoadingCreator && (
					<FlexColumn centered>
						<CircularProgress size={18} />
						<div className='content-empty'>Fetching creator data</div>
					</FlexColumn>
				)}

				{!isLoadingCreator && (
					<Grid container spacing={4}>
						<Grid item xs={12} md={4} lg={4} xl={3}>
							<FlexColumn className='creator-actions'>
								<div className='creator-avatar-wrapper'>
									<SkeletonImage priority className='creator-avatar' src={creator.avatar} alt='' fill />
								</div>
			
								<FlexRow className='socials'>
									<IconLink href={creator.website} Icon={WebsiteIcon} blank />
									<IconLink href={creator.twitter} Icon={TwitterIcon} blank />
									<IconLink href={creator.instagram} Icon={InstagramIcon} blank />
								</FlexRow>
							</FlexColumn>
						</Grid>
						<Grid item xs={12} md={8} lg={8} xl={9} className='creator-details-wrapper'>
							<FlexRow overflow='scroll' className='badge-row'>
								{!creator.verifiedAt && <span className='badge badge--under-review'>⌛ under review</span>}
								{creator.emailVerifiedAt ? (
									<span className='badge badge--is-verified'>✅ Emai Verified</span>
								) : (
									<span className='badge badge--is-unverified'>❌ Unverified Email</span>
								)}
							</FlexRow>
							<h2 className='title'>
								{creator.name} {creator.verifiedAt && <VerifiedIcon />}
							</h2>

							<p className='subtitle'>
								slug: <em>{creator.slug}</em>
							</p>
							<p className='description'>{creator.description}</p>
							<p className='flavor-text'>{creator.flavorText}</p>
							<br />
							<br />
						</Grid>
					</Grid>
				)}

				{hasComics && (<ComicList title="Comics" params={{creatorSlug:creator.slug}} enabled/>)}
			</main>
		</>
	)
}
