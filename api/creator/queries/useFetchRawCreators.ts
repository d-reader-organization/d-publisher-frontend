import { useMemo } from 'react'
import { creatorKeys, CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { CreatorParams } from 'models/creator/creatorParams'
import { useInfiniteQuery } from 'react-query'
import http from 'api/http'
import { RawCreator } from '@/models/creator/rawCreator'
import { RawCreatorParams } from '@/models/creator/rawCreatorParams'
import { useCreatorAuth } from '@/providers/CreatorAuthProvider'

const { CREATOR, GET_RAW } = CREATOR_QUERY_KEYS

const fetchRawCreators = async (params: CreatorParams): Promise<RawCreator[]> => {
	const response = await http.get<RawCreator[]>(`${CREATOR}/${GET_RAW}`, { params })
	return response.data
}

export const useFetchRawCreators = (params: RawCreatorParams) => {
	const toaster = useToaster()
	const isAuthenticated = useCreatorAuth()

	const infiniteQuery = useInfiniteQuery({
		queryKey: creatorKeys.getManyRaw(params),
		queryFn: ({ pageParam = 0 }) => fetchRawCreators({ ...params, skip: pageParam * params.take }),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length >= params.take) return allPages.length
		},
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour
		enabled: isAuthenticated && !!params.take,
		onError: toaster.onQueryError,
	})

	const { data } = infiniteQuery
	const flatData = useMemo(() => {
		if (!data) return []
		return data.pages.flatMap((page) => page)
	}, [data])

	return { ...infiniteQuery, flatData }
}
