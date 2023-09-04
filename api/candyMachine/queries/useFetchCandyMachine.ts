import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine/candyMachineKeys'
import { useToaster } from 'providers/ToastProvider'
import { CandyMachine } from 'models/candyMachine'
import { useQuery } from 'react-query'
import http from 'api/http'

const { CANDY_MACHINE, GET } = CANDY_MACHINE_QUERY_KEYS

const fetchCandyMachine = async (address: string): Promise<CandyMachine> => {
	const response = await http.get<CandyMachine>(`${CANDY_MACHINE}/${GET}/${address}`)
	return response.data
}

export const useFetchCandyMachine = (address: string) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchCandyMachine(address),
		queryKey: candyMachineKeys.get(address),
		staleTime: 1000 * 60 * 3, // stale for 3 minutes
		enabled: !!address,
		onError: toaster.onQueryError,
	})
}
