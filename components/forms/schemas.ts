import { generateMaxLengthErrorMessage, generateMinLengthErrorMessage, yupRequiredMessage } from 'utils/error'
import * as yup from 'yup'

export const connectSocialsValidationSchema = yup.object().shape({
	description: yup.string().max(256, generateMaxLengthErrorMessage('description', 256)),
	flavorText: yup.string().max(128, generateMaxLengthErrorMessage('description', 128)),
})

export const registerValidationSchema = yup.object().shape({
	name: yup
		.string()
		.required(yupRequiredMessage('Name'))
		.min(2, generateMinLengthErrorMessage('name', 2))
		.max(20, generateMaxLengthErrorMessage('name', 20)),
	email: yup.string().email().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})

export const yourDetailsValidationSchema = yup.object().shape({
	description: yup.string().max(256, generateMaxLengthErrorMessage('description', 256)),
	flavorText: yup.string().max(128, generateMaxLengthErrorMessage('description', 128)),
})

export const visualIdentityValidationSchema = yup.object().shape({
	avatar: yup.mixed(),
	banner: yup.mixed(),
})
