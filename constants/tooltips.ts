import { TooltipImagePreview } from '@/components/TooltipContent'
import comicBannerMobilePreview from 'public/assets/previews/comic-banner-mobile.png'

import comicCoverDesktopPreview from 'public/assets/previews/comic-cover-desktop.png'
import comicCoverMobilePreview from 'public/assets/previews/comic-cover-mobile.png'

import issueCoverVariantsPreview from 'public/assets/previews/comic-issue-cover-variants.png'
import issueCoverPreview from 'public/assets/previews/comic-issue-cover-preview.png'
import signaturePreview from 'public/assets/previews/comic-issue-signature.png'

import comicLogoDesktopPreview from 'public/assets/previews/comic-logo-desktop.png'
import comicLogoMobilePreview from 'public/assets/previews/comic-logo-mobile.jpg'
import comicLogoExample from 'public/assets/previews/comic-logo-example.png'

export const genresTooltipText = 'We suggest picking not more than 4 genres'
export const audienceTypeTooltipText = `Pick an audience for your comic series:

(E) EVERYONE - Appropriate for readers of all ages. May contain cartoon violence and/or some comic mischief.
(T) TEEN - Appropriate for readers age 12 and older. May contain mild violence, language and/or suggestive themes.
(T+) TEEN PLUS - Appropriate for readers age 15 and older. May contain moderate violence, mild profanity, graphic imagery and/or suggestive themes.
(M) MATURE - Appropriate for readers age 17 and older. May contain intense violence, extensive profanity, nudity, sexual themes and other content suitable only for older readers`

export const currentStatusTooltipText =
	'Is your series complete and expects no more releases or is it an ongoing series?'

export const isComicFreeToReadTooltipText = `Do you want this comic episode to be available to read for free on the platform, Regardless if the user owns the digital copy or is a monthly subscriber?

In other words, do you want this comic episode to be part of our freemium offer.`

export const signatureTooltipText = `.png format required

This signature image will be used when you sign a digital copy to your fan (collector).

Signature image should have the same resolution (width, height) as the comic cover, because we'll merge those two images together.
`

export const signaturePreviews: TooltipImagePreview[] = [
	{
		image: signaturePreview,
		caption: 'Signed and unsigned comic',
	},
]

export const pdfTooltipText = `This file will be used for offline reading when users want to download offline content.

Furthermore, if your comic issue is an Digital Collectible, this pdf file will be attached the each collectible from the collection to guarantee the ownership of the content to collectors.

In other words, if someone owns the token representation of the comic, they'll have access to the pdf.

Maximum file size: 100MB
`

export const coverVariantsTooltipText = `Comic episodes can have up to 5 rarities. You might opt into:
- no rarities
- 3 rarities (common, rare, legendary)
- 5 rarities (common, uncommon, rare, epic, legendary)

Ideally, these rarities will represent variants done by different featured cover artists`

export const issueCoverVariantsPreviews: TooltipImagePreview[] = [
	{
		image: issueCoverVariantsPreview,
		caption: 'Cover variants',
	},
]

export const handleTooltipText = `For example, for user @dReaderApp input only 'dReaderApp'`

export const statefulCoverVariantsTooltipText = `Each cover variant can have 4 different states:
- unopened (mint), unsigned
- unopened (mint), signed
- opened (used), unsigned
- opened (used), signed

Artists can sign the digital copy of a comic, and collectors can choose to 'unwrap' the comic. Just like with physical comics.

For each cover variant you'll need to select the preferred "wrapper" and "used" overlays, and upload your signature!`

export const numberOfPagesTooltipText = `Creators sometimes hesitate to show their full comic episode. Most common reason is to keep the full content premium (monetizable) and only tease portion of the story.

Use this setting to determine how many of the first pages you are willing to show to the public as a 'preview'.`

export const comicBannerTooltipText = `Following formats are allowed:
- if transparent: .png, .webp, .gif
- if not transparent: .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg format if the image has no transparency.

Pick an image with a ratio 1920:900 and at least 1920x900 resolution.

Recommended max file size: 2.5 MB
Maximum file size: 5 MB
`

