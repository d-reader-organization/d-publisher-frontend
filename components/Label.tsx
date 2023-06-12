import clsx from 'clsx'
import { LabelHTMLAttributes } from 'react'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
	isRequired?: boolean
	size?: 'small' | 'normal'
	children: React.ReactNode
}

const Label: React.FC<Props> = ({ className, isRequired = false, size = 'normal', children }) => {
	return (
		<label
			className={clsx('label', className, {
				'label--small': size === 'small',
			})}
		>
			{children} {isRequired && '*'}
		</label>
	)
}

export default Label
