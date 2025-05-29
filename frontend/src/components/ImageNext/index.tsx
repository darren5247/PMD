import { FC } from 'react';
import cn from 'classnames';
import { default as NextImage, ImageProps, StaticImageData } from 'next/image';

interface IImageNextProps extends ImageProps {
  src: string | StaticImageData;
  alt?: string | undefined;
  height?: number | undefined;
  width?: number | undefined;
  className?: string | undefined;
  fill?: string | undefined;
};

const ImageNext: FC<IImageNextProps> = ({
  src,
  alt,
  height,
  width,
  className,
  ...props
}): JSX.Element => {
  return (
    <span className={cn('flex items-center justify-center', className)}>
      <NextImage src={src} alt={alt} height={height} width={width} {...props} />
    </span>
  );
};

export default ImageNext;
