import { AudienceType } from '@/enums/audienceType'
import { CollaboratorRole } from '@/enums/collaboratorRole'
import { ComicIssueCollaborator } from '@/models/comicIssue/comicIssueCollaborator'
import { PartialGenre } from '@/models/genre'
import { SelectInputField } from '@/models/selectInputField'
import { SelectOption } from '@/models/selectOption'

export const ROLE_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'Advisor', value: CollaboratorRole.Advisor },
	{ label: 'Artist', value: CollaboratorRole.Artist },
	{ label: 'Co-writer', value: CollaboratorRole.CoWriter },
	{ label: 'Colorist', value: CollaboratorRole.Colorist },
	{ label: 'Cover Artist', value: CollaboratorRole.CoverArtist },
	{ label: 'Creative Director', value: CollaboratorRole.CreativeDirector },
	{ label: 'Editor', value: CollaboratorRole.Editor },
	{ label: 'Illustrator', value: CollaboratorRole.Illustrator },
	{ label: 'Inker', value: CollaboratorRole.Inker },
	{ label: 'Letterer', value: CollaboratorRole.Letterer },
	{ label: 'Penciler', value: CollaboratorRole.Penciler },
	{ label: 'Translator', value: CollaboratorRole.Translator },
	{ label: 'Writer', value: CollaboratorRole.Writer },
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

export function mapCollaboratorsToSelectInput(collaborators: ComicIssueCollaborator[]): SelectInputField[] {
	return collaborators.map((collaborator) => {
		return {
			selectValue: collaborator.role as CollaboratorRole,
			inputValue: collaborator.name,
		}
	})
}

export const areValidDefaultValues = (defaultValues: SelectInputField[]): boolean => {
	return defaultValues.length > 0 && defaultValues.every((value) => value.hasOwnProperty('selectValue'))
}
