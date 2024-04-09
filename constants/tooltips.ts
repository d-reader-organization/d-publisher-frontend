import { TooltipImagePreview } from '@/components/TooltipContent'
import comicBannerDesktopPreview from 'public/assets/previews/comic-banner-desktop.png'
import comicBannerMobilePreview from 'public/assets/previews/comic-banner-mobile.jpg'
import comicBannerExample from 'public/assets/previews/comic-banner-example.jpg'

import comicCoverDesktopPreview from 'public/assets/previews/comic-cover-desktop.png'
import comicCoverMobilePreview from 'public/assets/previews/comic-cover-mobile.jpg'
import comicCoverExample from 'public/assets/previews/comic-cover-example.jpg'

import comicLogoDesktopPreview from 'public/assets/previews/comic-logo-desktop.png'
import comicLogoMobilePreview from 'public/assets/previews/comic-logo-mobile.jpg'
import comicLogoExample from 'public/assets/previews/comic-logo-example.png'

export const genresTooltipText = 'We suggest picking not more than 3 genres'
export const audienceTypeTooltipText = `Pick an audience for your comic series:

(E) EVERYONE - Appropriate for readers of all ages. May contain cartoon violence and/or some comic mischief.
(T) TEEN - Appropriate for readers age 12 and older. May contain mild violence, language and/or suggestive themes.
(T+) TEEN PLUS - Appropriate for readers age 15 and older. May contain moderate violence, mild profanity, graphic imagery and/or suggestive themes.
(M) MATURE - Appropriate for readers age 17 and older. May contain intense violence, extensive profanity, nudity, sexual themes and other content suitable only for older readers`

export const currentStatusTooltipText =
	'Are your series complete and expect no more releases or is it an ongoing series?'

export const isComicFreeToReadTooltipText = `Do you want this comic episode to be available to read for free on the platform, Regardless if the user owns the digital copy or is a monthly subscriber?

In other words, do you want this comic episode to be part of our freemium offer`

export const signatureTooltipText = `.png format required

This signature image will be used when you sign a digital copy to your fan (collector).

If you're unsure what to put in here, feel free to skip the step or contact us for advice.

Ideally, signature image would have the same resolution (width, height) as the comic cover which you've previously uploaded
`

export const pdfTooltipText = `This file will be used for offline reading when users want to download offline content

Furthermore, if your comic issue is an NFT collection, this pdf file will be attached the each NFT from the collection to guarantee the ownership of the content to collectors.
`

export const coverVariantsTooltipText = `Comic episodes can have up to 5 rarities. You might opt into:
- no rarities
- 3 rarities (common, rare, legendary)
- 5 rarities (common, uncommon, rare, epic, legendary)

Ideally, these rarities would represent variants done by different featured cover artists`

export const statefulCoverVariantsTooltipText = `Each cover variant can have 4 different states:
- unopened (mint), unsigned
- unopened (mint), signed
- opened (used), unsigned
- opened (used), signed

Artists can sign the digital copy of a comic, and collectors can choose to 'unwrap' the comic. Just like with physical comics`

export const numberOfPagesTooltipText = `Creators sometimes hesitate to show their full comic episode. Most common reason is to keep the full content premium (monetizable) and only tease portion of the story.

Use this setting to determine how many of the first pages you are willing to show to the public as a 'preview'.`

export const comicBannerTooltipText = `Following formats are allowed:
- if transparent: .png, .webp, .gif
- if not transparent: .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg or webp format if the image has no transparency.

Pick an image with a ratio 1920:900 and at least 1920x900 resolution.
`

export const comicBannerPreviews: TooltipImagePreview[] = [
	{
		image: comicBannerExample,
		caption: 'Comic banner example',
	},
	{
		image: comicBannerDesktopPreview,
		caption: 'Comic banner on desktop',
	},
	{
		image: comicBannerMobilePreview,
		caption: 'Comic banner on mobile',
	},
]

export const comicCoverTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg or webp format.
Make sure the image has no transparent background.

Pick an image with a ratio 10:9 and at least 1000x900 resolution.

Your cover image should not have the comic "title" art on top of it. This image will be used within the app to promote different comic series.

If you don't have a "comic series" art, feel free to crop the cover art any of your comic issues
`

export const comicCoverPreviews: TooltipImagePreview[] = [
	{
		image: comicCoverExample,
		caption: 'Comic cover example',
	},
	{
		image: comicCoverDesktopPreview,
		caption: 'Comic covers on desktop',
	},
	{
		image: comicCoverMobilePreview,
		caption: 'Cover cover on mobile',
	},
]

export const comicPfpTooltipText = `Following formats are allowed:
- if transparent: .png, .webp, .gif
- if not transparent: .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg or webp format if the image has no transparency.

Pick an image with a ratio 1:1 and at least 500x500 resolution.

This image will be used around the app on places like leaderboards.
`

export const comicPfpPreviews: TooltipImagePreview[] = [
	{
		image: comicPfpExample,
		caption: 'Comic PFP example',
	},
]

export const comicLogoTooltipText = `Following formats are allowed:
- .png, .webp, .gif

Preferrably a png format. Make sure the image has a transparent background.

Preferrably an image with a ratio 800:450 and at least 800x450 resolution, but not a strict specification.

This image will be placed on top of comic series banner and cover images.
`

export const comicLogoPreviews: TooltipImagePreview[] = [
	{
		image: comicLogoExample,
		caption: 'Comic logo example',
	},
	{
		image: comicLogoDesktopPreview,
		caption: 'Comic logo on desktop',
	},
	{
		image: comicLogoMobilePreview,
		caption: 'Cover logos on mobile',
	},
]

export const comicIssueCoverImageTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg or webp format.
Make sure the image has no transparent background.

Pick an image with a ratio 690:1000 and (ideally) at least 1024x1484px resolution.
`

export const comicIssuePagesTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp

Preferrably a jpg or webp format and optimize your assets for best download speed

Ratio 690:1000 and at least 1024x1484px resolution is preferred for optimal display, but not a necessity.
`

export const creatorVisualIdentityTooltipText = `Following formats are allowed:
- if transparent: .png, .webp, .gif
- if not transparent: .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg or webp format if the image has no transparency.

Ratio for the avatar is 1:1 and the resolution should be at least 500x500.
Ratio for the banner is 1920:900px and the resolution should be at least 1920x900px.
`

export const comicIssueAuthorsTooltipText =
	'A list of artists which were involved in the creative process of the comic episode'
export const comicAuthorsTooltipText =
	'A list of artists which were involved in the creative process of the comic series'
