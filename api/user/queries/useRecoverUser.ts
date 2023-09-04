import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, RECOVER } = USER_QUERY_KEYS

const recoverUser = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${USER}/${RECOVER}/${slug}`)
	return response.data
}

export const useRecoverUser = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => recoverUser(slug),
		onSuccess: () => {
			toaster.add('User recovered!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
