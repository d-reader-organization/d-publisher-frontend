import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { CREATOR, VERIFY_EMAIL } = CREATOR_QUERY_KEYS

const verifyCreatorEmail = async (verificationToken: string): Promise<void> => {
	const response = await http.patch<void>(`${CREATOR}/${VERIFY_EMAIL}/${verificationToken}`)
	return response.data
}

export const useVerifyCreatorEmail = (verificationToken: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => verifyCreatorEmail(verificationToken),
		onSuccess: () => {
			toaster.add('Email address verified!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
