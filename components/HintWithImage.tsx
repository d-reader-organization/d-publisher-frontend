import Image from 'next/image'
import FlexColumn from './FlexColumn'

export type TooltipImagePreview = { image: string | StaticImageData; caption: string }

interface Props {
	previews: TooltipImagePreview[]
	text: React.ReactNode
}

export const HintWithImage: React.FC<Props> = ({ previews, text }) => {
	return (
		<>
			{text}
			{previews.map((preview) => (
				<FlexColumn centered key={preview.caption} className='hint-image'>
					<p className='text'>{preview.caption}</p>
					<Image src={preview.image} alt='' />
				</FlexColumn>
			))}
		</>
	)
}

export default HintWithImage
