import {
  AdditionalWidgetProperties,
  useConnector
} from 'react-instantsearch-hooks-web';

import {
  ExcludeRefinementListWidgetDescription,
  ExcludeRefinementListConnectorParams
} from '@src/types';
import { connectExcludeRefinement } from '@src/utils';

export const useExcludeRefinement = (
  props: ExcludeRefinementListConnectorParams,
  additionalWidgetProperties: AdditionalWidgetProperties
) => {
  return useConnector<
    ExcludeRefinementListConnectorParams,
    ExcludeRefinementListWidgetDescription
  >(connectExcludeRefinement, props, additionalWidgetProperties);
};
