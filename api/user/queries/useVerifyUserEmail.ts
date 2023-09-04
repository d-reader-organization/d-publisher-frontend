import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, VERIFY_EMAIL } = USER_QUERY_KEYS

const verifyUserEmail = async (verificationToken: string): Promise<void> => {
	const response = await http.patch<void>(`${USER}/${VERIFY_EMAIL}/${verificationToken}`)
	return response.data
}

export const useVerifyUserEmail = (verificationToken: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => verifyUserEmail(verificationToken),
		onSuccess: () => {
			toaster.add('Email address verified!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
