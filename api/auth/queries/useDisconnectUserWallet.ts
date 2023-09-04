import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { AUTH, WALLET, DISCONNECT } = AUTH_QUERY_KEYS

const disconnectUserWallet = async (address: string): Promise<void> => {
	const response = await http.patch<void>(`${AUTH}/${WALLET}/${DISCONNECT}/${address}`)
	return response.data
}

export const useDisconnectUserWallet = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (address: string) => disconnectUserWallet(address),
		onError: toaster.onQueryError,
	})
}
