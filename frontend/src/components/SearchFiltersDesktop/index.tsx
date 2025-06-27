import { FC } from "react";
import { ClearRefinements } from "react-instantsearch-hooks-web";
import { useExcludeRefinement } from "@src/common/hooks";
import RefinementList from "@src/components/RefinementList";
import RefinementListSearch from "@src/components/RefinementListSearch";
import ToggleRefinement from "@src/components/ToggleRefinement";
import SearchForm from "@src/components/SearchForm";

const SearchFiltersDesktop: FC = (): JSX.Element => {
  const { clearAll } = useExcludeRefinement(
    { attribute: "exclude-elements" },
    { $$widgetType: "pmd.excludeRefinementList" },
  );
  return (
    <div className="bg-pmdGrayBright mb-4 ml-2 p-[20px] border border-pmdGray w-full min-w-[315px] max-w-[315px]">
      <div className="flex flex-col justify-start items-start mx-0 align-middle">
        <span className="ml-2 font-extrabold text-sm">Search</span>
        <SearchForm className="!mx-0 mt-2 mb-2" />
      </div>
      <RefinementListSearch
        attribute="elements"
        title="Search by Element"
        placeholder="Pedagogical concepts"
        showExclude
      />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="composers"
        title="Search by Composer"
        placeholder="Composer name"
      />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="collections"
        title="Search by Collection"
        placeholder="Collection title"
      />
      <RefinementList
        attribute="level"
        title="Difficulty Level"
        type="checkbox"
      />

      <RefinementList attribute="era" title="Era" type="checkbox" />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="moods"
        title="Mood"
        placeholder="Mood"
      />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="styles"
        title="Style"
        placeholder="Style"
      />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="themes"
        title="Theme"
        placeholder="Theme"
      />
      <RefinementList attribute="holiday" title="Holiday" type="checkbox" />
      <RefinementList
        attribute="instrumentation"
        title="Instrumentation"
        type="checkbox"
      />
      <RefinementList
        attribute="student_ages"
        title="Student Age"
        type="checkbox"
      />
      <RefinementList
        attribute="student_types"
        title="Student Type"
        type="checkbox"
      />
      <RefinementList
        attribute="key_signatures"
        title="Key Signature"
        type="checkbox"
      />
      <RefinementList
        attribute="time_signatures"
        title="Time Signature"
        type="checkbox"
      />
      <RefinementListSearch
        className="mt-[10px]"
        attribute="publisher"
        title="Search by Publisher"
        placeholder="Publisher name"
      />
      <div className="relative flex flex-col gap-y-1 mx-2 mt-6 pb-6 border-pmdGray border-b text-sm">
        <span className="relative w-fit font-extrabold">Extras</span>
        <div className="flex flex-col">
          <ToggleRefinement
            attribute="has_teacher_duet"
            label="Has Teacher Duet"
            type="checkbox"
          />
          <ToggleRefinement
            attribute="has_lyrics"
            label="Has Lyrics"
            type="checkbox"
          />
        </div>
      </div>
      <a title="Reset All Filters">
        <ClearRefinements
          classNames={{
            root: "MyCustomClearRefinements",
            button: `button my-6 !py-2`,
            disabledButton: "opacity-30",
          }}
          translations={{
            resetButtonText: "Reset All Filters",
          }}
          onClickCapture={clearAll}
        />
      </a>
    </div>
  );
};

export default SearchFiltersDesktop;
