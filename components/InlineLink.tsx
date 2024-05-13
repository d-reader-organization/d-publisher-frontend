import Link, { LinkProps } from 'next/link'

interface Props extends LinkProps {
	children: React.ReactNode
}

const InlineLink: React.FC<Props> = ({ children, ...props }) => {
	return (
		<Link target='_blank' className='inline-link' {...props}>
			{children}
		</Link>
	)
}

export default InlineLink
