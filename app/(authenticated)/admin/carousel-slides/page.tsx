'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FlexColumn from '@/components/FlexColumn'
import CircularProgress from '@mui/material/CircularProgress'
import SkeletonImage from '@/components/SkeletonImage'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import { useFetchCarouselSlides } from '@/api/carousel'
import { useFetchMe } from '@/api/creator'
import { Role } from '@/enums/role'

export default function CarouselSlidePage() {
    const {data: carouselSlides, isLoading: isLoadingCarouselSlides} = useFetchCarouselSlides({getExpired:true})
	useAuthenticatedRoute()

    const { data: me } = useFetchMe()
    if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null
    
	if (!carouselSlides) return <Header title="No Available Carousel Slides" />
	return (
		<>
			<main className='carousel-slide-page'>
				<h2 className='title'>Carousel Slides</h2>

				{isLoadingCarouselSlides && (
					<FlexColumn centered>
						<CircularProgress size={18} />
						<div className='content-empty'>Fetching carousel slides</div>
					</FlexColumn>
				)}

				{!isLoadingCarouselSlides && (
					<div className='content-table-wrapper'>
						<table className='content-table'>
							<thead>
								<tr>
									<td></td>
									<td>Image</td>
									<td className='centered'>Title</td>
									<td className='centered'>Expired</td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{carouselSlides.map((slide,index) => {
									return (
										<tr key={slide.id}>
											<td className='centered'>{index + 1}</td>
											<td className='no-wrap'>
                                                <SkeletonImage src={slide.image} alt={"Slide Image"} height={150} width={300}/>
                                            </td>
											<td className='no-wrap'>{slide.title}</td>
											<td className='centered'>{slide.isExpired ? '✅' : '❌'}</td>
											<td className='centered'>
												<ButtonLink noMinWidth backgroundColor='transparent' href={RoutePath.EditCarouselSlide(slide.id)}>
													Edit
												</ButtonLink>
											</td>

										</tr>
									)
								})}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</>
	)
}
