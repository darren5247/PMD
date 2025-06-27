import type { SearchResults } from "algoliasearch-helper";
import type { Renderer, Connector, WidgetFactory } from "instantsearch.js";
import { IndexUiState, UiState } from "instantsearch.js";

export interface ITypesensePiece {
  id: string;
  name: string;
  composers: string[];
  publisher: string[];
  title: string;
  level: string;
  elements: string[];
  era: string;
  holiday: string;
  styles: string[];
  moods: string[];
  themes: string;
  student_ages: string[];
  student_types: string[];
  key_signatures: string;
  time_signatures: string[];
  has_lyrics: boolean;
  has_teacher_duet: boolean;
  collections?: string[];
}

/*
 * Parameters send only to the widget creator function
 * These parameters will be used by the widget creator to create the widget renderer and factory
 */
export type ExcludeRefinementListWidgetParams = {
  container: string | Element;
};

/*
 * Parameters send to the widget creator function
 * These parameters will be used by the widget creator to manage the widget logic
 */
export type ExcludeRefinementListConnectorParams = {
  attribute: string;
};

export type ExcludeRefinementListRenderState = {
  items: SearchResults.FacetValue[];
  refine: (value: string) => void;
  clearAll?: () => void;
};

export type ExcludeRefinementListWidgetDescription = {
  $$type: "pmd.excludeRefinementList";
  renderState: ExcludeRefinementListRenderState;
  indexRenderState: {
    excludeRefinementList: {
      [attribute: string]: ExcludeRefinementListRenderState;
    };
  };
  indexUiState: {
    excludeRefinementList: {
      [attribute: string]: string[];
    };
  };
};

/*
 * Connector type, constructed from the Renderer and Connector parameters
 */
export type ExcludeRefinementListConnector = Connector<
  ExcludeRefinementListWidgetDescription,
  ExcludeRefinementListConnectorParams
>;

/*
 * Renderer type, constructed from the Renderer and Connector parameters
 */
export type ExcludeRefinementListRendererCreator = (
  widgetParams: ExcludeRefinementListWidgetParams,
) => {
  render: Renderer<
    ExcludeRefinementListWidgetDescription["renderState"],
    ExcludeRefinementListConnectorParams
  >;
  dispose: () => void;
};

/*
 * Widget type, constructed from the Renderer, Connector and Widget parameters
 */
export type ExcludeRefinementListWidgetCreator = WidgetFactory<
  ExcludeRefinementListWidgetDescription & {
    $$widgetType: "pmd.excludeRefinementList";
  },
  ExcludeRefinementListConnectorParams,
  ExcludeRefinementListWidgetParams
>;

// export type NegativeSendEvent = (
//   eventType: string,
//   facetValue: string,
//   eventName?: string,
// ) => void

export interface musicUIState extends IndexUiState {
  refinementList?: {
    [attribute: string]: string[];
  };
  excludeRefinementList?: {
    [attribute: string]: string[];
  };
}

export interface instantSearchUIState extends UiState {
  musicWorks: musicUIState;
}
