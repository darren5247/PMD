import React, { forwardRef, useEffect, useState } from "react";
import Checkbox from "../Checkbox";
import ChipRemovable from "../ChipRemovable";

const FieldSelectMultiple = forwardRef<HTMLDivElement, any>(
  ({ hideViewAll = false, ...props }) => {
    const { setValues, values, suggestions, withoutChips } = props;
    const [isViewAll, setIsViewAll] = useState(false);

    const handleChange = (el: string) => {
      if (!values) return setValues([el]);
      if (values?.includes(el)) {
        setValues(values?.filter((elem: string) => elem !== el));
      } else {
        setValues([...values, el]);
      }
    };

    useEffect(() => {
      hideViewAll && setIsViewAll(() => true);

      const valuesCollection = [];
      if (
        values &&
        values.length > 0 &&
        suggestions &&
        suggestions.length > 0
      ) {
        for (let i = 0; i <= values.length; i++) {
          const index = suggestions.indexOf(values[i]);
          valuesCollection.push(index);
        }
        const max = valuesCollection.reduce(
          (a, b) => Math.max(a, b),
          -Infinity,
        );
        if (max >= 7) {
          setIsViewAll(() => true);
        }
      }
    }, [values, suggestions, hideViewAll]);

    return (
      <div>
        <div
          className={`flex flex-col gap-2 overflow-hidden ${isViewAll ? "max-h-[100%]" : "max-h-[175px]"}`}
        >
          {suggestions &&
            suggestions?.map((el: string, i: number) => (
              <Checkbox
                key={i}
                checkboxLabel={el}
                checked={values?.includes(el)}
                onClick={() => handleChange(el)}
                onChange={() => handleChange(el)}
              />
            ))}
        </div>
        {!isViewAll && suggestions?.length > 7 && (
          <a
            className="inline w-fit font-extrabold text-sm leading-[17px] tracking-[0.2px] cursor-pointer"
            onClick={() => setIsViewAll(true)}
            title="View All"
          >
            View All
          </a>
        )}
        {values && !withoutChips && (
          <div className="flex flex-wrap gap-2 mt-[15px]">
            {values.map((value: string) => (
              <ChipRemovable
                key={value}
                onClose={() => handleChange(value)}
                title={value}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
);
FieldSelectMultiple.displayName = "FieldSelectMultiple";

export default FieldSelectMultiple;
