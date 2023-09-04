import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, DELETE } = COMIC_QUERY_KEYS

const deleteComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${DELETE}/${slug}`)
	return response.data
}

export const useDeleteComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => deleteComic(slug),
		onSuccess: () => {
			toaster.add('Comic deleted!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
