'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Steps from 'components/Steps'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import useAuthenticatedRoute from '@/hooks/useCreatorAuthenticatedRoute'
import Form from '@/components/forms/Form'
import { RoutePath } from '@/enums/routePath'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'

import { useGlobalContext } from '@/providers/GlobalProvider'
import { FormProvider, Resolver, useForm } from 'react-hook-form'
import { CreateDraftComicIssueSalesData } from '@/models/draftComicIssueSalesData'
import { yupResolver } from '@hookform/resolvers/yup'
import { createDraftComicIssueSalesDataValidationSchema } from '@/components/forms/schemas'
import Input from '@/components/forms/Input'
import { useToaster } from '@/providers/ToastProvider'
import CustomDatePicker from '@/components/forms/CustomDatePicker'
import {
	saleDetailsCurrenciesTooltipText,
	saleDetailsLaunchDateTooltipText,
	saleDetailsNoteTooltipText,
	saleDetailsRevenueRangeTooltipText,
	saleDetailsRoyaltyAddressTooltipText,
	saleDetailsRoyaltyBasisPointTooltipText,
	saleDetailsSupplyRangeTooltipText,
} from '@/constants/tooltips'
import { splTokensToSelectOptions } from '@/constants/selectOptions'
import Select from '@/components/forms/Select'
import { useFetchSupportedTokens } from '@/api/settings'
import { useCreateDraftComicIssueSalesData } from '@/api/draftComicIssueSalesData'
import HintDrawer from '@/components/layout/HintDrawer'
import FormFaqItems from '@/components/layout/FormFaqItem'
import { CREATE_DRAFT_COMIC_ISSUE_SALES_DATA_FAQ } from '@/constants/hints'
import { useLocalStorage } from '@/hooks'
import { useRouter } from 'next/navigation'

interface Params {
	id: string | number
}

export default function MakeCollectibleSalesDataPage({ params }: { params: Params }) {
	const toaster = useToaster()
	const comicIssueId = params.id || ''
	const { data: splTokens } = useFetchSupportedTokens()
	const { mutateAsync: createDraftComicIssueSalesData } = useCreateDraftComicIssueSalesData()
	const [isHintDrawerOpen] = useLocalStorage('hint-drawer-open', true)
	const nextPage = RoutePath.ComicIssueMakeCollectibleSubmitted(comicIssueId)
	const { isLoading } = useGlobalContext()
	const form = useForm<CreateDraftComicIssueSalesData>({
		defaultValues: {
			comicIssueId: +comicIssueId,
		},
		resolver: yupResolver(createDraftComicIssueSalesDataValidationSchema) as Resolver<CreateDraftComicIssueSalesData>,
	})
	const { register, handleSubmit, setValue } = form
	const router = useRouter()

	usePrefetchRoute(nextPage)
	useAuthenticatedRoute()

	if (!splTokens) {
		return null
	}

	const handleNextClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await createDraftComicIssueSalesData(data)
			router.push(nextPage)
		}, toaster.onFormError)()
	}

	return (
		<>
			<Header title='Submit for sale' />
			<Steps
				steps={[
					{ label: '01 Gamified covers', isActive: false },
					{ label: '02 Sale details', isActive: true },
				]}
			/>

			<main className='main--with-hint-drawer'>
				<FormProvider {...form}>
					<Form
						padding
						maxSize='xl'
						fullWidth
						className='form--edit-draft-comic-issue-sales-data'
						hiddenOnMobile={isHintDrawerOpen}
					>
						<Label isRequired tooltipText={saleDetailsRevenueRangeTooltipText}>
							Revenue range
						</Label>
						<div className='range-wrapper'>
							<Input type='number' prefix='Min' className='range-spacing' {...register('revenueMin')} />
							<Input type='number' prefix='Max' {...register('revenueMax')} />
						</div>
						<Label isRequired tooltipText={saleDetailsSupplyRangeTooltipText}>
							Supply range
						</Label>
						<div className='range-wrapper'>
							<Input type='number' prefix='Min' className='range-spacing' {...register('supplyMin')} />
							<Input type='number' prefix='Max' {...register('supplyMax')} />
						</div>
						<Label isRequired tooltipText={saleDetailsLaunchDateTooltipText}>
							Launch date range
						</Label>
						<div className='date-range-wrapper'>
							<CustomDatePicker name='launchDateMin' className='range-spacing date-input' />
							<CustomDatePicker name='launchDateMax' className='date-input' />
						</div>
						<Label isRequired tooltipText={saleDetailsCurrenciesTooltipText}>
							Currencies
						</Label>
						<Select
							isSearchable
							isMultipleSelect
							placeholder='Select currencies'
							options={splTokensToSelectOptions(splTokens)}
							onSelect={(selectedOptions = []) => {
								setValue(
									'currencies',
									selectedOptions.map((currency) => currency.value)
								)
							}}
							ref={register('currencies').ref}
						/>

						<Label isRequired tooltipText={saleDetailsRoyaltyBasisPointTooltipText}>
							Royalty Basis Point
						</Label>
						<Input type='number' className='number-input' {...register('royaltyBasisPoint')} />

						<Label isRequired tooltipText={saleDetailsRoyaltyAddressTooltipText}>
							Royalty Address
						</Label>
						<Input {...register('royaltyAddress')} />

						<Label isRequired tooltipText={saleDetailsNoteTooltipText}>
							Note
						</Label>
						<Input {...register('note')} />

						<FormActions marginTop>
							<Button
								type='submit'
								disabled={isLoading}
								onClick={handleNextClick}
								backgroundColor='grey-100'
								className='action-button'
							>
								Next <ArrowRightIcon className='action-button-icon' />
							</Button>
						</FormActions>
					</Form>
				</FormProvider>
				<HintDrawer>
					<FormFaqItems items={CREATE_DRAFT_COMIC_ISSUE_SALES_DATA_FAQ} />
				</HintDrawer>
			</main>
		</>
	)
}
