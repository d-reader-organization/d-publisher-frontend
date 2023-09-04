import { yupRequiredMessage } from 'utils/error'
import * as yup from 'yup'

export const loginValidationSchema = yup.object().shape({
	nameOrEmail: yup.string().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})
