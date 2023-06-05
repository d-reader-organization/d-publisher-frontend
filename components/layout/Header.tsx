import React from 'react'

interface Props {
	title: string
}

const Header: React.FC<Props> = ({ title }) => {
	return (
		<header className='header'>
			<h1 className='title'>{title}</h1>
		</header>
	)
}

export default Header
