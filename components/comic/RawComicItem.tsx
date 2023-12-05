import { BoxProps } from '@mui/material/Box'
import { RawComic } from '@/models/comic/rawComic'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
interface Props extends BoxProps {
	comic: RawComic
}

const RawComicItem: React.FC<Props> = ({ comic, className ,...props }) => {
	const router = useRouter();

	return (
		<tr key={props.key} className={clsx('raw-comic-item',className)} onClick={()=>router.push(RoutePath.Comic(comic.slug))}>
			<td>{comic.title}</td>
			<td><span className='description'>{comic.description}</span></td>
			<td>{comic.flavorText}</td>
			<td>
				{comic.cover ? <SkeletonImage className='comic-image' src={comic.cover} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>
				{comic.logo ? <SkeletonImage className='comic-image' src={comic.logo} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>
				{comic.pfp ? <SkeletonImage className='comic-image' src={comic.pfp} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>
				{comic.banner ? <SkeletonImage className='comic-banner' src={comic.banner} loading='lazy' alt='Problem loading image' fill /> : '❌'}
			</td>
			<td>{comic.completedAt ? '✅' : '❌'}</td>
			<td>{comic.verifiedAt ? '✅' : '❌'}</td>
		</tr>				
	)
}

export default RawComicItem
