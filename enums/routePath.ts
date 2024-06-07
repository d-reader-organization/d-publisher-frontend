export const RoutePath = Object.freeze({
	Home: '/',
	Dashboard: '/dashboard',
	Profile: '/profile',
	Analytics: '/analytics',
	Inbox: '/inbox',
	Settings: '/settings',
	Login: '/login',
	Register: '/register',
	RegisterSubmit: '/register/submit',
	RegisterYourDetails: '/register/your-details',
	RegisterVisualIdentity: '/register/visual-identity',
	RegisterConnectSocials: '/register/connect-socials',
	Creator: (creatorId: string | number) => `/creator/${creatorId}`,
	IssueSpotlight: (comicIssueId:string | number) => `/admin/issue-spotlight/${comicIssueId}`,
	Comic: (comicSlug: string) => `/comic/${comicSlug}`,
	CreateComic: '/comic/create',
	EditComic: (comicSlug: string) => `/comic/${comicSlug}/edit`,
	ComicUploadAssets: (comicSlug: string) => `/comic/${comicSlug}/upload-assets`,
	ComicConnectSocials: (comicSlug: string) => `/comic/${comicSlug}/connect-socials`,
	ComicIssue: (comicIssueId: string | number) => `/comic-issue${comicIssueId}`,
	EditComicIssue: (comicIssueId: string | number) => `/comic-issue/${comicIssueId}/edit`,
	CreateComicIssue: (comicSlug: string) => `/comic-issue/create?comicSlug=${comicSlug}`,
	ComicIssueUploadCovers: (comicIssueId: string | number) => `/comic-issue/${comicIssueId}/upload-covers`,
	ComicIssueUploadPages: (comicIssueId: string | number) => `/comic-issue/${comicIssueId}/upload-pages`,
	ComicIssueSubmitted: (comicIssueId: string | number) => `/comic-issue/${comicIssueId}/submitted`,
	ComicIssueMakeCollectibleGamifiedCovers: (comicIssueId: string | number) =>
		`/comic-issue/${comicIssueId}/make-collectible/gamified-covers`,
	ComicIssueMakeCollectibleSalesData: (comicIssueId: string | number) =>
		`/comic-issue/${comicIssueId}/make-collectible/sales-data`,
	ComicIssueMakeCollectibleSubmitted: (comicIssueId: string | number) =>
		`/comic-issue/${comicIssueId}/make-collectible/submitted`,
})