export const comicBannerPreviews: TooltipImagePreview[] = [
	{
		image: comicBannerMobilePreview,
		caption: 'Comic banner on mobile',
	},
]

export const comicCoverTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg format. Make sure the image has no transparent background.

Pick an image with a ratio 10:9 and at least 1000x900 resolution.

Your cover image should not have the comic "title" (logo) art on top of it as that's a separate asset.

This cover image will be used within the app to promote different comic series.

If you don't have comic series art, feel free to crop the cover art any of your comic issues

Recommended max file size: 2.5 MB
Maximum file size: 5 MB
`

export const comicCoverPreviews: TooltipImagePreview[] = [
	{
		image: comicCoverMobilePreview,
		caption: 'Cover cover on mobile',
	},
	{
		image: comicCoverDesktopPreview,
		caption: 'Comic covers with logo on top',
	},
]

export const comicLogoTooltipText = `Following formats are allowed:
- .png, .webp, .gif

Preferrably a png format. Make sure the image has a transparent background.

Preferrably a horizontal (landscape) orientation of the image.

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

export const issueCoverImageTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg format. Make sure the image has no transparent background.

Pick an image with a ratio 690:1000 and at least 1024x1484px resolution.

You can set the cover as 'default'. Default cover is shown across the app when displaying the comic.

Recommended max file size: 2.5 MB
Maximum file size: 5 MB
`

export const issueCoverPreviews: TooltipImagePreview[] = [
	{
		image: issueCoverPreview,
		caption: 'Cover in-app preview',
	},
]

export const comicIssuePagesTooltipText = `Following formats are allowed:
- .jpg, .jpeg, .webp

Preferrably a jpg format and optimize your assets for best download speed

Ratio 690:1000 and at least 1024x1484px resolution is preferred for optimal display, but not a necessity.

Recommended max file size: 2.5 MB
Maximum file size: 20 MB
`

export const creatorVisualIdentityTooltipText = `Following formats are allowed:
- if transparent: .png, .webp, .gif
- if not transparent: .jpg, .jpeg, .webp, .png, .gif

Preferrably a jpg format if the image has no transparency.

Ratio for the avatar is 1:1 and the resolution should be at least 500x500.
Ratio for the banner is 1920:900px and the resolution should be at least 1920x900px.

Recommended max file size: 2.5 MB
Maximum file size: 5 MB
`

export const comicAuthorsTooltipText =
	'A list of artists which were involved in the creative process of the comic series'

export const issueTitleTooltipText = `This is a title of your individual comic episode. Do not mistake it with a series title.

For example, comic series title is 'One Punch Man', and comic episode title is 'Episode 1' or 'One Punch Origin'.`
export const issueNumberTooltipText = `Numeration of your comic episode: first episode, second episode..`
export const releaseDateTooltipText = `Date your comic has been first released, whether it's physically or digitally. When does your comic celebrate it's birthday?`
export const issueAuthorsTooltipText =
	'A list of artists which were involved in the creative process of the comic episode'

export const saleDetailsRevenueRangeTooltipText = `Set the desired revenue range for the comic sale. For example you might want to generate at least $1,000 from the sale, and don't need more than $2,000.`
export const saleDetailsSupplyRangeTooltipText = `Your comic episode is a collectible item. It means that it has a scarce supply. For example you might want the collection to have exactly 1000 supply, or somewhere between 500 and 1000.`
export const saleDetailsLaunchDateTooltipText = `When would you like to start selling your comic?`
export const saleDetailsCurrenciesTooltipText = `Select currencies on the Solana blockchain you'd like to support. In most cases people opt into using the cryptocurrency USDC (USD Coin)`
export const saleDetailsRoyaltyBasisPointTooltipText = `How much royalties you'd like to charge for each resale of comics from your collection? Standard is 400 basis points (4%).`
export const saleDetailsRoyaltyAddressTooltipText = `Please specify a wallet address on the Solana blockchain which will receive profit from royalties.`
export const saleDetailsNoteTooltipText = `Write down any questions or suggestions you might have regarding the comic sale.`
