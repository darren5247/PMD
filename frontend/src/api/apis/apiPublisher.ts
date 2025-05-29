import { IStrapiPublisher } from '@src/types';
import api from '../config';

export interface IGetMusicPublisherResponse {
  status: number;
  data: IStrapiPublisher;
};

export const apiPublisher = {
  get: (id?: string) =>
    api.get<IGetMusicPublisherResponse>(`/publishers/${id ?? '0'}?populate[image][fields][0]=height&populate[image][fields][1]=width&populate[image][fields][2]=url&fields[0]=name&fields[1]=excerpt&fields[2]=nationality&fields[3]=urlSpotify&fields[4]=urlAppleMusic&fields[5]=urlWebsite&fields[6]=urlSocialInstagram&fields[7]=urlSocialFacebook&fields[8]=urlSocialX&fields[9]=urlSocialLinkedIn&fields[10]=urlSocialYouTube&fields[11]=publishedAt&populate[imageSEO][fields][12]=height&populate[imageSEO][fields][13]=width&populate[imageSEO][fields][14]=url&populate[imageSEO][fields][15]=alternativeText`)
};
