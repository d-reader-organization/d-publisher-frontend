import { LabelHTMLAttributes } from 'react'
import clsx from 'clsx'
import { Tooltip } from '@mui/material'

import InfoIcon from 'public/assets/vector-icons/info.svg'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
	isRequired?: boolean
	size?: 'small' | 'normal'
	tooltipText?: string
	children: React.ReactNode
}

const Label: React.FC<Props> = ({ className, isRequired = false, size = 'normal', tooltipText, children }) => {
	return (
		<label
			className={clsx('label', className, {
				'label--small': size === 'small',
			})}
		>
			{children} {isRequired && '*'}
			{tooltipText && (
				<Tooltip title={tooltipText} arrow={true} placement='top'>
					<div className='icon-wrapper'>
						<InfoIcon />
					</div>
				</Tooltip>
			)}
		</label>
	)
}

export default Label
