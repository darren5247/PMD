import type { SearchParameters, SearchResults } from "algoliasearch-helper";
import { ExcludeRefinementListConnector } from "@src/types";

export const connectExcludeRefinement: ExcludeRefinementListConnector = (
  renderFn,
  unmountFn = () => {},
) => {
  return (widgetParams) => {
    const { attribute } = widgetParams;

    return {
      $$type: "pmd.excludeRefinementList",
      getWidgetRenderState({ results, helper }) {
        // When there are no results, return the API with default values.
        // It's helpful to render a default UI until results are available.
        if (!results) {
          return { items: [], refine: () => {}, widgetParams };
        }

        // Retrieve facet values from the results for the given attribute
        // and sort them by ascending name.
        // Later on, you could let users pass a `sortBy` parameter.
        const items = results.getFacetValues(attribute, {
          sortBy: ["name:asc"],
        }) as SearchResults.FacetValue[];

        return {
          items,
          // A function to toggle a value when selected.
          // If the value is already excluded, the exclusion is unset.
          // Otherwise, it's added to the exclusion list.
          // Then, a search is triggered.
          refine: (value) =>
            (helper.isExcluded(attribute, value)
              ? helper.removeFacetExclusion(attribute, value)
              : helper.addFacetExclusion(attribute, value)
            ).search(),
          // Build in clearRefinement method do not clear custom widget.
          clearAll: () => helper.clearRefinements().search(),
          widgetParams,
        };
      },
      getRenderState(renderState, renderOptions) {
        // The global render state is merged with a new one to store the render
        // state of the current widget.
        return {
          ...renderState,
          excludeRefinementList: {
            ...renderState.excludeRefinementList,
            // You can use multiple `excludeRefinementList` widgets in a single
            // app so you need to register each of them separately.
            // Each `excludeRefinementList` widget's render state is stored
            // by the `attribute` it impacts.
            [attribute]: this.getWidgetRenderState(renderOptions),
          },
        };
      },
      getWidgetUiState(uiState, { searchParameters }) {
        // The global UI state is merged with a new one to store the UI
        // state of the current widget.
        return {
          ...uiState,
          ...(searchParameters.getExcludeRefinements(attribute).length
            ? {
                excludeRefinementList: {
                  ...uiState.excludeRefinementList,
                  // You can use multiple `excludeRefinementList` widgets in a single
                  // app so you need to register each of them separately.
                  // Each `excludeRefinementList` widget's UI state is stored by
                  // the `attribute` it impacts.
                  [attribute]:
                    searchParameters.getExcludeRefinements(attribute),
                },
              }
            : {}),
        };
      },
      getWidgetSearchParameters(searchParameters, { uiState }) {
        const state = searchParameters.addFacet(attribute);
        const values =
          uiState.excludeRefinementList &&
          Object.prototype.hasOwnProperty.call(
            uiState.excludeRefinementList,
            attribute,
          )
            ? uiState.excludeRefinementList[attribute]
            : [];

        if (Array.isArray(values)) {
          return values.reduce<SearchParameters>(
            (acc, curr) => acc.addExcludeRefinement(attribute, curr),
            state,
          );
        }

        return state;
      },
      // The `init` step runs once when the app starts, before the first
      // search. It's useful to first render the UI with some default state.
      init(initOptions) {
        const { instantSearchInstance } = initOptions;

        renderFn(
          // The render state is the data provided to the render function,
          // necessary to build the UI.
          {
            ...this.getWidgetRenderState(initOptions),
            instantSearchInstance,
          },
          // Calling the function with `isFirstRender=true` lets you perform
          // conditional logic in the render function.
          true,
        );
      },
      // The `render` step runs whenever new results come back from Algolia.
      // It's useful to react to changes, for example, re-rendering the UI
      // with new information.
      render(renderOptions) {
        const { instantSearchInstance } = renderOptions;

        renderFn(
          // The render state is the data provided to the render function,
          // necessary to build the UI.
          {
            ...this.getWidgetRenderState(renderOptions),
            instantSearchInstance,
          },
          // Calling the function with `isFirstRender=false` lets you perform
          // conditional logic in the render function.
          false,
        );
      },
      // The `dispose` step runs when removing the widget. It's useful to
      // clean up anything that the widget created during its lifetime:
      // search parameter, UI, events, etc.
      dispose() {
        unmountFn();
      },
    };
  };
};
