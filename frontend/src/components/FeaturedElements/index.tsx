import { FC, useState } from 'react';
import Link from 'next/link';
import Arrow from '@src/components/Arrow';
import CardElement from '@src/components/CardElement';
import Carousel from '@src/components/Carousel';
import ContentDivider from '@src/components/ContentDivider';
import { IStrapiElement } from '@src/types';
import { EUrlsPages } from '@src/constants';

interface IFeaturedElementsProps {
  featuredElements: IStrapiElement[];
}

const FeaturedElements: FC<IFeaturedElementsProps> = ({ featuredElements }): JSX.Element => {
  const [carouselIndexFeaturedElements, setCarouselIndexFeaturedElements] = useState(0);

  const dataLengthFeaturedElements = (featuredElements ? Object.values(featuredElements).length : 0);

  const carouselSettingsFeaturedElements = {
    infinite: false,
    speed: 100,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    afterChange: (value: number) => setCarouselIndexFeaturedElements(value),
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 4.6,
          slidesToScroll: 1,
          initialSlide: 4.6,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 4.6 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          initialSlide: 4,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 4 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 1276,
        settings: {
          slidesToShow: 3.4,
          slidesToScroll: 1,
          initialSlide: 3.4,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 3.4 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 1070,
        settings: {
          slidesToShow: 2.95,
          slidesToScroll: 1,
          initialSlide: 2.95,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 2.95 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 935,
        settings: {
          slidesToShow: 1.91,
          slidesToScroll: 1,
          initialSlide: 1.91,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 1.91 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.52,
          slidesToScroll: 1,
          initialSlide: 1.52,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 1.52 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1.36,
          slidesToScroll: 1,
          initialSlide: 1.36,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 1.36 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 455,
        settings: {
          slidesToShow: 1.12,
          slidesToScroll: 1,
          initialSlide: 1.12,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 1.12 >= dataLengthFeaturedElements}
            />
          )
        }
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1.01,
          slidesToScroll: 1,
          initialSlide: 1.01,
          prevArrow: (
            <Arrow side='left' type='elementCard' disabled={carouselIndexFeaturedElements === 0} />
          ),
          nextArrow: (
            <Arrow
              side='right'
              type='elementCard'
              disabled={carouselIndexFeaturedElements + 1.01 >= dataLengthFeaturedElements}
            />
          )
        }
      }
    ]
  };

  return (
    <>
      {featuredElements ? (
        <div id='elements'>
          <ContentDivider title={'Featured Elements'} className='mx-auto mt-20 mb-4 md:max-w-[816px]' />
          <p className='mx-auto mt-3 px-4 md:max-w-[816px] text-center'>
            Elements are the teaching concepts inside every piece. <br />They help you understand what skills are needed to play a particular piece.
          </p>
          <p className='mx-auto mt-1 px-4 md:max-w-[816px] text-center'>
            <Link href={`/${EUrlsPages.ELEMENTS}`}><a title='Learn more about our elements'>Learn more about our elements</a></Link> or explore the most interesting elements below.
          </p>
          <div id='elements' className='flex flex-row flex-wrap justify-center items-center mt-8 max-w-[1100px]'>
            {Object.values(featuredElements).map((featuredElement) => (
              <div key={`ElementItem-${featuredElement.id}`} className='mt-5 mb-4 px-1'>
                <CardElement
                  key={`ElementItem-${featuredElement.id}`}
                  name={featuredElement.attributes.name}
                  desc={featuredElement.attributes.description}
                  cat={featuredElement.attributes.category}
                  illustrationWidth={featuredElement.attributes.illustration.data?.attributes.width}
                  illustrationHeight={featuredElement.attributes.illustration.data?.attributes.height}
                  illustrationURL={featuredElement.attributes.illustration.data?.attributes.url}
                  id={featuredElement.id}
                  hideLabel={true}
                />
              </div>
            ))}
          </div>
        </div>
      ) : ''}
    </>
  );
};

export default FeaturedElements;
