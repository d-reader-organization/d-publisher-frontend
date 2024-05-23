import Box, { BoxProps } from '@mui/material/Box'
import { RawComic } from '@/models/comic/rawComic'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'
import { useDownloadComicAssets } from '@/api/comic/queries/useDownloadComicAssets'
import { Button } from '@mui/material'
import { handleAssetDownload } from '@/utils/helpers'

interface Props extends BoxProps {
	comic: RawComic
	isDownloadLink?: boolean
	isAdmin?: boolean
}

const RawComicItem: React.FC<Props> = ({ comic, className, isDownloadLink, isAdmin = false, ...props }) => {
	const nextPage = RoutePath.Comic(comic.slug)
	const { data: downloadLinks } = useDownloadComicAssets(comic.slug, isAdmin)

	return (
		<Box className={clsx('raw-comic-item', className)} {...props}>
			{isDownloadLink ? (
				<Box className='comic-item-link'>
					<SkeletonImage sizes='1000px' className='comic-cover' src={comic.cover} loading='lazy' alt='' fill />
					<SkeletonImage sizes='450px' className='comic-logo' src={comic.logo} loading='lazy' alt='' fill />
					<Button className='download-button' onClick={() => handleAssetDownload(downloadLinks ?? [])}>
						Download
					</Button>
				</Box>
			) : (
				<Link className='comic-item-link' href={nextPage}>
					<SkeletonImage sizes='1000px' className='comic-cover' src={comic.cover} loading='lazy' alt='' fill />
					<SkeletonImage sizes='450px' className='comic-logo' src={comic.logo} loading='lazy' alt='' fill />
				</Link>
			)}
		</Box>
	)
}

export default RawComicItem
