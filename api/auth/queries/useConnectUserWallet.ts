import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { AUTH, WALLET, CONNECT } = AUTH_QUERY_KEYS

type ConnectRequest = { address: string; encoding: string }

const connectUserWallet = async (address: string, encoding: string): Promise<void> => {
	const response = await http.patch<void>(`${AUTH}/${WALLET}/${CONNECT}/${address}/${encoding}`)
	return response.data
}

export const useConnectUserWallet = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: ({ address, encoding }: ConnectRequest) => connectUserWallet(address, encoding),
		onError: toaster.onQueryError,
	})
}
