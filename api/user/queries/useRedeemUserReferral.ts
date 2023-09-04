import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { User } from 'models/user'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, REDEEM_REFERRAL } = USER_QUERY_KEYS

const redeemUserReferral = async (referrer: string): Promise<User> => {
	const response = await http.patch<User>(`${USER}/${REDEEM_REFERRAL}/${referrer}`)
	return response.data
}

export const useRedeemUserReferral = (referrer: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => redeemUserReferral(referrer),
		onSuccess: () => {
			toaster.add('Referral claimed!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
