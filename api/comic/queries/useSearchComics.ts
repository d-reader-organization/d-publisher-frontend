import { useMemo } from 'react'
import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useInfiniteQuery } from 'react-query'
import { SearchComic } from 'models/comic'
import http from 'api/http'
import { SearchComicParams } from '@/models/comic/searchComicParams'

const { COMIC, SEARCH } = COMIC_QUERY_KEYS

const searchComics = async (params: SearchComicParams): Promise<SearchComic[]> => {
	const response = await http.get<SearchComic[]>(`${COMIC}/${SEARCH}`, { params })
	return response.data
}

export const useSearchComics = (params: SearchComicParams, enabled = true) => {
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: comicKeys.getMany(params),
		queryFn: ({ pageParam = 0 }) => searchComics({ ...params, skip: pageParam * params.take }),
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
