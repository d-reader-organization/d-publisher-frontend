import { HTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	centered?: boolean
	column?: boolean
	marginTop?: boolean
}

const FormActions: React.FC<Props> = ({ centered = false, column = false, marginTop = false, className, ...props }) => {
	return (
		<div
			className={clsx(className, 'actions', {
				'actions--centered': centered,
				'actions--column': column,
				'actions--margin-top': marginTop,
			})}
			{...props}
		/>
	)
}

export default FormActions
