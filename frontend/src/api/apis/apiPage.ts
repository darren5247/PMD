import { IStrapiPages } from "@src/types";
import api from "../config";

export interface IGetPageResponse {
  status: number;
  data: IStrapiPages;
}

export const pageApiGet = {
  get: (slug?: string) =>
    api.get<IGetPageResponse>(
      `/pages?pagination[page]=1&pagination[pageSize]=1&sort[0]=name:asc&populate[image][fields][0]=height&populate[image][fields][1]=width&populate[image][fields][2]=url&fields[0]=name&fields[1]=slug&fields[2]=descriptionSEO&fields[3]=content&fields[4]=hideName&fields[5]=widthFull&fields[6]=showBackBar&fields[7]=showBackBarShare&fields[8]=showBackBarFeedback&fields[9]=showLastUpdated&fields[10]=updatedAt&filters[slug][$eq]=${slug ? slug.toLowerCase() : ""}`,
    ),
};
