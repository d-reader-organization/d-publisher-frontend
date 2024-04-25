'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import mergeImages, { ImageSource } from 'merge-images'
import Resizer from 'react-image-file-resizer'
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
import Select from '@/components/forms/Select'
import { WRAPPER_SELECT_OPTIONS } from '@/constants/selectOptions'
import { USED_OVERLAY_SELECT_OPTIONS } from '@/constants/selectOptions'
import { SelectOption } from '@/models/selectOption'
import FileUpload from '@/components/forms/FileUpload'
import { useGlobalContext } from '@/providers/GlobalProvider'

interface Params {
	id: string | number
}

const resizeFile = ({
	file,
	dimensions = { maxWidth: 1024, maxHeight: 1484 },
	isSignature = false,
}: {
	file: File
	dimensions?: { maxWidth: number; maxHeight: number }
	isSignature?: boolean
}) =>
	new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			dimensions.maxWidth,
			dimensions.maxHeight,
			isSignature ? 'PNG' : 'JPEG',
			100,
			0,
			(uri) => {
				resolve(uri)
			},
			'base64'
		)
	})

export default function UploadComicIssueStatefulCoversPage({ params }: { params: Params }) {
	const toaster = useToaster()
	const router = useRouter()
	const comicIssueId = params.id || ''
	const { data: comicIssue } = useFetchRawComicIssue(comicIssueId)
	const nextPage = RoutePath.ComicIssuePublishSaleDetails(comicIssueId)
	const [issueCovers, setIssueCovers] = useState<CreateStatefulCoverData[]>([])
	const [wrapperOverlays, setWrapperOverlays] = useState<Record<string, string>>({})
	const [usedOverlays, setUsedOverlays] = useState<Record<string, string>>({})
	const [signatureImages, setSignatureImages] = useState<Record<string, string> | null>(null)
	const { mutateAsync: updateStatefulCovers } = useUpdateComicIssueStatefulCovers(comicIssueId)
	const [isProcessingFiles, setIsProcessingFiles] = useState<boolean>(false)
	const { isLoading } = useGlobalContext()

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	useEffect(() => {
		if (comicIssue?.statelessCovers) {
			const statefulCovers = statelessCoversToStatefulCovers(comicIssue?.statelessCovers)
			setIssueCovers(statefulCovers)
		}
	}, [comicIssue?.statelessCovers])

	if (!comicIssue) {
		return null
	}
	const mergeFiles = async (): Promise<FormData> => {
		const formData = new FormData()
		let index = 0
		toaster.processingFiles()
		setIsProcessingFiles(true)
		try {
			for (const cover of issueCovers) {
				const res = await fetch(cover.image)
				const blobFile = await res.blob()
				const file = new File([blobFile], `cover-${index}.png`, { type: blobFile.type })
				const resizedImage = (await resizeFile({
					file,
					...(!cover.isUsed && {
						dimensions: {
							maxWidth: 1116,
							maxHeight: 1476,
						},
					}),
				})) as string

				if (cover.image) {
					const imageWithPaddingPosition = { x: 18, y: 18 }
					const imagesToMerge: ImageSource[] = [{ src: resizedImage, ...(!cover.isUsed && imageWithPaddingPosition) }]
					if (cover.isSigned && signatureImages) {
						const signatureImage = signatureImages[cover.rarity]
						imagesToMerge.push({ src: signatureImage })
					}
					if (cover.isUsed) {
						imagesToMerge.push({
							src: usedOverlays[cover.rarity] || USED_OVERLAY_SELECT_OPTIONS[0].value,
						})
					} else {
						imagesToMerge.push({ src: wrapperOverlays[cover.rarity] || WRAPPER_SELECT_OPTIONS[0].value })
					}

					const mergedImageDataURL = await mergeImages(imagesToMerge, { crossOrigin: 'anonymous' })
					const response = await fetch(mergedImageDataURL)

					const blob = await response.blob()
					formData.append(`covers[${index}][image]`, blob, `cover-${index}.png`)
				}
				formData.append(`covers[${index}][artist]`, cover.artist)
				formData.append(`covers[${index}][isSigned]`, cover.isSigned.toString())
				formData.append(`covers[${index}][isUsed]`, cover.isUsed.toString())
				formData.append(`covers[${index}][rarity]`, cover.rarity)

				++index
			}
		} catch (error) {
			setIsProcessingFiles(false)
			toaster.add('Failed to process file(s)', 'error')
		}
		setIsProcessingFiles(false)
		return formData
	}

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
		const formData = await mergeFiles()

		await updateStatefulCovers(formData)
		router.push(nextPage)
	}

	const groupedCovers = groupBy(issueCovers, 'rarity')
	const handleWrapperSelect = (selectedOptions: SelectOption[], rarity: string) => {
		const selectedWrapper = selectedOptions[0].value

		setWrapperOverlays((prevState) => ({ ...prevState, [rarity]: selectedWrapper }))
	}

	const handleUsedOverlaySelect = (selectedOptions: SelectOption[], rarity: string) => {
		const selectedOverlay = selectedOptions[0].value
		setUsedOverlays((prevState) => ({ ...prevState, [rarity]: selectedOverlay }))
	}

	return (
		<>
			<Header title='Create issue' />
			<Steps
				steps={[
					{ label: '01 Gamified covers', isActive: true },
					{ label: '02 Sale details', isActive: false },
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
								<div className='stateful-cover-dropdown-wrapper'>
									<Select
										options={WRAPPER_SELECT_OPTIONS}
										onSelect={(selectedOptions: SelectOption[]) => handleWrapperSelect(selectedOptions, key)}
										defaultSelectedOptions={[WRAPPER_SELECT_OPTIONS[0]]}
										className='stateful-cover-dropdown'
										unselectableIfAlreadySelected={true}
									/>
									<Select
										options={USED_OVERLAY_SELECT_OPTIONS}
										onSelect={(selectedOptions: SelectOption[]) => handleUsedOverlaySelect(selectedOptions, key)}
										defaultSelectedOptions={[USED_OVERLAY_SELECT_OPTIONS[0]]}
										className='stateful-cover-dropdown'
										unselectableIfAlreadySelected={true}
									/>
									<FileUpload
										inline
										className='stateful-cover-signature'
										id={`upload-${key}`}
										label='Upload signature'
										onUpload={async (uploadedFiles) => {
											const uploadedFile = uploadedFiles[0]
											if (uploadedFile) {
												const resizedImage = (await resizeFile({
													file: uploadedFile.file,
													isSignature: true,
												})) as string
												setSignatureImages((prevState) => ({ ...prevState, [key]: resizedImage }))
											}
										}}
									/>
								</div>
								{covers.map((cover) => {
									const { rarity, isSigned, isUsed, image } = cover
									return (
										<div className='rarity-cover-wrapper' key={rarity + isSigned + isUsed}>
											<Label>{`${isUsed ? 'Used' : 'Unused'}, ${isSigned ? 'Signed' : 'Unsigned'}`}</Label>
											<div className='cover-upload-wrapper'>
												<SkeletonImage
													alt=''
													src={image}
													width={200}
													height={280}
													className='cover-upload'
													style={{ padding: isUsed ? 0 : '3px' }}
												/>
												{isUsed ? (
													<>
														<SkeletonImage
															alt=''
															src={usedOverlays[rarity] || USED_OVERLAY_SELECT_OPTIONS[0].value}
															width={200}
															height={280}
															className='overlay-image'
														/>
														{isSigned && signatureImages && (
															<SkeletonImage
																alt=''
																src={signatureImages[cover.rarity]}
																width={200}
																height={280}
																className='overlay-image'
															/>
														)}
													</>
												) : (
													<>
														{isSigned && signatureImages && (
															<SkeletonImage
																alt=''
																src={signatureImages[cover.rarity]}
																width={200}
																height={280}
																className='overlay-image'
															/>
														)}
														<SkeletonImage
															alt=''
															src={wrapperOverlays[rarity] || WRAPPER_SELECT_OPTIONS[0].value}
															width={200}
															height={280}
															className='overlay-image'
														/>
													</>
												)}
											</div>
										</div>
									)
								})}
							</Expandable>
						)
					})}

					<FormActions marginTop>
						<Button
							type='submit'
							disabled={isProcessingFiles || isLoading}
							onClick={handleNextClick}
							backgroundColor='grey-100'
							className='action-button'
						>
							Next <ArrowRightIcon className='action-button-icon' />
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
