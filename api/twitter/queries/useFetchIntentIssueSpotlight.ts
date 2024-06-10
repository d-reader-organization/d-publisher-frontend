import { useQuery } from 'react-query'
import http from 'api/http'
import { TWITTER_QUERY_KEYS, twitterKeys } from 'api/twitter/twitterKeys'
import { isNil } from 'lodash'

const { TWITTER, INTENT, ISSUE_SPOTLIGHT } = TWITTER_QUERY_KEYS

const fetchTwitterIntentIssueSpotlight = async (id:number): Promise<string> => {
	const response = await http.get<string>(`${TWITTER}/${INTENT}/${ISSUE_SPOTLIGHT}/${id}`)
	return response.data
}

export const useFetchTwitterIntentIssueSpotlight = (id:number | string, enabled = true) => {
	return useQuery({
		queryFn: () => fetchTwitterIntentIssueSpotlight(+id),
		queryKey: twitterKeys.getIssueSpotlight(id),
		enabled: enabled && !isNil(id),
	})
}
