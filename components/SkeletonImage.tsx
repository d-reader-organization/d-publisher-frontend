import { CSSProperties, useState } from 'react'
import { Skeleton } from '@mui/material'
import Image, { ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'src'> {
	src?: ImageProps['src']
}

const SkeletonImage: React.FC<Props> = ({ src, width, height, className, style, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	const transparentStyles: CSSProperties = { opacity: 0, position: 'absolute' }
	const maybeTransparentStyles = isLoaded ? undefined : transparentStyles

	console.log('src: ', src, isLoaded)
	return (
		<>
			{(!isLoaded || !src) && (
				<Skeleton variant='rectangular' width={width} height={height} style={style} className={className} />
			)}
			{src && (
				<Image
					src={src}
					width={width}
					height={height}
					onLoadingComplete={() => {
						console.log('LOADED!', src)
						setIsLoaded(true)
					}}
					className={className}
					style={{ ...maybeTransparentStyles, ...style }}
					{...props}
				/>
			)}
		</>
	)
}

export default SkeletonImage
