import { AudienceType } from 'enums/audienceType'
import { CurrentStatus } from 'enums/currentStatus'

import { SelectOption } from './selectOption'

export type CreateComicFormData = {
	title: string
	genres: Omit<SelectOption, 'icon'>[]
	audienceType: AudienceType | ''
	currentStatus: CurrentStatus | ''
	logo: string
	banner: string
	description: string
	flavourText: string | undefined
	website: string | undefined
	twitter: string | undefined
	discord: string | undefined
	instagram: string | undefined
	lynkfire: string | undefined
	ownershipConfirmation: boolean
	authorRegistrationAndUploadingAgreement: boolean
}
