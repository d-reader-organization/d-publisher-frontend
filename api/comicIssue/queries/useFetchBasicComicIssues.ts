import { useMemo } from 'react'
import { comicIssueKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComicIssue } from 'models/comicIssue'
import { useInfiniteQuery } from 'react-query'
import http from 'api/http'
import { BasicComicIssueParams } from '@/models/comicIssue/basicComicIssueParams'

const { COMIC_ISSUE, GET_BASIC } = COMIC_ISSUE_QUERY_KEYS

const fetchBasicComicIssues = async (params: BasicComicIssueParams): Promise<BasicComicIssue[]> => {
	const response = await http.get<BasicComicIssue[]>(`${COMIC_ISSUE}/${GET_BASIC}`, { params })
	return response.data
}

export const useFetchBasicComicIssues = (params: BasicComicIssueParams, enabled = true) => {
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: comicIssueKeys.getMany(params),
		queryFn: ({ pageParam = 0 }) => fetchBasicComicIssues({ ...params, skip: pageParam * params.take }),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length >= params.take) return allPages.length
		},
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour
		enabled: enabled && !!params.take,
		onError: toaster.onQueryError,
	})

	const { data } = infiniteQuery
	const flatData = useMemo(() => {
		if (!data) return []
		return data.pages.flatMap((page) => page)
	}, [data])

	return { ...infiniteQuery, flatData }
}
