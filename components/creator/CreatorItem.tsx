import Box, { BoxProps } from '@mui/material/Box'
import { Creator } from '@/models/creator'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import Link from 'next/link'
import clsx from 'clsx'

interface Props extends BoxProps {
	creator: Creator
}

const CreatorItem: React.FC<Props> = ({ creator, className, ...props }) => {
	const nextPage = RoutePath.Creator(creator.slug)

	return (
		<Box className={clsx('creator-item', className)} {...props}>
			<Link className='creator-item-link' href={nextPage}>
				<SkeletonImage sizes='1000px' className='creator-banner' src={creator.banner} loading='lazy' alt='' fill />
				<SkeletonImage sizes='450px' className='creator-avatar' src={creator.avatar} loading='lazy' alt='' fill />
			</Link>
		</Box>
	)
}

export default CreatorItem
