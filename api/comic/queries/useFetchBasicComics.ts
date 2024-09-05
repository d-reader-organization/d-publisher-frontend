import { useMemo } from 'react'
import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useInfiniteQuery } from 'react-query'
import { BasicComic } from 'models/comic'
import http from 'api/http'
import { BasicComicParams } from '@/models/comic/basicComicParams'

const { COMIC, GET_BASIC } = COMIC_QUERY_KEYS

const fetchBasicComics = async (params: BasicComicParams): Promise<BasicComic[]> => {
	const response = await http.get<BasicComic[]>(`${COMIC}/${GET_BASIC}`, { params })
	return response.data
}

export const useFetchBasicComics = (params: BasicComicParams, enabled = true) => {
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: comicKeys.getMany(params),
		queryFn: ({ pageParam = 0 }) => fetchBasicComics({ ...params, skip: pageParam * params.take }),
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
