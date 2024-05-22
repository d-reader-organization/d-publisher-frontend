import * as yup from 'yup'

// Add a custom method to Yup for checking the absence of a '/' character
yup.addMethod(yup.string, 'noSlash', function (errorMessage = "should not containt '/'") {
	return this.test('noSlash', errorMessage, function (value) {
		const { path, createError } = this
		return value === undefined || value === null || !value.includes('/') || createError({ path, message: errorMessage })
	})
})

// Extend Yup's type definitions to include the noSlash method
declare module 'yup' {
	interface StringSchema {
		noSlash(errorMessage?: string): this
	}
}
