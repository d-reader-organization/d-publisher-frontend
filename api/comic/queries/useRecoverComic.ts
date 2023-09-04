import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, RECOVER } = COMIC_QUERY_KEYS

const recoverComic = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${COMIC}/${RECOVER}/${slug}`)
	return response.data
}

export const useRecoverComic = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => recoverComic(slug),
		onSuccess: () => {
			toaster.add('Comic recovered!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
