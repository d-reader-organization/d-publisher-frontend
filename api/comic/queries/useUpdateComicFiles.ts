import { COMIC_QUERY_KEYS, comicKeys } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComic } from 'models/comic'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC, UPDATE, FILES } = COMIC_QUERY_KEYS

const updateComicFiles = async (slug: string, request: FormData): Promise<BasicComic> => {
	const response = await http.patch<BasicComic>(`${COMIC}/${UPDATE}/${slug}/${FILES}`, request)
	return response.data
}

export const useUpdateComicFiles = (slug: string) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicFiles(slug, updateData),
		onSuccess: (comic) => {
			toaster.add('Files updated!', 'success')
			queryClient.invalidateQueries(comicKeys.getRaw(comic.slug))
			queryClient.invalidateQueries(comicKeys.get(comic.slug))
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
