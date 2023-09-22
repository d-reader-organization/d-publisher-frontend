import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import { User } from '@/models/user'
import http from 'api/http'

const { USER, VERIFY_EMAIL } = USER_QUERY_KEYS

const verifyUserEmail = async (verificationToken: string): Promise<User> => {
	const response = await http.patch<User>(`${USER}/${VERIFY_EMAIL}/${verificationToken}`)
	return response.data
}

export const useVerifyUserEmail = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (verificationToken: string) => verifyUserEmail(verificationToken),
		onSuccess: () => {
			toaster.add('Email address verified!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
