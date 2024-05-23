import Box, { BoxProps } from '@mui/material/Box'
import { Creator } from '@/models/creator'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@mui/material'
import { useDownloadCreatorAssets } from '@/api/creator/queries/useDownloadCreatorAssets'
import { handleAssetDownload } from '@/utils/helpers'

interface Props extends BoxProps {
	creator: Creator
	isDownloadLink?: boolean
	isAdmin?: boolean
}

const CreatorItem: React.FC<Props> = ({ creator, className, isDownloadLink, isAdmin = false, ...props }) => {
	const nextPage = RoutePath.Creator(creator.slug)
	const { data: downloadLinks } = useDownloadCreatorAssets(creator.slug, isAdmin)

	return (
		<Box className={clsx('creator-item', className)} {...props}>
			{isDownloadLink ? (
				<Box className='creator-item-link'>
					<SkeletonImage sizes='1000px' className='creator-banner' src={creator.banner} loading='lazy' alt='' fill />
					<SkeletonImage sizes='450px' className='creator-avatar' src={creator.avatar} loading='lazy' alt='' fill />
					<Button className='download-button' onClick={() => handleAssetDownload(downloadLinks ?? [])}>
						Download
					</Button>
				</Box>
			) : (
				<Link className='creator-item-link' href={nextPage}>
					<SkeletonImage sizes='1000px' className='creator-banner' src={creator.banner} loading='lazy' alt='' fill />
					<SkeletonImage sizes='450px' className='creator-avatar' src={creator.avatar} loading='lazy' alt='' fill />
				</Link>
			)}
		</Box>
	)
}

export default CreatorItem
