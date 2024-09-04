import { carouselKeys, CAROUSEL_QUERY_KEYS } from 'api/carousel/carouselKeys'
import { useToaster } from 'providers/ToastProvider'
import { CarouselSlide, CarouselSlideParams } from 'models/carousel/carouselSlide'
import { useQuery } from 'react-query'
import http from 'api/http'

const { CAROUSEL, SLIDES, GET_RAW } = CAROUSEL_QUERY_KEYS

const fetchRawCarouselSlides = async (params?:CarouselSlideParams): Promise<CarouselSlide[]> => {
	const response = await http.get<CarouselSlide[]>(`${CAROUSEL}/${SLIDES}/${GET_RAW}`,{params})
	return response.data
}

export const useFetchRawCarouselSlides = (params?:CarouselSlideParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: ()=>fetchRawCarouselSlides(params),
		queryKey: carouselKeys.getMany,
		staleTime: 1000 * 60 * 10, // stale for 10 minutes
		onError: toaster.onQueryError,
	})
}
