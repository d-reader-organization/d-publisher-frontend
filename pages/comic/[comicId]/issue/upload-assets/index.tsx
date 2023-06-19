import { NextPage } from 'next'

import Steps from 'components/Steps'
import Publisher from 'components/layout/Publisher'

const UploadAssetsPage: NextPage = () => {
	return (
		<Publisher>
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: true },
					{ label: '02 Upload assets', isActive: true },
					{ label: '03 Publish', isActive: false },
				]}
			/>
		</Publisher>
	)
}

export default UploadAssetsPage
