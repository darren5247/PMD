import { FC, useEffect, useState } from "react";
import cn from "classnames";
import {
  useRefinementList,
  UseRefinementListProps,
} from "react-instantsearch-hooks-web";
// import { IconChevronUp } from '@src/common/assets/icons';
// import ImageNext from '@src/components/ImageNext';

interface IRefinementListProps extends UseRefinementListProps {
  type: "checkbox" | "radio";
  title: string;
  className?: string;
}

const transformItems: UseRefinementListProps["transformItems"] = (items) => {
  type hoistOptions = {
    [key: string]: number;
  };
  const hoist: hoistOptions = {
    Primary: 0,
    "Early Elementary": 1,
    "Late Elementary": 2,
    "Early Intermediate": 3,
    "Late Intermediate": 4,
    Advanced: 5,
    Master: 6,
  };
  if (
    items.length &&
    (items[0].label == "Primary" ||
      items[0].label == "Late Elementary" ||
      items[0].label == "Early Intermediate" ||
      items[0].label == "Late Intermediate" ||
      items[0].label == "Primary" ||
      items[0].label == "Advanced" ||
      items[0].label == "Early Elementary")
  )
    return items.sort((a, b) => hoist[a.label] - hoist[b.label]);
  else return items;
};

const RefinementList: FC<IRefinementListProps> = ({
  attribute,
  title,
  type,
  className,
}): JSX.Element => {
  const { canToggleShowMore, items, toggleShowMore, refine, isShowingMore } =
    useRefinementList({
      attribute,
      limit: 7,
      showMore: true,
      showMoreLimit: 1000,
      sortBy: ["isRefined", "name:asc"],
      transformItems,
    });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (items.length && !isCollapsed) setIsCollapsed(true);
    if (!items.length && isCollapsed) setIsCollapsed(false);
  }, [items, isCollapsed]);

  return (
    <div
      className={cn(
        "relative mx-2 mt-6 pb-6 flex flex-col border-b border-pmdGrayLight text-sm",
        className,
        {
          "lg:!pb-[15px]": !isCollapsed,
        },
        { "lg:!pb-[10px]": isShowingMore && isCollapsed },
      )}
    >
      {/* <a
        onClick={() => {
          if (items.length) setIsCollapsed(!isCollapsed)
        }}
        className={cn('absolute top-[2px] right-1 cursor-pointer', {
          'rotate-180': !isCollapsed
        })}
        title={(isCollapsed) ? 'Collapse ' + title : 'Expand ' + title}>
        <ImageNext
          src={IconChevronUp}
        />
      </a> */}
      <p className="relative w-fit font-extrabold">{title}</p>
      {isCollapsed && (
        <>
          <ul
            className={cn(
              "list-none scrollbar mt-3 max-h-[266px] flex flex-col gap-y-2",
              {
                "overflow-y-auto pb-1": isShowingMore,
              },
            )}
          >
            {items.map((item) => (
              <li key={item.label}>
                <a
                  className="flex flex-row gap-x-2 text-pmdGrayDark hover:text-pmdGray !no-underline align-middle"
                  title={item.label + " (" + item.count + ")"}
                >
                  <input
                    type={type}
                    name={"Select " + item.label + " (" + item.count + ")"}
                    checked={item.isRefined}
                    className={cn(
                      `h-[20px] w-[20px] min-h-[20px] min-w-[20px] appearance-none rounded-full border-[1.5px] border-solid border-pmdGray 
                    checked:border-[6px] checked:border-pmdRed checked:bg-white cursor-pointer`,
                      {
                        "relative !rounded checked:!border-0 checked:!bg-pmdRed checked:before:absolute checked:before:top-[3px] checked:before:left-[2px] checked:before:content-checkbox-chevron":
                          type === "checkbox",
                      },
                    )}
                    onChange={() => {
                      refine(item.value);
                    }}
                  />
                  <label
                    htmlFor={item.label}
                    className="mt-[2px] tracking-normal cursor-pointer"
                    onClick={() => {
                      refine(item.value);
                    }}
                  >
                    <span>{`${item.label} `}</span>
                  </label>
                </a>
              </li>
            ))}
          </ul>
          {canToggleShowMore && !isShowingMore && (
            <a
              className="mt-3 w-[65px] font-extrabold cursor-pointer"
              title={"View All " + title + "s"}
              onClick={toggleShowMore}
            >
              View All
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default RefinementList;
