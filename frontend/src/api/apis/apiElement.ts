import { IStrapiElement } from "@src/types";
import api from "../config";

export interface IGetMusicElementResponse {
  status: number;
  data: IStrapiElement;
}

export const apiElement = {
  get: (id?: string) =>
    api.get<IGetMusicElementResponse>(
      `/elements/${id ?? "0"}?populate[illustration][fields][0]=height&populate[illustration][fields][1]=width&populate[illustration][fields][2]=url&fields[0]=name&fields[1]=description&fields[2]=category&fields[3]=publishedAt`,
    ),
};
