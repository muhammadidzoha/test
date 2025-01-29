export interface IKIE {
    title: string;
    description: string?;
    type: number;
    createdBy: number;
    updatedBy: number;
}

export interface IArticle {
    content: string;
    bannerUrl: string?;
    thumbnailUrl: string?;
}

export interface IPoster {
    imageUrl: string;
    thumbnailUrl: string?
}

export interface IVideo {
    videoUrl: string;
    thumbnailUrl: string?;
}

export type ICreateKIEArticle = IKIE & IArticle;
export type ICreateKIEPoster = IKIE & IPoster;
export type ICreateKIEVideo = IKIE & IVideo;
