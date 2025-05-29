import { FC } from 'react';
import Link from 'next/link';
import ContentDivider from '@src/components/ContentDivider';
import { IStrapiMood, IStrapiStyle } from '@src/types';
import { EUrlsPages } from '@src/constants';

interface IPopularFiltersProps {
  popularMoods: IStrapiMood[];
  popularStyles: IStrapiStyle[];
};

export const PopularFilters: FC<IPopularFiltersProps> = ({ popularMoods, popularStyles }): JSX.Element => {
  return (
    <>
      {popularMoods && popularStyles ? (
        <div id='filters' className='flex flex-col items-center'>
          <ContentDivider title={'Popular Filters'} className='mx-auto mt-20 mb-4 md:max-w-[816px]' />
          <p className='mx-auto mt-3 mb-4 px-4 md:max-w-[816px] text-center'>
            These commonly used filters can help you find music that matches your tastes.
          </p>
          <h4 className='mt-2'>Moods</h4>
          <div className='flex flex-col justify-center items-center gap-4 p-4 w-full max-w-[600px]'>
            <div className='flex flex-row flex-wrap justify-center items-center gap-4 w-full'>
              {Object.values(popularMoods).map((mood) => (
                <Link key={mood.id} href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][moods][0]=${encodeURI(mood.attributes.title)}`}>
                  <a
                    title={mood.attributes.title}
                    key={mood.id}
                    className='!px-0 min-w-[130px] sm:min-w-[176px] max-[360px]:min-w-[100px] text-center button'
                  ><p>{mood.attributes.title}</p></a></Link>
              ))}
            </div>
            <p className='mx-auto px-4 w-full md:max-w-[816px] text-right'>
              <Link href={`/${EUrlsPages.SEARCH}`}><a title='Search with more styles'><em>and more...</em></a></Link>
            </p>
            <h4 className='mt-6'>Styles</h4>
            <div className='flex flex-row flex-wrap justify-center items-center gap-4 w-full'>
              {Object.values(popularStyles).map((style) => (
                <Link key={style.id} href={`/${EUrlsPages.SEARCH}?musicWorks[refinementList][styles][0]=${encodeURI(style.attributes.title)}`}>
                  <a
                    title={style.attributes.title}
                    key={style.id}
                    className='!px-0 min-w-[130px] sm:min-w-[176px] max-[360px]:min-w-[100px] text-center button'
                  ><p>{style.attributes.title}</p></a></Link>
              ))}
            </div>
            <p className='mx-auto mb-4 px-4 w-full md:max-w-[816px] text-right'>
              <Link href={`/${EUrlsPages.SEARCH}`}><a title='Search with more styles'><em>and more...</em></a></Link>
            </p>
          </div>
        </div>
      ) : ''}
    </>
  );
};

export default PopularFilters;
