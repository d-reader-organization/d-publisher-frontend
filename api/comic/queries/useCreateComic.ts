import { COMIC_QUERY_KEYS } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComic, CreateComicData } from 'models/comic'
import { useMutation } from 'react-query'
import http from 'api/http'

const { COMIC, CREATE } = COMIC_QUERY_KEYS

const createComic = async (request: CreateComicData): Promise<BasicComic> => {
	const response = await http.post<BasicComic>(`${COMIC}/${CREATE}`, request)
	return response.data
}

export const useCreateComic = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: CreateComicData) => createComic(request),
		onSuccess: () => {
			toaster.add('Comic created! 🎉', 'success')
		},
		onError: toaster.onQueryError,
	})
}
