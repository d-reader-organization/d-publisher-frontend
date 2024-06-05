import { comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'
import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import { isNil } from 'lodash'
import http from 'api/http'
import { RawCreator } from '@/models/creator/rawCreator'
import { CREATOR_QUERY_KEYS } from '../creatorKeys'

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
		queryKey: comicIssueKeys.getRaw(slug),
		staleTime: 1000 * 60 * 30, // stale for 30 minutes
		enabled: isAuthenticated && !isNil(slug),
		onError: toaster.onQueryError,
	})
}