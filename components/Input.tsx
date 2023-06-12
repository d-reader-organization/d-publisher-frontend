import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
	return <input className={clsx('input', className)} {...props} />
}

export default Input
