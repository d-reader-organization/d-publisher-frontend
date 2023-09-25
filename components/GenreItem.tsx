import { Box, BoxProps, Typography } from '@mui/material'
import { PartialGenre } from '@/models/genre'
import clsx from 'clsx'

interface Props extends BoxProps {
	genre: PartialGenre
}

const GenreItem: React.FC<Props> = ({ genre, className, ...props }) => {
	return (
		<Box className={clsx('genre-item', className)} style={{ backgroundColor: genre.color }} {...props}>
			<img src={genre.icon} alt='' className='genre-icon' />
			<Typography variant='body1'>{genre.name}</Typography>
		</Box>
	)
}

export default GenreItem
