import { CSSProperties, useState } from 'react'
import { Skeleton } from '@mui/material'
import Image, { ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'src'> {
	src?: ImageProps['src']
	onLoaded?: () => void
}

const SkeletonImage: React.FC<Props> = ({ src, width, height, className, style, alt, onLoaded, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	const transparentStyles: CSSProperties = { opacity: 0, position: 'absolute' }
	const maybeTransparentStyles = isLoaded ? undefined : transparentStyles

	return (
		<>
			{(!isLoaded || !src) && (
				<Skeleton
					variant='rectangular'
					width={width}
					height={height}
					style={{ border: 'none', ...style }}
					className={className}
				/>
			)}
			{src && (
				<Image
					src={src}
					width={width}
					height={height}
					onLoadingComplete={() => {
						setIsLoaded(true)
						if (typeof onLoaded === 'function') {
							onLoaded()
						}
					}}
					alt={alt}
					className={className}
					style={{ ...maybeTransparentStyles, ...style }}
					{...props}
				/>
			)}
		</>
	)
}

export default SkeletonImage
