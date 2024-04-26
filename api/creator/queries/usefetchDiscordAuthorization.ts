import http from 'api/http'
import { CREATOR_QUERY_KEYS } from '../creatorKeys'
import { useQuery } from 'react-query'
import { useToaster } from '@/providers/ToastProvider'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'

const { CREATOR, GET_DISCORD_AUTHORIZATION } = CREATOR_QUERY_KEYS

const fetchDiscordAuthorization = async (): Promise<string> => {
	const res = await http.get<string>(`${CREATOR}/${GET_DISCORD_AUTHORIZATION}`)
	return res.data
}

export const useFetchDiscordAuthorization = (enabled: boolean) => {
	const toaster = useToaster()
	const { isAuthenticated } = useCreatorAuth()

	return useQuery({
		queryKey: `${CREATOR}/${GET_DISCORD_AUTHORIZATION}`,
		staleTime: 1000 * 60 * 60 * 1,
		enabled: isAuthenticated && enabled,
		queryFn: () => fetchDiscordAuthorization(),
		onError: toaster.onQueryError,
	})
}
