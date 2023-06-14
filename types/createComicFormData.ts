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
	flavourText: string
	website: string
	twitter: string
	discord: string
	instagram: string
	lynkfire: string
	ownershipConfirmation: boolean
	authorRegistrationAndUploadingAgreement: boolean
}
