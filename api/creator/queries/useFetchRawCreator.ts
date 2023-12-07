import { creatorKeys, CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { RawCreator } from '@/models/creator/rawCreator'

const { CREATOR, GET_RAW } = CREATOR_QUERY_KEYS

const fetchRawCreator = async (slug: string): Promise<RawCreator> => {
	const response = await http.get<RawCreator>(`${CREATOR}/${GET_RAW}/${slug}`)
	return response.data
}

export const useFetchRawCreator = (slug: string) => {
	const { isAuthenticated } = useCreatorAuth()
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchRawCreator(slug),
		queryKey: creatorKeys.get(slug),
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
	})
}
