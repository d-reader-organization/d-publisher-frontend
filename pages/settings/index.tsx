import { NextPage } from 'next'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'

const DashboardPage: NextPage = () => {
	return (
		<Publisher>
			<Header title='Settings' />
		</Publisher>
	)
}

export default DashboardPage
