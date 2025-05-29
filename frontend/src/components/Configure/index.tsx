import { SearchOptions } from "@algolia/client-search";
import {
  Configure as ConfigureAlgolia,
  ConfigureProps,
} from "react-instantsearch-hooks-web";

export const Configure = (props: ConfigureProps & SearchOptions) => (
  <ConfigureAlgolia {...props} />
);