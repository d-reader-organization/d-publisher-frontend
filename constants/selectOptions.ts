import { AudienceType } from '@/enums/audienceType'
import { CollaboratorRole } from '@/enums/collaboratorRole'
import { PartialGenre } from '@/models/genre'
import { SelectOption } from '@/models/selectOption'

export const ROLE_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'Writer', value: CollaboratorRole.Writer },
	{ label: 'Artist', value: CollaboratorRole.Artist },
	{ label: 'Colorist', value: CollaboratorRole.Colorist },
	{ label: 'Editor', value: CollaboratorRole.Editor },
	{ label: 'Letterer', value: CollaboratorRole.Letterer },
	{ label: 'Cover Artist', value: CollaboratorRole.CoverArtist },
]

export const AUDIENCE_TYPE_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'Everyone', value: AudienceType.Everyone },
	{ label: 'Mature', value: AudienceType.Mature },
	{ label: 'Teen', value: AudienceType.Teen },
	{ label: 'Teen+', value: AudienceType.TeenPlus },
]

export const IS_ONGOING_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'Ongoing', value: 'false' },
	{ label: 'Completed', value: 'true' },
]

export const RARITY_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'no rarities', value: '1' },
	{ label: '3 rarities', value: '3' },
	{ label: '5 rarities', value: '5' },
]

export const genresToSelectOptions = (genres: PartialGenre[]): SelectOption[] => {
	return genres.map((genre) => {
		return { label: genre.name, value: genre.slug, icon: genre.icon }
	})
}

export const findOptions = (options: SelectOption[], ...values: string[]): SelectOption[] => {
	return options.filter((option) => values.includes(option.value))
}
