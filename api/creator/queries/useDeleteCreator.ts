import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, DELETE } = CREATOR_QUERY_KEYS

const deleteCreator = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${CREATOR}/${DELETE}/${slug}`)
	return response.data
}

export const useDeleteCreator = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => deleteCreator(slug),
		onSuccess: () => {
			toaster.add('Creator deleted!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
