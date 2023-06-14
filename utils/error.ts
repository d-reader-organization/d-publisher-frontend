export const generateRequiredErrorMessage = (name: string) => `${name} is required`

export const generateMinLengthErrorMessage = (name: string, minLength: number | string) =>
	`Max length for ${name} is ${minLength} characters`

export const generateMaxLengthErrorMessage = (name: string, maxLength: number | string) =>
	`Max length for ${name} is ${maxLength} characters`

export const generateNotCheckedErrorMessage = (name: string) => `${name} must be checked`

export const generateEmptyStringErorrMessage = (name: string) => `${name} can't be empty`
