import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	color?: 'important' | 'transparent' | 'grey-100'
}

const Button: React.FC<Props> = ({ color = 'grey-100', className, ...props }) => {
	return (
		<button
			className={clsx(className, 'button', {
				'button--color-important': color === 'important',
				'button--color-transparent': color === 'transparent',
				'button--color-grey-100': color === 'grey-100',
			})}
			{...props}
		></button>
	)
}

export default Button
