import React from 'react'
import Expandable from '../Expandable'

export type FaqItem = {
	summary: string
	content: string
}

const FormFaqItems: React.FC<{ items: FaqItem[] }> = ({ items }) => {
	return items.map((item) => {
		return (
			<Expandable title={item.summary} key={item.summary}>
				{item.content}
			</Expandable>
		)
	})
}

export default FormFaqItems
