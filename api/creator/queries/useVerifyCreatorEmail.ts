import { CREATOR_QUERY_KEYS } from 'api/creator/creatorKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import { BasicCreator } from '@/models/creator'
import http from 'api/http'

const { CREATOR, VERIFY_EMAIL } = CREATOR_QUERY_KEYS

const verifyCreatorEmail = async (verificationToken: string): Promise<BasicCreator> => {
	const response = await http.patch<BasicCreator>(`${CREATOR}/${VERIFY_EMAIL}/${verificationToken}`)
	return response.data
}

export const useVerifyCreatorEmail = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (verificationToken: string) => verifyCreatorEmail(verificationToken),
		onSuccess: () => {
			console.log('VERIFIED')
			toaster.add('Email address verified!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
