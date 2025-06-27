import { FC, useState } from "react";
import { IStrapiElement } from "@src/types";
import Arrow from "@src/components/Arrow";
import ContentDivider from "@src/components/ContentDivider";
import CardElement from "@src/components/CardElement";
import Carousel from "@src/components/Carousel";

interface IWorkElementsProps {
  elements: IStrapiElement[];
  published: boolean;
}

const WorkElements: FC<IWorkElementsProps> = ({
  elements,
  published,
}): JSX.Element => {
  const [carouselIndexWorkElements, setCarouselIndexWorkElements] = useState(0);

  const dataLengthWorkElements = elements.length
    ? Object.values(elements).length
    : 0;

  const filteredElements = elements
    .sort((a, b) => {
      if (a.attributes.name < b.attributes.name) return -1;
      if (a.attributes.name > b.attributes.name) return 1;
      return 0;
    })
    .filter((element) =>
      published ? element.attributes.publishedAt !== null : true,
    );

  const carouselSettingsWorkElements = {
    infinite: false,
    speed: 100,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    afterChange: (value: number) => setCarouselIndexWorkElements(value),
    responsive: [
      {
        breakpoint: 10000,
        settings: {
          slidesToShow: 4.6,
          slidesToScroll: 1,
          initialSlide: 4.6,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 4.6 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 1310,
        settings: {
          slidesToShow: 3.7,
          slidesToScroll: 1,
          initialSlide: 3.7,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 3.7 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 1175,
        settings: {
          slidesToShow: 3.4,
          slidesToScroll: 1,
          initialSlide: 3.4,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 3.4 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 1070,
        settings: {
          slidesToShow: 2.95,
          slidesToScroll: 1,
          initialSlide: 2.95,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 2.95 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 935,
        settings: {
          slidesToShow: 1.91,
          slidesToScroll: 1,
          initialSlide: 1.91,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 1.91 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.52,
          slidesToScroll: 1,
          initialSlide: 1.52,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 1.52 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 510,
        settings: {
          slidesToShow: 1.36,
          slidesToScroll: 1,
          initialSlide: 1.36,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 1.36 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 455,
        settings: {
          slidesToShow: 1.12,
          slidesToScroll: 1,
          initialSlide: 1.12,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 1.12 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
      {
        breakpoint: 390,
        settings: {
          slidesToShow: 1.01,
          slidesToScroll: 1,
          initialSlide: 1.01,
          prevArrow: (
            <Arrow
              side="left"
              type="elementCard"
              disabled={carouselIndexWorkElements === 0}
            />
          ),
          nextArrow: (
            <Arrow
              side="right"
              type="elementCard"
              disabled={
                carouselIndexWorkElements + 1.01 >= dataLengthWorkElements
              }
            />
          ),
        },
      },
    ],
  };

  return (
    <div className="w-full">
      <ContentDivider
        title={"Elements"}
        className="mx-auto my-4 md:max-w-[816px]"
      />
      <section id="elements" className="mx-auto">
        <Carousel
          {...carouselSettingsWorkElements}
          className="mx-auto mb-14 max-sm:px-3 w-[calc(76vw+20px)] xl:w-[1210px]"
        >
          {Object.values(filteredElements).map((element) => (
            <div key={`ElementItem-${element.id}`} className="mt-5 mb-4 px-1">
              <CardElement
                key={`ElementItem-${element.id}`}
                name={element.attributes.name}
                desc={element.attributes.description}
                cat={element.attributes.category}
                illustrationWidth={
                  element.attributes.illustration.data?.attributes.width
                }
                illustrationHeight={
                  element.attributes.illustration.data?.attributes.height
                }
                illustrationURL={
                  element.attributes.illustration.data?.attributes.url
                }
                id={element.id}
                hideLabel={true}
              />
            </div>
          ))}
        </Carousel>
      </section>
    </div>
  );
};

export default WorkElements;
