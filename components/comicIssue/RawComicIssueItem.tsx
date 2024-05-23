import Box, { BoxProps } from '@mui/material/Box'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'
import { Button } from '@mui/material'
import { handleAssetDownload } from '@/utils/helpers'
import { RawComicIssue } from '@/models/comicIssue/rawComicIssue'
import { useDownloadComicIssueAssets } from '@/api/comicIssue/queries/useDownloadComicIssueAssets'

interface Props extends BoxProps {
	comicIssue: RawComicIssue
	isDownloadLink?: boolean
	isAdmin?: boolean
}

const RawComicIssueItem: React.FC<Props> = ({ comicIssue, className, isDownloadLink, isAdmin = false, ...props }) => {
	const nextPage = RoutePath.ComicIssue(comicIssue.id)
	const { data: downloadLinks } = useDownloadComicIssueAssets(comicIssue.id, isAdmin)
	return (
		<Box className={clsx('raw-issue-item', className)} {...props}>
			{isDownloadLink ? (
				<Box className='issue-item-link'>
					<SkeletonImage sizes='1000px' className='issue-cover' src={comicIssue.cover} loading='lazy' alt='' fill />
					<Button className='download-button' onClick={() => handleAssetDownload(downloadLinks ?? [])}>
						Download
					</Button>
				</Box>
			) : (
				<Link className='issue-item-link' href={nextPage}>
					<SkeletonImage sizes='1000px' className='issue-cover' src={comicIssue.cover} loading='lazy' alt='' fill />
				</Link>
			)}
		</Box>
	)
}

export default RawComicIssueItem
