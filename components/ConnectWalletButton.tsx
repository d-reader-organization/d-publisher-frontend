import { WalletButton } from '@open-sauce/solomon'

import http from 'api/http'

const ConnectWalletButton = () => {
	return <WalletButton http={http} className='connect-wallet-button' />
}

export default ConnectWalletButton
