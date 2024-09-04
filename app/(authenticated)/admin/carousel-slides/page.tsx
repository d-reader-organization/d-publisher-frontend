'use client'

import Header from 'components/layout/Header'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import FlexColumn from '@/components/FlexColumn'
import CircularProgress from '@mui/material/CircularProgress'
import SkeletonImage from '@/components/SkeletonImage'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import { useExpireCarouselSlide } from '@/api/carousel'
import { useFetchMe } from '@/api/creator'
import { Role } from '@/enums/role'
import { Button } from '@mui/material'
import { useFetchRawCarouselSlides } from '@/api/carousel/queries/useFetchRawCarouselSlides'

export default function CarouselSlidePage() {
    const {data: carouselSlides, isLoading: isLoadingCarouselSlides} = useFetchRawCarouselSlides({isExpired:true})
	useAuthenticatedRoute()
	const { mutateAsync: expireCarouselSlide } = useExpireCarouselSlide();

    const { data: me } = useFetchMe()
	const onDelete = async(id:number)=>{
		await expireCarouselSlide(id)
	};

    if (!me || (me.role !== Role.Admin && me.role !== Role.Superadmin)) return null
    
	return (
		<>
			<main className='carousel-slide-page'>
				<div className='head'>
					<h2 className='title'>Carousel Slides</h2>
					<ButtonLink className='button--create' href={RoutePath.CreateCarouselSlide()}>Create</ButtonLink>
				</div>

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
									<td className='centered'></td>
									<td></td>
								</tr>
							</thead>
							<tbody>
								{carouselSlides ? carouselSlides.map((slide,index) => {
									return (
										<tr key={slide.id}>
											<td className='centered'>{index + 1}</td>
											<td className='no-wrap'>
                                                <SkeletonImage src={slide.image} alt={"Slide Image"} height={150} width={300}/>
                                            </td>
											<td className='no-wrap'>{slide.title}</td>
											<td className='centered'>
												<ButtonLink noMinWidth backgroundColor='transparent' href={RoutePath.EditCarouselSlide(slide.id)}>
													Edit
												</ButtonLink>
											</td>
											<td>
												{!slide.isExpired ? 
													<Button onClick={()=>onDelete(slide.id)} className='button--delete'>
																Delete
													</Button>
													: 
													<Button className='button--expired'>
															Expired
													</Button>
												}
											</td>
										</tr>
									)
								}) : <Header title="No Available Carousel Slides" />}
							</tbody>
						</table>
					</div>
				)}
			</main>
		</>
	)
}
