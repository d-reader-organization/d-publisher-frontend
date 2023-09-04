import { userKeys, USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'

const { USER, SYNC_WALLETS } = USER_QUERY_KEYS

const syncUserWallets = async (id: string | number): Promise<void> => {
	const response = await http.get<void>(`${USER}/${SYNC_WALLETS}/${id}`)
	return response.data
}

export const useSyncUserWallets = (id: string | number) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => syncUserWallets(id),
		queryKey: userKeys.syncWallets(id),
		staleTime: Infinity, // never becomes stale
		onSuccess: () => {
			toaster.add('Wallets synced!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
