import { PartialGenre } from "../genre";

export interface RawCreator {
    id: number;
    email: string;
    name: string;
    slug: string;
    verifiedAt: string;
    emailVerifiedAt?: string;
    avatar: string;
    banner: string;
    logo: string;
    description: string;
    flavorText: string;
    tippingAddress: string;
    website: string;
    twitter: string;
    instagram: string;
    lynkfire: string;
    genres?: PartialGenre[];
  }
  