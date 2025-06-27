import { FC } from "react";
import cn from "classnames";
import { usePagination } from "react-instantsearch-hooks-web";
import { ReactSVG } from "react-svg";

import { IconDoubleSmallArrow, IconSmallArrow } from "@src/common/assets/icons";

const SearchPagination: FC = (): JSX.Element => {
  const { pages, currentRefinement, nbPages, isFirstPage, isLastPage, refine } =
    usePagination({
      // totalPages: 3,
      padding: 2,
    });

  const handleClickBack = () => {
    if (currentRefinement - 1 >= 0) {
      refine(currentRefinement - 1);
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleClickForward = () => {
    if (currentRefinement + 1 <= pages[pages.length - 1]) {
      refine(currentRefinement + 1);
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex flex-col items-center mt-[35px] mb-[42px]">
      <div className="flex sm:flex-row md:flex-row lg:flex-row flex-col justify-center items-center lg:items-left gap-y-6 mt-2 align-middle">
        <div className="flex flex-row justify-center items-center">
          <a
            title="First Page"
            className={cn("py-2 border-b border-white no-underline ", {
              "cursor-pointer hover:!border-b hover:!border-pmdRed":
                currentRefinement - 1 >= 0,
            })}
            onClick={() => {
              refine(0);
              window.scrollTo(0, 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                refine(0);
                window.scrollTo(0, 0);
              }
            }}
            tabIndex={0}
          >
            <ReactSVG
              src={IconDoubleSmallArrow.src}
              className={cn("mx-[15px] w-5 h-5 ", {
                activePaginationSvg: !isFirstPage,
                inactivePaginationSvg: isFirstPage,
              })}
            />
          </a>
          <a
            title="Previous Page"
            className={cn("py-2 border-b border-white no-underline ", {
              "cursor-pointer hover:!border-b hover:!border-pmdRed":
                currentRefinement - 1 >= 0,
            })}
            onClick={handleClickBack}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClickBack();
              }
            }}
            tabIndex={0}
          >
            <ReactSVG
              src={IconSmallArrow.src}
              className={cn("mx-[15px]", {
                activePaginationSvg: !isFirstPage,
                inactivePaginationSvg: isFirstPage,
              })}
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 10px");
              }}
            />
          </a>
        </div>
        <div className="flex flex-row justify-center items-center mx-[10px] py-2">
          {pages.map((page) => (
            <a
              key={page + 1}
              title={"Page " + (page + 1)}
              className={cn(
                "mx-[10px] px-2 cursor-pointer leading-[30px] border-b border-white hover:!border-b hover:!border-pmdRed text-pmdRed no-underline ",
                {
                  "!text-black": currentRefinement === page,
                },
              )}
              onClick={() => {
                refine(page);
                window.scrollTo(0, 0);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  refine(page);
                  window.scrollTo(0, 0);
                }
              }}
              tabIndex={0}
            >
              <strong>{page + 1}</strong>
            </a>
          ))}
        </div>
        <div className="flex flex-row justify-center items-center">
          <a
            title="Next Page"
            className={cn("py-2 border-b border-white no-underline ", {
              "cursor-pointer hover:!border-b hover:!border-pmdRed":
                currentRefinement + 1 <= pages[pages.length - 1],
            })}
            onClick={handleClickForward}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClickForward();
              }
            }}
            tabIndex={0}
          >
            <ReactSVG
              src={IconSmallArrow.src}
              className={cn("mx-[15px] rotate-180", {
                activePaginationSvg: !isLastPage,
                inactivePaginationSvg: isLastPage,
              })}
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 10px");
              }}
            />
          </a>
          <a
            title="Last Page"
            className={cn("py-2 border-b border-white no-underline ", {
              "cursor-pointer hover:!border-b hover:!border-pmdRed":
                currentRefinement + 1 <= pages[pages.length - 1],
            })}
            onClick={() => {
              refine(nbPages - 1);
              window.scrollTo(0, 0);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                refine(nbPages - 1);
                window.scrollTo(0, 0);
              }
            }}
            tabIndex={0}
          >
            <ReactSVG
              src={IconDoubleSmallArrow.src}
              className={cn("mx-[15px] rotate-180 w-5 h-5", {
                activePaginationSvg: !isLastPage,
                inactivePaginationSvg: isLastPage,
              })}
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default SearchPagination;
