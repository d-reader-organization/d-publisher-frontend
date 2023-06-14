import { CSSProperties, InputHTMLAttributes, forwardRef, useRef } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ className, prefix, ...props }, ref) => {
	const prefixRef = useRef<HTMLDivElement>(null)

	return (
		<div className={clsx('input-wrapper', className)}>
			<input
				{...props}
				className='input'
				ref={ref}
				style={{ '--padding-left': `${(prefixRef.current?.clientWidth ?? 0) + 15}px` } as CSSProperties}
			/>
			{prefix && (
				<div className='input-prefix' ref={prefixRef}>
					{prefix}
				</div>
			)}
		</div>
	)
})

Input.displayName = 'Input'

export default Input
