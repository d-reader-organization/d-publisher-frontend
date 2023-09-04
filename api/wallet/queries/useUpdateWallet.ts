import { WALLET_QUERY_KEYS } from 'api/wallet/walletKeys'
import { useToaster } from 'providers/ToastProvider'
import { Wallet, UpdateWalletData } from 'models/wallet'
import { useMutation } from 'react-query'
import http from 'api/http'

const { WALLET, UPDATE } = WALLET_QUERY_KEYS

const updateWallet = async (address: string, request: UpdateWalletData): Promise<Wallet> => {
	const response = await http.patch<Wallet>(`${WALLET}/${UPDATE}/${address}`, request)
	return response.data
}

export const useUpdateWallet = (address: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (updateData: UpdateWalletData) => updateWallet(address, updateData),
		onSuccess: () => {
			toaster.add('Wallet updated!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
