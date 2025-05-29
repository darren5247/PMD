import { ChangeEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import cn from 'classnames';
import { useSearchBox } from 'react-instantsearch-hooks-web';
import { IconCrossInCircle, IconSearch } from '@src/common/assets/icons';
import ImageNext from '@src/components/ImageNext';
import InputText from '@src/components/InputText';

interface IInstantSearchInputProps {
  className?: string;
};

const InstantSearchInput: FC<IInstantSearchInputProps> = ({
  className
}): JSX.Element => {
  const { query, refine, clear } = useSearchBox();

  const [queryString, setQueryString] = useState<string>(query);

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      window.scrollTo(0, 0);
      refine(e.currentTarget.value);
    };
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.value === "") {
      handleClear();
    } else {
      setQueryString(e.currentTarget.value);
    };
  };
  const handleClear = (): void => {
    clear();
    setQueryString('');
  };

  useEffect(() => {
    if (queryString) refine(queryString);
  }, [queryString, refine]);

  return (
    <div className={cn('relative w-full', className)}>
      <ImageNext
        src={IconSearch}
        alt=''
        className='top-[16px] left-[15px] absolute w-4 h-4 pointer-events-none'
      />
      <InputText
        value={queryString}
        placeholder='Search for piano music by element, level, mood, style, and more!'
        onKeyDown={handleEnter}
        onChange={handleChange}
      />
      {queryString && (
        <ImageNext
          className='top-[16px] right-[10px] absolute w-4 h-4 cursor-pointer'
          src={IconCrossInCircle}
          onClick={handleClear}
        />
      )}
    </div>
  );
};

export default InstantSearchInput;
