import { useMemo } from 'react'
import { comicIssueKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComicIssue } from 'models/comicIssue'
import { useInfiniteQuery } from 'react-query'
import http from 'api/http'
import { SearchComicIssueParams } from '@/models/comicIssue/searchComicIssueParams'

const { COMIC_ISSUE, SEARCH } = COMIC_ISSUE_QUERY_KEYS

const searchComicIssues = async (params: SearchComicIssueParams): Promise<BasicComicIssue[]> => {
	const response = await http.get<BasicComicIssue[]>(`${COMIC_ISSUE}/${SEARCH}`, { params })
	return response.data
}

export const useSearchComicIssues = (params: SearchComicIssueParams, enabled = true) => {
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: comicIssueKeys.getMany(params),
		queryFn: ({ pageParam = 0 }) => searchComicIssues({ ...params, skip: pageParam * params.take }),
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
