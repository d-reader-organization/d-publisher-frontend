import React from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CloseDrawerIcon from 'public/assets/vector-icons/close-drawer-icon.svg'
import OpenDrawerIcon from 'public/assets/vector-icons/open-drawer-icon.svg'
import { useLocalStorage } from '@/hooks'
import clsx from 'clsx'

interface Props extends BoxProps {}

const HintDrawer: React.FC<Props> = ({ children }) => {
	const [open, setIsOpen] = useLocalStorage('hint-drawer-open', true)

	const toggleOpen = () => setIsOpen((prevState) => !prevState)

	return (
		<Box className={clsx('hint-drawer', open ? 'hint-drawer--open' : 'hint-drawer--closed')}>
			<Box className='hint-drawer-title-wrapper'>
				<Typography className='hint-drawer-title'>Hints & Asset previews</Typography>
				<button type='button' className='hint-drawer-button' onClick={toggleOpen}>
					{open ? <CloseDrawerIcon /> : <OpenDrawerIcon />}
				</button>
			</Box>
			<Box className='hint-drawer-content'>{children}</Box>
		</Box>
	)
}

export default HintDrawer
