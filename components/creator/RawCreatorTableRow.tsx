import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { RawCreator } from '@/models/creator/rawCreator'
import { TableRowProps } from '@mui/material'

interface Props extends TableRowProps {
	creator: RawCreator
}

const RawCreatorTableRow: React.FC<Props> = ({ creator, className }) => {
	const nextPage = RoutePath.Creator(creator.slug)
	const router = useRouter()

	return (
		<tr className={clsx('creator-item', className)} onClick={() => router.push(nextPage)}>
			<td>{creator.name}</td>
			<td>{creator.email}</td>
			<td>
				{creator.avatar ? (
					<SkeletonImage
						className='creator-avatar'
						src={creator.avatar}
						loading='lazy'
						alt='Problem loading image'
						fill
					/>
				) : (
					'❌'
				)}
			</td>
			<td>
				{creator.logo ? (
					<SkeletonImage className='creator-logo' src={creator.logo} loading='lazy' alt='Problem loading image' fill />
				) : (
					'❌'
				)}
			</td>
			<td>
				{creator.banner ? (
					<SkeletonImage
						className='creator-banner'
						src={creator.banner}
						loading='lazy'
						alt='Problem loading image'
						fill
					/>
				) : (
					'❌'
				)}
			</td>
			<td>{creator.twitter ? creator.twitter.split('/').at(-1) : '❌'}</td>
			<td>{creator.emailVerifiedAt ? '✅' : '❌'}</td>
			<td>{creator.verifiedAt ? '✅' : '❌'}</td>
		</tr>
	)
}

export default RawCreatorTableRow
