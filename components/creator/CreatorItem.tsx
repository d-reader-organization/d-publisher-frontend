import Box, { BoxProps } from '@mui/material/Box'
import { Creator } from '@/models/creator'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@mui/material'
import { useDownloadCreatorAssets } from '@/api/creator/queries/useDownloadCreatorAssets'
import { handleAssetDownloads } from '@/utils/helpers'
import { DownloadAssetProps } from '@/types/downloadAssetProps'

interface Props extends BoxProps, DownloadAssetProps {
	creator: Creator
}

const CreatorItem: React.FC<Props> = ({ creator, className, isDownloadLink, isAdmin = false, ...props }) => {
	const nextPage = isDownloadLink ? RoutePath.IssueSpotlight(creator.slug): RoutePath.Creator(creator.slug)
	const { refetch:refetchDownloadLinks} = useDownloadCreatorAssets(creator.slug, isAdmin)

	return (
		<Box className={clsx('creator-item', className)} {...props}>
				<Box className='creator-item-link' >
					<Link href={nextPage}>
						<SkeletonImage sizes='1000px' className='creator-banner' src={creator.banner} loading='lazy' alt='' fill />
						<SkeletonImage sizes='450px' className='creator-avatar' src={creator.avatar} loading='lazy' alt='' fill />
					</Link>
					{isDownloadLink ? <Button className='download-button' onClick={() => handleAssetDownloads(refetchDownloadLinks)}>
						Download
					</Button> : null}
				</Box>
		</Box>
	)
}

export default CreatorItem
