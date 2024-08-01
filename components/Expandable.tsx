import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import ArrowDownIcon from 'public/assets/vector-icons/arrow-down-2.svg'

interface Props {
	title: string
	children?: React.ReactNode
	open?: boolean
}

const Expandable: React.FC<Props> = ({ title, open = false, children }) => {
	const [isExpanded, setIsExpanded] = useState(open)
	const [contentHeight, setContentHeight] = useState(0)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const handleContentHeightChange = () => {
		if (!contentRef.current) return 0

		setContentHeight(
			contentRef.current.clientHeight +
				+contentRef.current.style.getPropertyValue('padding-top').split('px')[0] +
				+contentRef.current.style.getPropertyValue('padding-bottom').split('px')[0]
		)
	};

	useEffect(()=>{
		document.addEventListener("resize-expandable",()=>{
			handleContentHeightChange()
		});

		return ()=>{
			document.removeEventListener("resize-expandable",()=>{})
		}
	},[])
	

	useEffect(() => {
		handleContentHeightChange()
	}, [contentRef.current?.clientHeight])

	return (
		<div className='expandable'>
			<div className='expandable-header' onClick={() => setIsExpanded((currentIsExpanded) => !currentIsExpanded)}>
				{title}
				<ArrowDownIcon
					className={clsx('expandable-header-arrow-icon', {
						'expandable-header-arrow-icon--rotated': isExpanded,
					})}
				/>
			</div>
			<div
				className={clsx('expandable-content-wrapper', {
					'expandable-content-wrapper--expanded': isExpanded,
				})}
				style={{ '--content-height': `${contentHeight}px` } as React.CSSProperties}
			>
				<div ref={contentRef} className='expandable-content'>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Expandable
