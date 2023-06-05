import { NextPage } from 'next'

import Publisher from 'components/layout/Publisher'
import Header from 'components/layout/Header'

const CreatePage: NextPage = () => {
	return (
		<Publisher>
			<Header title='Create Comic' />
		</Publisher>
	)
}

export default CreatePage
