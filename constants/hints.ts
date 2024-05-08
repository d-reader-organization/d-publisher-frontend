import { FaqItem } from '@/components/layout/FormFaqItem'
import {
	audienceTypeTooltipText,
	issueCoverImageTooltipText,
	coverVariantsTooltipText,
	isComicFreeToReadTooltipText,
	issueAuthorsTooltipText,
	issueNumberTooltipText,
	issueTitleTooltipText,
	releaseDateTooltipText,
	saleDetailsRevenueRangeTooltipText,
	saleDetailsSupplyRangeTooltipText,
	saleDetailsLaunchDateTooltipText,
	saleDetailsCurrenciesTooltipText,
	saleDetailsRoyaltyBasisPointTooltipText,
	saleDetailsRoyaltyAddressTooltipText,
	saleDetailsNoteTooltipText,
} from './tooltips'

export const CREATE_COMIC_FAQ: FaqItem[] = [
	{
		summary: 'Title',
		content: `This is a title of your comic series. Do not mistake it with an episode name. For example, comic series title is 'One Punch Man', and comic episode title is 'Episode 1' or 'One Punch Origin'.`,
	},
	{
		summary: 'Genres',
		content: `We suggest picking not more than 4 genres. Try to be specific and focus only on main genres of your comic series.`,
	},
	{
		summary: 'Audience type',
		content: audienceTypeTooltipText,
	},
	{
		summary: 'Current status',
		content: `Mark the series as 'Ongoing' if you plan to add more episodes. Mark the series as 'Completed' if it's completed and expects no new episodes.`,
	},
]

export const CREATE_COMIC_ISSUE_FAQ: FaqItem[] = [
	{
		summary: 'Title',
		content: issueTitleTooltipText,
	},
	{
		summary: 'Number',
		content: issueNumberTooltipText,
	},
	{
		summary: 'Release date',
		content: releaseDateTooltipText,
	},
	{
		summary: 'Authors list',
		content: issueAuthorsTooltipText,
	},
	{
		summary: 'Free to read',
		content: isComicFreeToReadTooltipText,
	},
]

export const UPLOAD_COMIC_ISSUE_COVERS_FAQ: FaqItem[] = [
	{
		summary: 'Covers',
		content: coverVariantsTooltipText,
	},
	{
		summary: 'Cover image',
		content: issueCoverImageTooltipText,
	},
]

export const CREATE_DRAFT_COMIC_ISSUE_SALES_DATA_FAQ: FaqItem[] = [
	{
		summary: 'Revenue range',
		content: saleDetailsRevenueRangeTooltipText,
	},
	{
		summary: 'Supply range',
		content: saleDetailsSupplyRangeTooltipText,
	},
	{
		summary: 'Launch date range',
		content: saleDetailsLaunchDateTooltipText,
	},
	{
		summary: 'Currencies',
		content: saleDetailsCurrenciesTooltipText,
	},
	{
		summary: 'Royalty basis point',
		content: saleDetailsRoyaltyBasisPointTooltipText,
	},
	{
		summary: 'Royalty address',
		content: saleDetailsRoyaltyAddressTooltipText,
	},
	{
		summary: 'Note',
		content: saleDetailsNoteTooltipText,
	},
]
