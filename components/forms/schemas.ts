import { generateMaxLengthErrorMessage, generateMinLengthErrorMessage, yupRequiredMessage } from 'utils/error'
import * as yup from 'yup'

export const updateCreatorValidationSchema = yup.object().shape({
	description: yup.string().max(256, generateMaxLengthErrorMessage('description', 256)),
	flavorText: yup.string().max(128, generateMaxLengthErrorMessage('flavor text', 128)),
	tippingAddress: yup.string().max(128, generateMaxLengthErrorMessage('tipping address', 128)),
})

export const visualIdentityValidationSchema = yup.object().shape({
	avatar: yup.mixed(),
	banner: yup.mixed(),
})

export const connectSocialsValidationSchema = yup.object().shape({
	website: yup.string().max(30, generateMaxLengthErrorMessage('website', 30)),
	twitter: yup.string().max(30, generateMaxLengthErrorMessage('twitter', 30)),
	instagram: yup.string().max(30, generateMaxLengthErrorMessage('instagram', 30)),
	lynkfire: yup.string().max(30, generateMaxLengthErrorMessage('lynkfire', 30)),
})
