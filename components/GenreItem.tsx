import { DetailedHTMLProps, HTMLAttributes } from 'react'
import Typography from '@mui/material/Typography'
import { PartialGenre } from '@/models/genre'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	genre: PartialGenre
	hideIcon?: boolean
}

const GenreItem: React.FC<Props> = ({ genre, hideIcon = false, className, ...props }) => {
	return (
		<div className={clsx('genre-item', className)} style={{ backgroundColor: genre.color }} {...props}>
			{!hideIcon && <img src={genre.icon} alt='' className='genre-icon' />}
			<Typography variant='body1'>{genre.name}</Typography>
		</div>
	)
}

export default GenreItem
