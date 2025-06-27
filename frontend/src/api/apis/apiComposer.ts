import { IStrapiComposer } from "@src/types";
import api from "../config";

export interface IGetMusicComposerResponse {
  status: number;
  data: IStrapiComposer;
}

export const apiComposer = {
  get: (id?: string) =>
    api.get<IGetMusicComposerResponse>(
      `/composers/${id ?? "0"}?populate[image][fields][0]=height&populate[image][fields][1]=width&populate[image][fields][2]=url&fields[0]=name&fields[1]=excerpt&fields[2]=birth_year&fields[3]=death_year&fields[4]=nationality&fields[5]=urlSpotify&fields[6]=urlAppleMusic&fields[7]=urlWebsite&fields[8]=urlSocialInstagram&fields[9]=urlSocialFacebook&fields[10]=urlSocialX&fields[11]=urlSocialLinkedIn&fields[12]=urlSocialYouTube&fields[13]=publishedAt&populate[imageSEO][fields][14]=height&populate[imageSEO][fields][15]=width&populate[imageSEO][fields][16]=url&populate[imageSEO][fields][17]=alternativeText&fields[18]=ethnicity&fields[19]=gender&fields[20]=pronouns`,
    ),
};
