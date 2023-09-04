import React from 'react'

interface Props {
	title?: string
	image?: React.ReactNode
}

const Header: React.FC<Props> = ({ title, image }) => {
	return (
		<header className='header'>
			{title && <h1 className='title'>{title}</h1>}
			{image}
		</header>
	)
}

export default Header
