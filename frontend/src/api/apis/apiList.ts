import { IStrapiList } from "@src/types";
import api from "../config";

export interface IGetMusicListResponse {
  status: number;
  data: IStrapiList[];
}

export const apiList = {
  get: (id?: string) =>
    api.get<IGetMusicListResponse>(
      `/lists?sort[0]=updatedAt:desc&populate[fields][0]=uid&populate[fields][1]=title&populate[fields][2]=description&populate[fields][3]=details&populate[users][fields][0]=name&populate[owners][fields][1]=name&populate[visibility][fields][2]=currentVisibility&filters[uid][$eq]=${id}`,
    ),
};
