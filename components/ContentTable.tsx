import React from 'react'

const COMICS = []

const ContentTable = () => {
	return (
		<div className='content-table-wrapper'>
			{COMICS.length > 0 && (
				<table className='content-table'>
					<thead className='content-table-head'>
						<tr className='content-table-row'>
							<td className='content-table-cell'>Comic Title</td>
							<td className='content-table-cell'>2 issues</td>
							<td className='content-table-cell'>Verified / not</td>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			)}
			{COMICS.length === 0 && <div className='content-table-empty'>No content to display!</div>}
		</div>
	)
}

export default ContentTable
