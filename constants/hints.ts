import { FaqItem } from '@/components/layout/FormFaqItem'
import { audienceTypeTooltipText } from './tooltips'

export const CREATE_COMIC_FAQ: FaqItem[] = [
	{
		summary: 'Title',
		content: `This is a title of your comic series. Do not mistake it with an episode name. Example comic series name is 'One Punch Man', and example comic episode name is 'One Punch Origin'.`,
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
