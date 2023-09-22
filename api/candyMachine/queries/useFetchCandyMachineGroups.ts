import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine/candyMachineKeys'
import { useToaster } from 'providers/ToastProvider'
import { CandyMachineGroup } from 'models/candyMachine/candyMachineGroup'
import { useQuery } from 'react-query'
import http from 'api/http'

const { CANDY_MACHINE, GET, GROUPS } = CANDY_MACHINE_QUERY_KEYS

// TODO v2: this endpoint is deprecated
const fetchCandyMachineGroups = async (address: string): Promise<CandyMachineGroup[]> => {
	const response = await http.get<CandyMachineGroup[]>(`${CANDY_MACHINE}/${GET}/${address}/${GROUPS}`)
	return response.data
}

export const useFetchCandyMachineGroups = (address: string) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchCandyMachineGroups(address),
		queryKey: candyMachineKeys.getGroups(address),
		staleTime: 1000 * 60 * 3, // stale for 3 minutes
		enabled: !!address,
		onError: toaster.onQueryError,
	})
}
