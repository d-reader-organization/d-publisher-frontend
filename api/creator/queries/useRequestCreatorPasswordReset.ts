import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import { RequestPasswordResetParams } from '@/models/user/requestPasswordResetParams'
import http from 'api/http'
import { CREATOR_QUERY_KEYS } from '../creatorKeys'

const { CREATOR, REQUEST_PASSWORD_RESET } = CREATOR_QUERY_KEYS

const requestCreatorPasswordReset = async (params: RequestPasswordResetParams): Promise<void> => {
	const response = await http.patch<void>(`${CREATOR}/${REQUEST_PASSWORD_RESET}`, params)
	return response.data
}

export const useRequestCreatorPasswordReset = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (params: RequestPasswordResetParams) => requestCreatorPasswordReset(params),
		onSuccess: () => {
			toaster.add('Password reset instructions sent to your inbox!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
