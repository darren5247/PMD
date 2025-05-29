import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Page from '@src/components/Page';
import { EUrlsPages, CFilterKeys } from '@src/constants';
import SearchFiltersCurrentItem from '@src/components/SearchFiltersCurrentItem';
import SearchResultsItem from '@src/components/SearchResultsItem';
import { TUserAttributes } from '@src/types';
import Link from 'next/link';
import Chip from '@src/components/Chip';

interface IElementsPageProps {
  prevUrl?: string | undefined;
};

const ElementsPage: NextPage<IElementsPageProps> = ({ prevUrl }) => {
  const router = useRouter();
  const { query } = router;
  const [userId, setUserId] = useState<number | null>(null);
  const [pageTitleClean, setPageTitleClean] = useState<string | null>(null);
  const [pageDescClean, setPageDescClean] = useState<string | null>(null);
  const [isFiltering, setFiltering] = useState<boolean>(true);

  const [currentPage, setCurrentPage] = useState(Number(query.page) && Number(query.page) > 0 ? Number(query.page) : 1);
  const [pageSize, setPageSize] = useState(Number(query.pageSize) && Number(query.pageSize) > 1 ? Number(query.pageSize) : 10);

  const [textQuery, setTextQuery] = useState<string | null>(null);

  const [elementCategoryFilter, setElementCategoryFilter] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  useEffect(() => {
    // Check for all the OLD filters and replace them with the NEW versions if they exist
    const updatedQuery = { ...query };

    // Loop through the CFilterKeys and update the query object
    // Check if the old key exists in the query object and update it to the new key
    CFilterKeys.forEach(({ oldKey, prefix, newKey }) => {
      if (oldKey === 'query') {
        const oldTypesenseFilter = `${prefix}[${oldKey}]`;
        if (query[oldTypesenseFilter]) {
          updatedQuery[newKey] = query[oldTypesenseFilter];
          delete updatedQuery[oldTypesenseFilter];
        }
      } else {
        for (let i = 0; i <= 8; i++) {
          const oldTypesenseFilterWithNumbers = `${prefix}[${oldKey}][${i}]`;
          if (query[oldTypesenseFilterWithNumbers]) {
            updatedQuery[newKey] = query[oldTypesenseFilterWithNumbers];
            delete updatedQuery[oldTypesenseFilterWithNumbers];
          }
        }
      }
    });

    // Check if the updated query is different from the current query
    // If they are different, update the URL with the new query parameters
    if (JSON.stringify(updatedQuery) !== JSON.stringify(query)) {
      router.push(
        {
          pathname: router.pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [query, router]);

  useEffect(() => {
    const accountData: TUserAttributes = JSON.parse(localStorage.getItem('accountData') || '{}');
    if (accountData.id) {
      setUserId(accountData.id);
    };

    // Set Filters based on the query params on page load (if any)
    const setFilter = (queryKey: string, fallbackKey: string | null) => {
      const filterValue = query[queryKey] || fallbackKey;
      if (filterValue) {
        // Set the filter value based on the filter type
        switch (queryKey) {
          case 'q':
            setTextQuery(filterValue as string);
            break;
          case 'category':
            setElementCategoryFilter(filterValue as string);
            break;
          case 'level':
            setLevelFilter(filterValue as string);
            break;
          default:
            break;
        }
      }
    };

    // Check for the NEW filters - overwrites the old filters
    CFilterKeys.forEach((filterKey) => {
      setFilter(filterKey.newKey, query[filterKey.newKey] as string);
    });

    // Get/Set Page-Based Queries on Page Load
    const { page, pageSize, size, count } = query;
    // Set Page
    if (page) setCurrentPage(Number(page as string));
    // Set Page Size
    if (pageSize) setPageSize(Number(pageSize as string));
    if (size) setPageSize(Number(size as string));
    if (count) setPageSize(Number(count as string));
  }, [query, currentPage, pageSize, textQuery]);

  useEffect(() => {
    function pageTitle() {
      if (
        (textQuery && textQuery !== '') ||
        (elementCategoryFilter && elementCategoryFilter !== '') ||
        (levelFilter && levelFilter !== '')
      ) {
        const filtersArray = [
          textQuery && textQuery,
          elementCategoryFilter && (Array.isArray(elementCategoryFilter)
            ? `the ${elementCategoryFilter.join(' and ')} categories`
            : `the ${elementCategoryFilter} category`),
          levelFilter && (Array.isArray(levelFilter)
            ? `the ${levelFilter.join(' and ')} levels`
            : `the ${levelFilter} level`),
        ].filter(Boolean);

        const filters = filtersArray.length === 2
          ? filtersArray.join(' and ')
          : filtersArray.join(', ');

        setFiltering(true);

        setPageTitleClean(`Search for ${decodeURIComponent(filters)} on Piano Music Database`);
      } else {
        setFiltering(false);

        setPageTitleClean('Search Piano Music Database - Find the Perfect Piece');
      }
    };

    function pageDesc() {
      if (
        (textQuery && textQuery !== '') ||
        (elementCategoryFilter && elementCategoryFilter !== '') ||
        (levelFilter && levelFilter !== '')
      ) {
        const filtersArray = [
          textQuery && `${textQuery}`,
          elementCategoryFilter && (Array.isArray(elementCategoryFilter)
            ? `the ${elementCategoryFilter.join(' and ')} categories`
            : `the ${elementCategoryFilter} category`),
          levelFilter && (Array.isArray(levelFilter)
            ? `the ${levelFilter.join(' and ')} levels`
            : `the ${levelFilter} level`),
        ].filter(Boolean);

        const filters = filtersArray.length === 2
          ? filtersArray.join(' and ')
          : filtersArray.join(', ');

        setFiltering(true);

        setPageDescClean(`Search for ${decodeURIComponent(filters)} on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.`);
      } else {
        setFiltering(false);

        setPageDescClean('Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.');
      }
    };

    pageTitle()
    pageDesc();
  }, [textQuery, elementCategoryFilter, levelFilter]);

  function pageTitle() {
    if (
      (textQuery && textQuery !== '') ||
      (elementCategoryFilter && elementCategoryFilter !== '') ||
      (levelFilter && levelFilter !== '')
    ) {
      const filtersArray = [
        textQuery && textQuery,
        elementCategoryFilter && (Array.isArray(elementCategoryFilter)
          ? `the ${elementCategoryFilter.join(' and ')} categories`
          : `the ${elementCategoryFilter} category`),
        levelFilter && (Array.isArray(levelFilter)
          ? `the ${levelFilter.join(' and ')} levels`
          : `the ${levelFilter} level`),
      ].filter(Boolean);

      const filters = filtersArray.length === 2
        ? filtersArray.join(' and ')
        : filtersArray.join(', ');

      setFiltering(true);

      setPageTitleClean(`Search for ${decodeURIComponent(filters)} on Piano Music Database`);
    } else {
      setFiltering(false);

      setPageTitleClean('Search Piano Music Database - Find the Perfect Piece');
    }
  };

  function pageDesc() {
    if (
      (textQuery && textQuery !== '') ||
      (elementCategoryFilter && elementCategoryFilter !== '') ||
      (levelFilter && levelFilter !== '')
    ) {
      const filtersArray = [
        textQuery && `${textQuery}`,
        elementCategoryFilter && (Array.isArray(elementCategoryFilter)
          ? `the ${elementCategoryFilter.join(' and ')} categories`
          : `the ${elementCategoryFilter} category`),
        levelFilter && (Array.isArray(levelFilter)
          ? `the ${levelFilter.join(' and ')} levels`
          : `the ${levelFilter} level`),
      ].filter(Boolean);

      const filters = filtersArray.length === 2
        ? filtersArray.join(' and ')
        : filtersArray.join(', ');

      setFiltering(true);

      setPageDescClean(`Find Elements that have ${decodeURIComponent(filters)} on Piano Music Database. Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.`);
    } else {
      setFiltering(false);

      setPageDescClean('Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.');
    }
  };

  const checkFiltering = (filterName?: string) => {
    if (filterName && filterName !== '') {
      switch (filterName) {
        case 'q':
          setTextQuery(null);
          break;
        case 'category':
          setElementCategoryFilter(null);
          break;
        case 'level':
          setLevelFilter(null);
          break;
      }
      pageTitle();
      pageDesc();
    } else {
      // Reset all filters
      setTextQuery(null);
      setElementCategoryFilter(null);
      setLevelFilter(null);
      pageTitle();
      pageDesc();
    }
  };

  return (
    <Page
      showBackBar={true}
      showBackBarShare={true}
      showBackBarFeedback={true}
      prevUrl={prevUrl}
      url={EUrlsPages.ELEMENTS}
      title={pageTitleClean ? pageTitleClean : 'Elements of Piano - Piano Music Database'}
      description={pageDescClean ? pageDescClean : 'Elements are the fundamental pedagogical concepts and techniques contained in each piece of piano music in the database. Knowing the elements of a particular piece helps you understand how difficult the piece is to play and what a student needs to know in order to successfully play it.'}
      image=''
      className='!mx-0 !px-0 !max-w-full'
      classNameMain='!max-w-full !mx-0 !px-0'
    >
      <div className='flex flex-col justify-center items-center text-center'>
        <h1 className='mx-3'>Elements of Piano</h1>
        <p className='mx-3 mt-3 max-w-[778px] text-justify'>Elements are the fundamental pedagogical concepts and techniques contained in each piece of piano music in the database. Knowing the elements of a particular piece helps you understand how difficult the piece is to play and what a student needs to know in order to successfully play it.</p>
        {userId ? (
          <div
            id='search'
            className='flex min-[1250px]:flex-row flex-col justify-center items-stretch min-[1250px]:items-start gap-x-0 gap-y-6 mx-auto mt-6 w-full max-w-[1150px]'
          >
            <SearchFiltersCurrentItem itemType='elements' className='flex' onReset={(filterName?: string) => checkFiltering(filterName)} />
            <div id='searchResults' className='flex flex-col justify-center items-stretch gap-6'>
              <SearchResultsItem className='flex' itemType='elements' />
            </div>
          </div>
        ) : (
          <div
            id='search'
            className='flex min-[1250px]:flex-row flex-col justify-center items-stretch min-[1250px]:items-start gap-x-0 gap-y-6 mx-auto mt-6 w-full max-w-[1210px]'
          >
            <div id='locked' className='flex items-stretch mx-2 max-[1250px]:mx-auto w-full min-[1250px]:min-w-[332px] max-[1250px]:max-w-[1072px]'>
              <div
                id='warning'
                className='z-10 bg-[url("/lines2.svg")] bg-pmdGrayBright bg-opacity-80 bg-cover bg-no-repeat bg-bottom bg-local mx-3 p-2 border border-pmdGray rounded w-full h-max font-bold text-center'>
                <div className='flex flex-col justify-center items-center my-4'>
                  <h2 className='animate-text'>Unlock <br />All <br />Search <br />Filters</h2>
                  <p className='mt-8 mb-2 font-bold text-pmdGrayDark'>Filter by</p>
                  <div className='justify-center items-center gap-2 grid grid-cols-2 mb-8 align-middle'>
                    <Chip title='Level' className='bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium' />
                    <Chip title='Category' className='bg-gradient-to-b from-white to-pmdGrayLight shadow-md shadow-pmdRed border border-pmdRed font-medium' />
                  </div>
                  <h2 className='animate-text'>Free</h2>
                  <p className='font-medium text-pmdGray text-xs'>during <em>PMD Plus</em> Early Access</p>
                  <div className='flex flex-col justify-center items-center gap-y-4 mt-8 w-full'>
                    <Link href={`/${EUrlsPages.CREATE_ACCOUNT}`}>
                      <a
                        aria-label='Create Free Account'
                        title='Create Free Account'
                        className='flex gap-2 text-2xl button'
                      >Create Account</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div id='searchResults' className='flex flex-col justify-center items-stretch gap-6'>
              <SearchResultsItem className='flex' itemType='elements' />
            </div>
          </div>
        )}
      </div>
    </Page >
  );
};

export const getServerSideProps: GetServerSideProps<IElementsPageProps> = async (context) => {
  return {
    props: {
      prevUrl: context.req.headers.referer ?? ''
    }
  };
};

export default ElementsPage;
