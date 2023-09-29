'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
import { useFetchRawComicIssue, useUpdateComicIssueStatelessCovers } from '@/api/comicIssue'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import { statefulCoverVariantsTooltipText } from '@/constants/tooltips'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import SkeletonImage from '@/components/SkeletonImage'
import { statelessCoversToStatefulCovers } from '@/utils/covers'
import { groupBy, map } from 'lodash'

export default function UploadComicIssueStatefulCoversPage() {
	const toaster = useToaster()
	const router = useRouter()
	const params = useParams()
	const comicIssueId = params['id'] || ''
	const nextPage = RoutePath.ComicIssueUploadAssets(comicIssueId)

	const [issueCovers, setIssueCovers] = useState<CreateStatefulCoverData[]>([])

	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const { mutateAsync: updateStatelessCovers } = useUpdateComicIssueStatelessCovers(comicIssueId)

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

		let i = 0
		for (const cover of issueCovers) {
			if (cover.image) formData.append(`covers[${i}][image]`, cover.image)
			formData.append(`covers[${i}][artist]`, cover.artist)
			formData.append(`covers[${i}][isSigned]`, cover.isSigned.toString())
			formData.append(`covers[${i}][isUsed]`, cover.isUsed.toString())
			formData.append(`covers[${i}][rarity]`, cover.rarity)
			i = i + 1
		}

		await updateStatelessCovers(formData)
		router.push(nextPage)
	}

	const groupedCovers = groupBy(issueCovers, 'rarity')

	console.log(groupedCovers, comicIssue.signature)
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
												{isSigned && (
													<SkeletonImage
														alt=''
														src={comicIssue.signature}
														width={200}
														height={280}
														className='signature-overlay'
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
