import { CSSProperties, InputHTMLAttributes, forwardRef, useState } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ className, prefix, ...props }, ref) => {
	const [prefixRef, setPrefixRef] = useState<HTMLDivElement | null>(null)

	return (
		<div className={clsx('input-wrapper', className)}>
			<input
				{...props}
				className='input'
				ref={ref}
				style={{ '--padding-left': `${(prefixRef?.clientWidth ?? 0) + 15}px` } as CSSProperties}
			/>
			{prefix && (
				<div className='input-prefix' ref={(newRef) => setPrefixRef(newRef)}>
					{prefix}
				</div>
			)}
		</div>
	)
})

Input.displayName = 'Input'

export default Input
