import { FC } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';

interface IPaginationItemProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    sort: string;
    sortOptions: Array<{ label: string; value: string }>;
};

export const PaginationItem: FC<IPaginationItemProps> = ({
    currentPage,
    totalPages,
    pageSize,
    sort,
    sortOptions
}): JSX.Element => {
    const router = useRouter();

    const changePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        pageSize = newSize;
        currentPage = 1; // Reset to first page when page size changes
        router.push({
            pathname: router.pathname,
            query: { ...router.query, pageSize: newSize, page: currentPage }
        });
    };

    const changeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = event.target.value;
        sort = newSort;
        currentPage = 1; // Reset to first page when page size changes
        router.push({
            pathname: router.pathname,
            query: { ...router.query, sort: newSort, page: currentPage }
        });
    };

    return (
        <div className='flex flex-col justify-center items-center gap-2 min-[1128px]:min-w-[753px] h-full text-center'>
            <div className='flex justify-center items-center gap-4 mt-6 mb-3'>
                <span className='min-[400px]:hidden mx-2'>{currentPage} of {totalPages}</span>
                <div className='flex max-[400px]:flex-col justify-center items-center gap-4'>
                    <a
                        href={
                            currentPage !== 1 ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: '1' }).toString()}`
                                : undefined
                        }
                        title='First Page'
                        className={cn(
                            currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        First
                    </a>
                    <a
                        href={
                            currentPage !== 1 ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: (currentPage - 1).toString() }).toString()}`
                                : undefined
                        }
                        title='Previous Page'
                        className={cn(
                            currentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Prev
                    </a>
                </div>
                <span className='max-[400px]:hidden mx-2'>{currentPage} of {totalPages}</span>
                <div className='flex max-[400px]:flex-col justify-center items-center gap-4'>
                    <a
                        href={
                            currentPage !== totalPages ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: (currentPage + 1).toString() }).toString()}`
                                : undefined
                        }
                        title='Next Page'
                        className={cn(
                            currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Next
                    </a>
                    <a
                        href={
                            currentPage !== totalPages ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: totalPages.toString() }).toString()}`
                                : undefined
                        }
                        title='Last Page'
                        className={cn(
                            currentPage === totalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Last
                    </a>
                </div>
            </div>
            <div className='flex flex-row flex-wrap justify-center items-center gap-4 text-center'>
                <select
                    onChange={changePageSize}
                    id='pageSize'
                    aria-label='Page Size'
                    value={pageSize}
                    className='bg-pmdGrayLight hover:bg-pmdGrayBright focus:bg-pmdGrayBright active:bg-pmdGrayBright px-2 py-1 border border-pmdGray rounded-md transition-all duration-150 cursor-pointer'
                >
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
                <select
                    onChange={changeSort}
                    id='sort'
                    aria-label='Sort'
                    value={sort}
                    className='bg-pmdGrayLight hover:bg-pmdGrayBright focus:bg-pmdGrayBright active:bg-pmdGrayBright py-1 pl-2 border border-pmdGray rounded-md transition-all duration-150 cursor-pointer'
                >
                    {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PaginationItem;
