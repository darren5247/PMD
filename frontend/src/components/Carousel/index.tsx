import { FC } from 'react';
import cn from 'classnames';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface ICarouselProps {
  children?: JSX.Element[] | JSX.Element;
  className?: string;
};

export const Carousel: FC<ICarouselProps> = ({
  children,
  className,
  ...props
}): JSX.Element => {
  return (
    <div className={cn('', className)}>
      <Slider {...props}>{children}</Slider>
    </div>
  );
};

export default Carousel;
