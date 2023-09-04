import { GENRE_QUERY_KEYS } from 'api/genre/genreKeys'
import { useToaster } from 'providers/ToastProvider'
import { Genre } from 'models/genre'
import { useMutation } from 'react-query'
import http from 'api/http'

const { GENRE, CREATE } = GENRE_QUERY_KEYS

// CreateGenereData
const createGenre = async (request: FormData): Promise<Genre> => {
	const response = await http.post<Genre>(`${GENRE}/${CREATE}`, { request })
	return response.data
}

export const useCreateGenre = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: FormData) => createGenre(request),
		onSuccess: () => {
			toaster.add('Genre created! 🎉', 'success')
		},
		onError: toaster.onQueryError,
	})
}
