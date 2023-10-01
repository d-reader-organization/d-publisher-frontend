import Box, { BoxProps } from '@mui/material/Box'
import { RawComic } from '@/models/comic/rawComic'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'

interface Props extends BoxProps {
	comic: RawComic
}

const RawComicItem: React.FC<Props> = ({ comic, className, ...props }) => {
	const nextPage = RoutePath.Comic(comic.slug)

	return (
		<Box className={clsx('raw-comic-item', className)} {...props}>
			<Link className='comic-item-link' href={nextPage}>
				<SkeletonImage sizes='1000px' className='comic-cover' src={comic.cover} loading='lazy' alt='' fill />
				<SkeletonImage sizes='450px' className='comic-logo' src={comic.logo} loading='lazy' alt='' fill />
			</Link>
		</Box>
	)
}

export default RawComicItem
