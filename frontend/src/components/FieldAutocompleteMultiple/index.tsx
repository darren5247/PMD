import React, { forwardRef, useRef, useState } from "react";
import InputText from "../InputText";
import ImageNext from "../ImageNext";
import { IconSearch } from "@src/common/assets/icons";
import ChipRemovable from "../ChipRemovable";
import { useOnEventOutside } from "@src/common/hooks";

interface FieldAutocompleteMultipleProps {
  name: string;
  setValues: (values: string[]) => void;
  values: string[];
  suggestions: string[];
  control: any;
  placeholder: string;
  onFilter: (filtered: string[]) => void;
  error?: string;
}

const FieldAutocompleteMultiple = forwardRef<
  HTMLDivElement,
  FieldAutocompleteMultipleProps
>(({ ...props }) => {
  const {
    name,
    setValues,
    values,
    suggestions,
    control,
    placeholder,
    onFilter,
    error,
  } = props;
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([""]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLInputElement>(null);

  useOnEventOutside(wrapperRef, () => setIsShow(false), "mousedown");

  const options: string[] = [];
  if (suggestions && suggestions.length) {
    suggestions.sort((a: string, b: string) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
    options.push(...suggestions);
  }

  const handleChange = (e: Event) => {
    if (suggestions) {
      const eventValue = (e.target as HTMLInputElement).value;
      const newFilteredSuggestions = suggestions.filter(
        (suggestion: string) =>
          suggestion?.toLowerCase().indexOf(eventValue.toLowerCase()) > -1,
      );
      setInput(eventValue);
      if (newFilteredSuggestions.length > 0)
        setFiltered(newFilteredSuggestions);
      setActive(0);
      setIsShow(true);
    }
  };

  const onClick = (e: any) => {
    const findIndex = suggestions.indexOf(e.currentTarget.innerText);
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    setInput("");
    if (values) {
      setValues([...values, e.currentTarget.innerText]);
    } else {
      setValues([e.currentTarget.innerText as string]);
    }
    onFilter(suggestions.filter((el: string) => el !== filtered[findIndex]));
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // enter key
      const findIndex = suggestions.indexOf(filtered[active]);
      const newFilteredSuggestions = suggestions.filter(
        (el: string) => el !== filtered[active],
      );
      if (newFilteredSuggestions.length > 0) {
        setActive(0);
        setIsShow(false);
        setInput("");
        if (values) {
          setValues([...values, suggestions[findIndex !== -1 ? findIndex : 0]]);
        } else {
          setValues([filtered[0]]);
        }
        onFilter(
          newFilteredSuggestions.filter(
            (el: string) => el !== newFilteredSuggestions[0],
          ),
        );
      }
      if (suggestions.length) {
        suggestions.sort((a: string, b: string) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
      }
    } else if (e.keyCode === 38) {
      // up arrow
      listRef.current?.scrollBy(0, -32);
      return active === 0 ? null : setActive(active - 1);
    } else if (e.keyCode === 40) {
      // down arrow
      if (active + 1 === filtered.length) {
        listRef.current?.scrollTo(0, 0);
        return setActive(0);
      }
      listRef.current?.scrollBy(0, 32);
      return active + 1 === filtered.length ? null : setActive(active + 1);
    } else {
      listRef.current?.scrollTo(0, 0);
    }
  };

  const handleDeleteChip = (chip: string) => {
    setValues(values?.filter((el: string) => el !== chip) || null);
    onFilter([...suggestions, chip]);
    setIsShow(false);
  };

  const renderAutocomplete = () => {
    if (isShow) {
      if (filtered?.length) {
        return (
          <ul className="list-none">
            {filtered.map((suggestion, index) => {
              let autoClassName;
              if (index === active) {
                autoClassName = "!bg-pmdGrayLight";
              }
              return (
                <li
                  className={`${autoClassName} py-1.5 pl-2 px-3 w-full h-full cursor-pointer hover:bg-pmdGrayLight odd:bg-pmdGrayBright even:bg-white`}
                  key={suggestion}
                  onClick={onClick}
                >
                  <a
                    className="text-pmdGrayDark hover:text-pmdGrayDark no-underline"
                    title={suggestion}
                  >
                    {suggestion}
                  </a>
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <p className="px-3 py-1.5 pl-2 text-pmdGrayDark">No Results Found!</p>
        );
      }
    }
  };

  return (
    <div ref={wrapperRef}>
      <div
        className="relative"
        onFocus={() => {
          setIsShow(true);
          setFiltered(suggestions);
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (inputRef && inputRef.current) inputRef.current.focus();
            setIsShow(true);
            setFiltered(suggestions);
          }}
        >
          <ImageNext
            src={IconSearch}
            alt=""
            className="top-1/2 left-[15px] absolute w-4 h-4 -translate-y-1/2 cursor-text"
          />
        </button>
        <InputText
          ref={inputRef}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          control={control}
          value={input}
          placeholder={placeholder}
          name={name}
          error={error}
        />
      </div>
      {renderAutocomplete() && (
        <div
          ref={listRef}
          className={`absolute z-10 max-h-[200px] w-[328px] overflow-${
            filtered?.length > 5 && "scroll"
          } rounded-[5px] bg-white shadow-button`}
        >
          {renderAutocomplete()}
        </div>
      )}
      {values && (
        <div className="flex flex-wrap gap-2 mt-2 px-2">
          {values?.map((el: string, i: number) => (
            <ChipRemovable
              onClose={() => handleDeleteChip(el)}
              title={el}
              key={i}
            />
          ))}
        </div>
      )}
    </div>
  );
});
FieldAutocompleteMultiple.displayName = "FieldAutocompleteMultiple";

export default FieldAutocompleteMultiple;
