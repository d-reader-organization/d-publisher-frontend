import { NextPage } from 'next'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'
import DashboardStats from 'components/DashboardStats'
import ContentTable from 'components/ContentTable'

const DashboardPage: NextPage = () => {
	return (
		<Publisher>
			<Header title='Hi, Mattan' />
			<DashboardStats />
			<ContentTable />
		</Publisher>
	)
}

export default DashboardPage
