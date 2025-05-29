import { FC } from 'react';
import Link from 'next/link';
import CardLevel from '@src/components/CardLevel';
import ContentDivider from '@src/components/ContentDivider';
import { IStrapiLevel } from '@src/types';
import { EUrlsPages } from '@src/constants';

interface IFeaturedLevelsProps {
  featuredLevels: IStrapiLevel[];
}

const FeaturedLevels: FC<IFeaturedLevelsProps> = ({ featuredLevels }): JSX.Element => {
  return (
    <>
      {featuredLevels ? (
        <div id='levels'>
          <ContentDivider title={'Featured Levels'} className='mx-auto mt-20 mb-4 md:max-w-[816px]' />
          <p className='mx-auto mt-3 md:max-w-[816px] text-center'>
            Every piece in the database is leveled based on the difficulty of its <Link href={`/${EUrlsPages.ELEMENTS}`}><a title='Learn more about our elements'>elements</a></Link>.
          </p>
          <p className='mx-auto mt-1 md:max-w-[816px] text-center'>
            <Link href={`/${EUrlsPages.LEVELS}`}><a title='Learn more about our leveling system'>Learn more about our leveling system</a></Link> or explore pieces from each level below.
          </p>
          <div className='flex flex-wrap justify-center gap-3 mx-auto mt-5 md:max-w-[636px] align-middle'>
            {Object.values(featuredLevels).map((featuredLevel) => (
              <CardLevel key={featuredLevel.id} id={featuredLevel.id} title={featuredLevel.attributes?.title} isSearchable={featuredLevel.attributes?.isSearchable} />
            ))}
          </div>
        </div>
      ) : ''}
    </>
  );
};

export default FeaturedLevels;
