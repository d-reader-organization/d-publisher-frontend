import Image from 'next/image'

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
				<div key={preview.caption} className='hint-image'>
					<Image src={preview.image} alt='' />
					<span className='text'>{preview.caption}</span>
				</div>
			))}
		</>
	)
}

export default HintWithImage
