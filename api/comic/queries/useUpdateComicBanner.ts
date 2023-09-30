import { COMIC_QUERY_KEYS, comicKeys } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComic } from 'models/comic'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC, UPDATE, BANNER } = COMIC_QUERY_KEYS

const updateComicBanner = async (slug: string, request: FormData): Promise<BasicComic> => {
	const response = await http.patch<BasicComic>(`${COMIC}/${UPDATE}/${slug}/${BANNER}`, request)
	return response.data
}

export const useUpdateComicBanner = (slug: string) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicBanner(slug, updateData),
		onSuccess: (comic) => {
			toaster.add('Banner updated!', 'success')
			queryClient.invalidateQueries(comicKeys.get(comic.slug))
			queryClient.invalidateQueries(comicKeys.getRaw(comic.slug))
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
