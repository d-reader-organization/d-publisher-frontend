import React from 'react'
import { useFetchComics } from '@/api/comic/queries/useFetchComics'
import { useFetchMe } from '@/api/creator'
import Image from 'next/image'

const ContentTable = () => {
	const { data: me } = useFetchMe()
	const { flatData: comics } = useFetchComics({ creatorSlug: me?.slug, skip: 0, take: 20 })

	return (
		<div className='content-table-wrapper'>
			{comics.length > 0 && (
				<table className='content-table'>
					<thead className='content-table-head'>
						<tr className='content-table-row'>
							<td className='content-table-cell'></td>
							<td className='content-table-cell'>Comic Title</td>
							<td className='content-table-cell'>Number of issues</td>
							<td className='content-table-cell'>Verified / not</td>
						</tr>
					</thead>
					<tbody>
						{comics.map((comic) => {
							return (
								<tr className='content-table-row' key={comic.slug}>
									<td className='content-table-cell'>
										<Image className='comic-cover' src={comic.cover} height={60} width={60} alt='' />
									</td>
									<td className='content-table-cell'>{comic.title}</td>
									<td className='content-table-cell center'>{comic.stats?.issuesCount}</td>
									<td className='content-table-cell center'>{comic.isVerified ? '✅' : '❌'}</td>
								</tr>
							)
						})}
					</tbody>
				</table>
			)}
			{comics.length === 0 && <div className='content-table-empty'>No comics to display!</div>}
		</div>
	)
}

export default ContentTable
