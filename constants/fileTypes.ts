export const nonTransparentImageTypes = {
	'image/jpeg': ['.jpg', '.jpeg'],
	'image/webp': ['.webp'],
}

export const transparentImageTypes = {
	'image/png': ['.png'],
	'image/gif': ['.gif'],
}

export const imageTypes = {
	...nonTransparentImageTypes,
	...transparentImageTypes,
}

export const pdfType = {
	'application/pdf': ['.pdf'],
}

// https://react-dropzone.js.org/#browser-limitations
