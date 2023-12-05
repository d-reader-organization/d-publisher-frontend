import { BoxProps } from '@mui/material/Box'
import { Creator } from '@/models/creator'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'

interface Props extends BoxProps {
	creator: Creator
}

const CreatorItem: React.FC<Props> = ({ creator,className, ...props }) => {
	const nextPage = RoutePath.Creator(creator.slug)
	const router = useRouter();

	return (
		<tr key={props.key} className={clsx('creator-item',className)} onClick={()=>router.push(nextPage)}>
			<td>{creator.name}</td>
			<td>{creator.email}</td>
			<td>
				{creator.avatar ? <SkeletonImage className='creator-avatar' src={creator.avatar} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>
				{creator.logo ? <SkeletonImage className='creator-logo' src={creator.logo} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>
				{creator.banner ? <SkeletonImage className='creator-banner' src={creator.banner} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>{creator.twitter ? creator.twitter.split('/').at(-1) : '❌'}</td>
			<td>{creator.emailVerifiedAt ? '✅' : '❌'}</td>
			<td>{creator.isVerified ? '✅' : '❌'}</td>
		</tr>				
	)
}

export default CreatorItem
