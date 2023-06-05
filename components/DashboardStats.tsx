import { formatCurrency } from 'utils/numbers'

const POPULARITY_RANK = 0
const LIKES = 0
const YOUR_BALANCE = 0

const DashboardStats = () => {
	return (
		<ul className='dashboard-stats'>
			<li className='item'>
				<h2 className='item-title'>Popularity Rank</h2>
				<span className='item-value'>{POPULARITY_RANK}</span>
			</li>
			<li className='item'>
				<h2 className='item-title'>Likes</h2>
				<span className='item-value'>{LIKES}</span>
			</li>
			<li className='item'>
				<h2 className='item-title'>Your Balance</h2>
				<span className='item-value'>${formatCurrency(YOUR_BALANCE)}</span>
			</li>
		</ul>
	)
}

export default DashboardStats
