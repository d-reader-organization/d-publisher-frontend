import { CarouselLocation } from 'enums/carouselLocation'

export interface CarouselSlide {
	id: number
	image: string
	priority: number
	title?: string
	subtitle?: string
	isPublished: boolean
	isExpired: boolean
	location: CarouselLocation
	comicIssueId?: number
	comicSlug?: string
	creatorSlug?: string
	externalLink?: string
}

export interface CreateCarouselSlideData extends Pick<
	CarouselSlide,
	| 'priority'
	| 'title'
	| 'subtitle'
	| 'comicIssueId'
	| 'comicSlug'
	| 'creatorSlug'
	| 'externalLink'
> {
	image: File
	location:string
	expiredAt?:Date
}

export type UpdateCarouselSlideData = Partial<
	Pick<
		CreateCarouselSlideData,
		'priority' | 'title' | 'subtitle' | 'location' | 'comicIssueId' | 'comicSlug' | 'creatorSlug' | 'externalLink'
	>
>

export interface CarouselSlideParams {
	getExpired?:boolean
}