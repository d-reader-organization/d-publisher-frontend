import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'
import { ResetPasswordData } from '@/models/auth/resetPassword'

const { CREATOR, RESET_PASSWORD } = CREATOR_QUERY_KEYS

const resetCreatorPassword = async (resetPasswordData: ResetPasswordData): Promise<void> => {
	const response = await http.patch<void>(`${CREATOR}/${RESET_PASSWORD}`, resetPasswordData)
	return response.data
}

export const useResetCreatorPassword = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (resetPasswordData: ResetPasswordData) => resetCreatorPassword(resetPasswordData),
		onSuccess: () => {
			toaster.add('Password reset successful!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
