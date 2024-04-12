'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import mergeImages from 'merge-images'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Steps from 'components/Steps'
import Expandable from '@/components/Expandable'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { useToaster } from '@/providers/ToastProvider'
import { CreateStatefulCoverData } from '@/models/comicIssue/statefulCover'
import { generateRequiredArrayElementErrorMessage } from '@/utils/error'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { useFetchRawComicIssue, useUpdateComicIssueStatefulCovers } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { statefulCoverVariantsTooltipText } from '@/constants/tooltips'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import SkeletonImage from '@/components/SkeletonImage'
import { statelessCoversToStatefulCovers } from '@/utils/covers'
import { groupBy, map } from 'lodash'
import usedOverlayImage from '@/public/assets/images/used.png'
import unusedOverlayImage from '@/public/assets/images/unused.png'

interface Params {
	id: string | number
}

export default function UploadComicIssueStatefulCoversPage({ params }: { params: Params }) {
	const toaster = useToaster()
	const router = useRouter()
	const comicIssueId = params.id || ''
	const nextPage = RoutePath.ComicIssueUploadAssets(comicIssueId)
	const [issueCovers, setIssueCovers] = useState<CreateStatefulCoverData[]>([])

	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const { mutateAsync: updateStatefulCovers } = useUpdateComicIssueStatefulCovers(comicIssueId)
	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()
	useEffect(() => {
		if (comicIssue?.statelessCovers) {
			const statefulCovers = statelessCoversToStatefulCovers(comicIssue?.statelessCovers)
			setIssueCovers(statefulCovers)
		}
	}, [comicIssue?.statelessCovers])
	if (!comicIssue) return null
	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()
		const unsetArtist = issueCovers.some((issueCover) => issueCover.artist === '')
		const unsetImage = issueCovers.some((issueCover) => issueCover.image === undefined)

		if (unsetArtist) {
			toaster.add(generateRequiredArrayElementErrorMessage('artist'), 'error')
			return
		}
		if (unsetImage) {
			toaster.add(generateRequiredArrayElementErrorMessage('image'), 'error')
			return
		}

		const formData = new FormData()

		await Promise.all(
			issueCovers.map(async (cover, index) => {
				if (cover.image) {
					const imagesToMerge = [{ src: cover.image }]
					if (cover.isUsed) imagesToMerge.push({ src: usedOverlayImage.src })
					else imagesToMerge.push({ src: unusedOverlayImage.src })

					if (cover.isSigned && comicIssue.signature) imagesToMerge.push({ src: comicIssue.signature })

					const mergedImageDataURL = await mergeImages(imagesToMerge, { crossOrigin: 'anonymous' })
					const response = await fetch(mergedImageDataURL)
					const blob = await response.blob()
					formData.append(`covers[${index}][image]`, blob, `cover-${index}.png`)
				}
				formData.append(`covers[${index}][artist]`, cover.artist)
				formData.append(`covers[${index}][isSigned]`, cover.isSigned.toString())
				formData.append(`covers[${index}][isUsed]`, cover.isUsed.toString())
				formData.append(`covers[${index}][rarity]`, cover.rarity)
			})
		)

		await updateStatefulCovers(formData)
		router.push(nextPage)
	}

	const groupedCovers = groupBy(issueCovers, 'rarity')

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Create Issue', isActive: false },
					{ label: '02 Upload covers', isActive: true },
					{ label: '03 Upload assets', isActive: false },
					{ label: '04 Upload pages', isActive: false },
					{ label: '05 Publish', isActive: false },
				]}
			/>

			<main>
				<Form padding maxSize='xl' fullWidth className='form--edit-comic-issue-stateful-covers'>
					<Label isRequired tooltipText={statefulCoverVariantsTooltipText}>
						Issue Covers
					</Label>
					<p className='description'>
						{`Covers with "signed" and "used" states. These will be used for collecting/gamification purposes`}
					</p>
					{map(groupedCovers, (covers, key) => {
						return (
							<Expandable open title={key} key={key}>
								{covers.map((cover) => {
									const { rarity, isSigned, isUsed, image } = cover
									return (
										<div className='rarity-cover-wrapper' key={rarity + isSigned + isUsed}>
											<Label>{`${isUsed ? 'Used' : 'Unused'}, ${isSigned ? 'Signed' : 'Unsigned'}`}</Label>
											<div className='cover-upload-wrapper'>
												<SkeletonImage alt='' src={image} width={200} height={280} className='cover-upload' />
												{isUsed ? (
													<SkeletonImage
														alt=''
														src={usedOverlayImage}
														width={200}
														height={280}
														className='overlay-image'
													/>
												) : (
													<SkeletonImage
														alt=''
														src={unusedOverlayImage}
														width={200}
														height={280}
														className='overlay-image'
													/>
												)}
												{isSigned && (
													<SkeletonImage
														alt=''
														src={comicIssue.signature}
														width={200}
														height={280}
														className='overlay-image'
													/>
												)}
											</div>
										</div>
									)
								})}
							</Expandable>
						)
					})}

					<FormActions marginTop>
						<Button type='submit' onClick={handleNextClick} backgroundColor='grey-100' className='action-button'>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
