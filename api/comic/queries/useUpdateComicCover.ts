import { COMIC_QUERY_KEYS, comicKeys } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComic } from 'models/comic'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC, UPDATE, COVER } = COMIC_QUERY_KEYS

const updateComicCover = async (slug: string, request: FormData): Promise<BasicComic> => {
	const response = await http.patch<BasicComic>(`${COMIC}/${UPDATE}/${slug}/${COVER}`, request)
	return response.data
}

export const useUpdateComicCover = (slug: string) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicCover(slug, updateData),
		onSuccess: (comic) => {
			toaster.add('Cover updated!', 'success')
			queryClient.invalidateQueries(comicKeys.get(comic.slug))
			queryClient.invalidateQueries(comicKeys.getRaw(comic.slug))
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
