import { NextPage } from 'next'

import Steps from 'components/Steps'
import Header from 'components/layout/Header'
import Publisher from 'components/layout/Publisher'

const PublishIssue: NextPage = () => {
	return (
		<Publisher>
			<Header title='Create Issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Publish', isActive: true },
				]}
			/>
			<form className='form'></form>
		</Publisher>
	)
}

export default PublishIssue
