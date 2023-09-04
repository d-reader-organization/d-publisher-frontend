import { CollaboratorRole } from '@/enums/collaboratorRole'
import { SelectOption } from '@/models/selectOption'

export const ROLE_SELECT_OPTIONS: SelectOption[] = [
	{ label: 'Writer', value: CollaboratorRole.Writer },
	{ label: 'Artist', value: CollaboratorRole.Artist },
	{ label: 'Colorist', value: CollaboratorRole.Colorist },
	{ label: 'Editor', value: CollaboratorRole.Editor },
	{ label: 'Letterer', value: CollaboratorRole.Letterer },
	{ label: 'Cover Artist', value: CollaboratorRole.CoverArtist },
]
