import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	backgroundColor?: 'important' | 'transparent' | 'grey-100'
	borderColor?: 'important' | 'transparent' | 'grey-100' | 'grey-300'
}

const Button: React.FC<Props> = ({
	backgroundColor = 'grey-100',
	borderColor = 'transparent',
	className,
	...props
}) => {
	return (
		<button
			className={clsx(className, 'button', {
				'button--background-color-important': backgroundColor === 'important',
				'button--background-color-transparent': backgroundColor === 'transparent',
				'button--background-color-grey-100': backgroundColor === 'grey-100',
				'button--border-color-important': borderColor === 'important',
				'button--border-color-transparent': borderColor === 'transparent',
				'button--border-color-grey-100': borderColor === 'grey-100',
				'button--border-color-grey-300': borderColor === 'grey-300',
			})}
			{...props}
		></button>
	)
}

export default Button
