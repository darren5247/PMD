import { FC, useState } from "react";
import cn from "classnames";
import { CurrentRefinementsConnectorParamsRefinement } from "instantsearch.js/es/connectors/current-refinements/connectCurrentRefinements";
import {
  useCurrentRefinements,
  useSearchBox,
  ClearRefinements,
} from "react-instantsearch-hooks-web";
import { IconCrossInCircle } from "@src/common/assets/icons";
import ImageNext from "@src/components/ImageNext";
import { useExcludeRefinement } from "@src/common/hooks";

const SearchFiltersCurrent: FC = (): JSX.Element => {
  const { items, refine } = useCurrentRefinements();
  const { query, clear } = useSearchBox();
  const [queryString, setQueryString] = useState<string>(query);

  const checkException = (
    refinement: CurrentRefinementsConnectorParamsRefinement,
  ) => {
    return refinement.type === "exclude" ? (
      `Exclude: ${refinement.label}`
    ) : refinement.attribute === "has_lyrics" ? (
      <span className="bg-pmdGrayLight mr-0 py-[7px] pr-[0px] pl-[9px] align-middle"></span>
    ) : refinement.attribute === "has_teacher_duet" ? (
      <span className="bg-pmdGrayLight mr-0 py-[7px] pr-[0px] pl-[9px] align-middle"></span>
    ) : (
      <span className="bg-pmdGrayLight mr-[7px] py-[7px] pr-[0px] pl-[9px] align-middle">
        {refinement.label}
      </span>
    );
  };

  const handleClear = (): void => {
    refine;
    clear();
    setQueryString("");
  };

  const { clearAll } = useExcludeRefinement(
    { attribute: "exclude-elements" },
    { $$widgetType: "pmd.excludeRefinementList" },
  );

  function getAttributeImproved(refinement: any) {
    const filterAttribute = refinement.attribute;
    const filterAttributeImprovedUnderscore = filterAttribute.replace(
      /_/g,
      " ",
    );
    const filterAttributeImprovedElement =
      filterAttributeImprovedUnderscore.replace(/name/g, "composer");
    const filterAttributeImprovedComposer =
      filterAttributeImprovedElement.replace(/elements/g, "element");
    const filterAttributeImprovedCollection =
      filterAttributeImprovedComposer.replace(/collections/g, "collection");
    const filterAttributeImprovedMood =
      filterAttributeImprovedCollection.replace(/moods/g, "mood");
    const filterAttributeImprovedStyle = filterAttributeImprovedMood.replace(
      /styles/g,
      "style",
    );
    const filterAttributeImprovedTheme = filterAttributeImprovedStyle.replace(
      /themes/g,
      "theme",
    );
    const filterAttributeImprovedAge = filterAttributeImprovedTheme.replace(
      /ages/g,
      "age",
    );
    const filterAttributeImprovedTypes = filterAttributeImprovedAge.replace(
      /types/g,
      "type",
    );
    const filterAttributeImprovedSignature =
      filterAttributeImprovedTypes.replace(/signatures/g, "signature");
    const filterAttributeImproved = filterAttributeImprovedSignature.replace(
      /has /g,
      "",
    );
    return filterAttributeImproved;
  }

  function getValueImproved(refinement: any) {
    const filterValue = refinement.value + " " + refinement.attribute;
    const filterValueImprovedSpaceDouble = filterValue.replace(/ {2}/g, "");
    const filterValueImprovedUnderscore =
      filterValueImprovedSpaceDouble.replace(/_/g, " ");
    const filterValueImprovedElement = filterValueImprovedUnderscore.replace(
      /name/g,
      "Composer",
    );
    const filterValueImprovedComposer = filterValueImprovedElement.replace(
      /elements/g,
      "Element",
    );
    const filterValueImprovedCollection = filterValueImprovedComposer.replace(
      /collections/g,
      "Collection",
    );
    const filterValueImprovedLevel = filterValueImprovedCollection.replace(
      /level/g,
      "Level",
    );
    const filterValueImprovedEra = filterValueImprovedLevel.replace(
      /era/g,
      "Era",
    );
    const filterValueImprovedMood = filterValueImprovedEra.replace(
      /moods/g,
      "Mood",
    );
    const filterValueImprovedStyle = filterValueImprovedMood.replace(
      /styles/g,
      "Style",
    );
    const filterValueImprovedTheme = filterValueImprovedStyle.replace(
      /themes/g,
      "Theme",
    );
    const filterValueImprovedHoliday = filterValueImprovedTheme.replace(
      /holiday/g,
      "Holiday",
    );
    const filterValueImprovedAge = filterValueImprovedHoliday.replace(
      /student ages/g,
      "Student Age",
    );
    const filterValueImprovedTypes = filterValueImprovedAge.replace(
      /student types/g,
      "Student Type",
    );
    const filterValueImprovedSignatureKey = filterValueImprovedTypes.replace(
      /key signatures/g,
      "Key Signature",
    );
    const filterValueImprovedSignatureTime =
      filterValueImprovedSignatureKey.replace(
        /time signatures/g,
        "Time Signature",
      );
    const filterValueImprovedPublisher =
      filterValueImprovedSignatureTime.replace(/publisher/g, "Publisher");
    const filterValueImprovedHas = filterValueImprovedPublisher.replace(
      /has /g,
      "",
    );
    const filterValueImprovedDuet = filterValueImprovedHas.replace(
      /teacher duet/g,
      "Teacher Duet",
    );
    const filterValueImprovedLyrics = filterValueImprovedDuet.replace(
      /lyrics/g,
      "Lyrics",
    );
    const filterValueImproved = filterValueImprovedLyrics.replace(/true /g, "");
    return filterValueImproved;
  }

  return (
    <ul className="flex flex-col gap-2 mx-auto lg:mt-1 px-4 py-4 lg:pt-0 lg:pb-4 border-r border-l lg:border-none w-full w-min overflow-x-auto text-sm text-left list-none scrollbar">
      <span className="whitespace-nowrap">
        <em>Selected Filters:</em>
      </span>
      <div className="flex flex-row">
        {queryString.length ? (
          <li
            key={`${query}`}
            className={cn(
              `ml-[20px] flex align-middle whitespace-nowrap rounded shadow-activeFilter 
            first:ml-0 last:mr-2 lg:ml-[9px] lg:first:ml-[9px] lg:last:mr-2`,
            )}
          >
            <span className="bg-pmdGray px-[7px] py-[7px] rounded-tl rounded-bl text-white align-middle">
              <strong>Search</strong>
            </span>
            <span className="bg-pmdGrayLight px-[9px] py-[7px] align-middle">
              {query}
            </span>
            <a
              className="bg-pmdGrayLight py-[9px] pr-[10px] pl-[2px] rounded-tr rounded-br cursor-pointer"
              title={"Remove Search: " + query}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClear();
                }
              }}
              tabIndex={0}
            >
              <ImageNext className="min-w-[14px]" src={IconCrossInCircle} />
            </a>
          </li>
        ) : null}
        {items.map((item) => {
          return item.refinements.map((refinement) => (
            <li
              key={`${refinement.attribute}${refinement.type}${refinement.value}`}
              className={cn(
                `ml-[20px] flex align-middle whitespace-nowrap rounded bg-pmdGrayLight shadow-activeFilter 
                first:ml-0 last:mr-[2px] lg:ml-[9px] lg:first:ml-[9px] lg:last:mr-[9px]`,
                {
                  "bg-pmdGrayDark text-white":
                    refinement.attribute === "exclude-elements",
                },
              )}
            >
              <span className="bg-pmdGray px-[7px] py-[7px] rounded-tl rounded-bl text-white capitalize align-middle">
                <strong>{getAttributeImproved(refinement)}</strong>
              </span>
              {checkException(refinement)}
              <a
                className="bg-pmdGrayLight py-[9px] pr-[10px] pl-[2px] rounded-tr rounded-br cursor-pointer"
                title={"Remove Filter: " + getValueImproved(refinement)}
                onClick={() => {
                  refine(refinement);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    refine(refinement);
                  }
                }}
                tabIndex={0}
              >
                <ImageNext className="min-w-[14px]" src={IconCrossInCircle} />
              </a>
            </li>
          ));
        })}
      </div>
      {items.length ? (
        <div className="flex justify-center items-center mb-1 align-middle">
          <a
            title="Reset All Filters"
            className="mx-auto mt-4 !py-1 !pr-4 w-full text-left cursor-pointer"
          >
            <ClearRefinements
              classNames={{
                button: `whitespace-nowrap `,
              }}
              translations={{
                resetButtonText: "Reset All Filters",
              }}
              onClickCapture={clearAll}
            />
          </a>
        </div>
      ) : null}
    </ul>
  );
};

export default SearchFiltersCurrent;
