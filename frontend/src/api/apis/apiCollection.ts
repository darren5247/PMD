import { IStrapiCollection } from "@src/types";
import api from "../config";

export interface IGetMusicCollectionResponse {
  status: number;
  data: IStrapiCollection;
}

export const apiCollection = {
  get: (id?: string) =>
    api.get<IGetMusicCollectionResponse>(
      `/collections/${id ?? "0"}?populate[publishers][fields][0]=name&populate[composers][fields][1]=name&populate[image][fields][8]=height&populate[image][fields][9]=width&populate[image][fields][10]=url&populate[image][fields][11]=alternativeText&populate[purchase_link][fields][12]=sellerName&populate[purchase_link][fields][13]=url&populate[purchase_link][fields][14]=linkText&populate[purchase_link][populate][sellerImage][fields][15]=height&populate[purchase_link][populate][sellerImage][fields][16]=width&populate[purchase_link][populate][sellerImage][fields][17]=url&populate[purchase_link][populate][sellerImage][fields][18]=alternativeText&fields[19]=title&fields[20]=published_date&fields[22]=composed_date&fields[23]=description&fields[24]=isbn_10&fields[25]=isbn_13&fields[26]=videoYouTube&fields[27]=urlSpotify&fields[28]=urlAppleMusic&fields[29]=urlWebsite&fields[30]=publishedAt&populate[imageSEO][fields][31]=height&populate[imageSEO][fields][32]=width&populate[imageSEO][fields][33]=url&populate[imageSEO][fields][34]=alternativeText&populate[image][fields][35]=height&populate[image][fields][36]=width&populate[image][fields][37]=url&populate[image][fields][38]=alternativeText`,
    ),
};
