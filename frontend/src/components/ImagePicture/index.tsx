import { FC } from 'react';
import cn from 'classnames';

interface IImagePictureProps {
  src: string;
  alt?: string;
  sizes?: string;
  unoptimized?: boolean;
  priority?: boolean;
  loading?: 'eager' | 'lazy';
  lazyRoot?: HTMLElement | null;
  lazyBoundary?: string;
  className?: string;
  quality?: number;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  objectFit?: React.CSSProperties['objectFit'];
  objectPosition?: React.CSSProperties['objectPosition'];
  onLoadingComplete?: (img: HTMLImageElement) => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill';
}

const ImagePicture: FC<IImagePictureProps> = ({
  src,
  alt = '',
  sizes,
  loading = 'lazy',
  className,
  width,
  height,
  style,
  objectFit,
  objectPosition,
  onLoadingComplete,
  placeholder,
  blurDataURL,
  layout,
  ...props
}): JSX.Element => {
  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    if (onLoadingComplete) {
      onLoadingComplete(event.currentTarget);
    }
  };

  const isFillLayout = layout === 'fill';

  return (
    <picture
      className={cn(
        'flex items-center justify-center',
        className,
        { 'w-full h-full': isFillLayout }
      )}
    >
      {placeholder === 'blur' && blurDataURL && (
        <source srcSet={blurDataURL} />
      )}
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        loading={loading}
        width={layout === 'fixed' || layout === 'intrinsic' ? width : undefined}
        height={layout === 'fixed' || layout === 'intrinsic' ? height : undefined}
        style={{
          ...style,
          objectFit,
          objectPosition,
          ...(isFillLayout ? { width: '100%', height: '100%' } : {}),
        }}
        onLoad={handleLoad}
        {...props}
      />
    </picture>
  );
};

export default ImagePicture;
