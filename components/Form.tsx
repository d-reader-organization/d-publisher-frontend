import { HTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	centered?: boolean
	padding?: boolean
	fullWidth?: boolean
	minSize?: 'sm' | 'md' | 'lg'
	maxSize?: 'sm' | 'md' | 'lg'
}

const Form: React.FC<Props> = ({
	centered = false,
	padding = false,
	fullWidth = false,
	minSize,
	maxSize,
	className,
	...props
}) => {
	return (
		<form
			className={clsx(className, 'form', {
				'form--base-padding': padding,
				'form--centered': centered,
				'form--min-sm': minSize === 'sm',
				'form--min-md': minSize === 'md',
				'form--min-lg': minSize === 'lg',
				'form--max-sm': maxSize === 'sm',
				'form--max-md': maxSize === 'md',
				'form--max-lg': maxSize === 'lg',
				'form--max-content': !fullWidth,
				'form--width-100': fullWidth,
			})}
			{...props}
		/>
	)
}

export default Form
