import { FC } from "react";
import { ClearRefinements } from "react-instantsearch-hooks-web";
import { useExcludeRefinement } from "@src/common/hooks";
import RefinementList from "@src/components/RefinementList";
import Link from "next/link";
import RefinementListSearch from "@src/components/RefinementListSearch";
import ToggleRefinement from "@src/components/ToggleRefinement";
import SearchForm from "@src/components/SearchForm";
import { EUrlsPages } from "@src/constants";
import Chip from "@src/components/Chip";

const SearchFiltersDesktop: FC = (): JSX.Element => {
  const { clearAll } = useExcludeRefinement(
    { attribute: "exclude-elements" },
    { $$widgetType: "pmd.excludeRefinementList" },
  );
  return (
    <div id="locked" className="relative">
      <div
        id="warning"
        className='z-10 absolute inset-0 bg-[url("/lines2.svg")] bg-pmdGrayBright bg-opacity-40 bg-cover bg-no-repeat bg-bottom bg-local mb-4 ml-2 p-[20px] border border-pmdGray w-full min-w-[315px] max-w-[315px] font-bold text-center'
      >
        <div className="flex flex-col justify-center items-center mt-24">
          <h2 className="animate-text">
            Unlock <br />
            All <br />
            Search <br />
            Filters
          </h2>
          <p className="mt-8 mb-2 font-bold text-pmdGrayDark">Search by</p>
          <div className="justify-center items-center gap-2 grid grid-cols-2 mb-8 align-middle">
            <Chip
              title="Level"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Element"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Composer"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Era"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Mood"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Style"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="Theme"
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
            <Chip
              title="and more..."
              className="bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium"
            />
          </div>
          <h2 className="animate-text">Free</h2>
          <p className="font-medium text-pmdGray text-xs">
            during <em>PMD Plus</em> Early Access
          </p>
          <div className="flex flex-col justify-center items-center gap-y-4 mt-8 w-full">
            <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
              <a
                aria-label="Create Free Account"
                title="Create Free Account"
                className="flex gap-2 text-2xl button"
              >
                Create Account
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div
        id="filters"
        className="z-0 bg-pmdGrayBright blur-[2px] mb-4 ml-2 p-[20px] border-pmdGray border-r border-b border-l w-full min-w-[315px] max-w-[315px] pointer-events-none filter"
      >
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
    </div>
  );
};

export default SearchFiltersDesktop;
