import React, { FC, useEffect, useRef, useState } from 'react';
import InputText from '../InputText';
import ImageNext from '../ImageNext';
import ChipRemovable from '../ChipRemovable';
import { IconSearch } from '@src/common/assets/icons';
import { useOnEventOutside } from '@src/common/hooks';
import { IError } from '@src/types';

interface IFieldAutocompleteSingleProps {
  name: string;
  suggestions: string[] | null;
  setValue: (values: string) => void;
  value: string;
  placeholder?: string;
  error?: IError;
  hideChips?: boolean;
};

const FieldAutocompleteSingle: FC<IFieldAutocompleteSingleProps> = ({
  name,
  setValue,
  suggestions,
  value,
  placeholder,
  error,
  hideChips = false
}): JSX.Element => {
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState(['']);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLInputElement>(null);

  useOnEventOutside(wrapperRef, () => setIsShow(false), 'mousedown');

  useEffect(() => {
    setInput(value);
  }, [value]);

  const handleDeleteChip = () => {
    setFiltered(['']);
    setInput('');
    setValue('');
  };

  const handleChange = (e: any) => {
    if (suggestions) {
      const input = e.currentTarget.value;
      const newFilteredSuggestions = suggestions.filter(
        (suggestion: string) =>
          suggestion?.toLowerCase().indexOf(input.toLowerCase()) > -1,
      );
      if (newFilteredSuggestions.length > 0) setFiltered(newFilteredSuggestions);
      setInput(e.currentTarget.value);
      setIsShow(true);
      setActive(0);
    };
  };

  const onClick = (e: any) => {
    setInput(e.currentTarget.innerText);
    setValue(e.currentTarget.innerText);
    setActive(0);
    setFiltered(['']);
    setIsShow(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.keyCode === 13) {
      // enter key
      if (filtered[active]) {
        setInput(filtered[active]);
        setValue(filtered[active]);
        setActive(0);
        setFiltered([]);
        setIsShow(false);
      };
    } else if (e.keyCode === 38) {
      // up arrow
      listRef.current?.scrollBy(0, -24);
      return active === 0 ? null : setActive(active - 1);
    } else if (e.keyCode === 40) {
      // down arrow
      if (active + 1 === filtered.length) {
        listRef.current?.scrollTo(0, 0);
        return setActive(0);
      };
      listRef.current?.scrollBy(0, 24);
      return active + 1 === filtered.length ? null : setActive(active + 1);
    } else {
      listRef.current?.scrollTo(0, 0);
    };
  };

  const renderAutocomplete = () => {
    if (isShow) {
      if (filtered.length) {
        return (
          <ul className='w-full max-w-[273px] list-none'>
            {filtered.map((suggestion, index) => {
              let autoClassName;
              if (index === active) autoClassName = '!bg-pmdGrayLight';
              return (
                <li
                  className={`${autoClassName} py-1.5 pl-2 px-3 max-w-[273px] w-full h-full cursor-pointer hover:bg-pmdGrayLight odd:bg-pmdGrayBright even:bg-white`}
                  key={suggestion}
                  onClick={onClick}
                >
                  <a className='w-full max-w-[273px] text-pmdGrayDark hover:text-pmdGrayDark no-underline' title={suggestion}>{suggestion}</a>
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div>
            <em>Unavailable with current selections</em>
          </div>
        );
      }
    }
  };

  return (
    <div ref={wrapperRef}>
      <div
        className='relative'
        onFocus={() => {
          setIsShow(true);
          if (suggestions) setFiltered(suggestions);
        }}
      >
        <button
          onClick={() => {
            if (inputRef && inputRef.current) inputRef.current.focus();
            setIsShow(true);
            if (suggestions) setFiltered(suggestions);
          }}
        >
          <ImageNext
            src={IconSearch}
            alt=''
            className='top-1/2 left-[19px] absolute w-4 h-4 -translate-y-1/2 cursor-text'
          />
        </button>
        <InputText
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          value={input}
          placeholder={placeholder}
          name={name}
          error={error}
        />
      </div>
      {renderAutocomplete() && (
        <div
          ref={listRef}
          className={`absolute z-10 max-h-[200px] max-w-[273px] w-[328px] overflow-y-auto
            } rounded-[5px] bg-white shadow-button`}
        >
          {renderAutocomplete()}
        </div>
      )}
      {hideChips !== true && value && (
        <div className='flex flex-wrap gap-2 mt-2 px-2'>
          <ChipRemovable onClose={handleDeleteChip} title={value} />
        </div>
      )}
    </div>
  );
};

export default FieldAutocompleteSingle;
