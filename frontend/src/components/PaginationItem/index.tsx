import { FC, useEffect, useState } from 'react';
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

    const pageSizeClamped = Math.max(1, Math.min(Number(pageSize) || 10, 50));

    // Local state for props
    const [localCurrentPage, setLocalCurrentPage] = useState(currentPage);
    const [localTotalPages, setLocalTotalPages] = useState(totalPages);
    const [localPageSize, setLocalPageSize] = useState(pageSizeClamped);
    const [localSort, setLocalSort] = useState(sort);
    const [localSortOptions, setLocalSortOptions] = useState(sortOptions);

    useEffect(() => {
        setLocalCurrentPage(currentPage);
        setLocalTotalPages(totalPages);
        const pageSizeClamped = Math.max(1, Math.min(Number(pageSize) || 10, 50));
        setLocalPageSize(pageSizeClamped);
        setLocalSort(sort);
        setLocalSortOptions(sortOptions);
    }, [currentPage, totalPages, pageSize, sort, sortOptions]);

    const changePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(event.target.value);
        setLocalPageSize(newSize);
        setLocalCurrentPage(1); // Reset to first page when page size changes
        router.push({
            pathname: router.pathname,
            query: { ...router.query, pageSize: newSize, page: 1 }
        });
    };

    const changeSort = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSort = event.target.value;
        setLocalSort(newSort);
        setLocalCurrentPage(1); // Reset to first page when sort changes
        router.push({
            pathname: router.pathname,
            query: { ...router.query, sort: newSort, page: 1 }
        });
    };

    return (
        <div
            id='paginationItem'
            className={cn(
                'flex flex-col justify-center items-center gap-2 h-full text-center',
            )}
        >
            <div className='flex justify-center items-center gap-4 mt-6 mb-3'>
                <span className='min-[400px]:hidden mx-2'>{localCurrentPage} of {localTotalPages}</span>
                <div className='flex max-[400px]:flex-col justify-center items-center gap-4'>
                    <a
                        href={
                            localCurrentPage !== 1 ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: '1' }).toString()}`
                                : undefined
                        }
                        title='First Page'
                        className={cn(
                            localCurrentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        First
                    </a>
                    <a
                        href={
                            localCurrentPage !== 1 ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: (localCurrentPage - 1).toString() }).toString()}`
                                : undefined
                        }
                        title='Previous Page'
                        className={cn(
                            localCurrentPage === 1 ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Prev
                    </a>
                </div>
                <span className='max-[400px]:hidden mx-2'>{localCurrentPage} of {localTotalPages}</span>
                <div className='flex max-[400px]:flex-col justify-center items-center gap-4'>
                    <a
                        href={
                            localCurrentPage !== localTotalPages ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: (localCurrentPage + 1).toString() }).toString()}`
                                : undefined
                        }
                        title='Next Page'
                        className={cn(
                            localCurrentPage === localTotalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Next
                    </a>
                    <a
                        href={
                            localCurrentPage !== localTotalPages ?
                                `${router.pathname}?${new URLSearchParams({ ...router.query, page: localTotalPages.toString() }).toString()}`
                                : undefined
                        }
                        title='Last Page'
                        className={cn(
                            localCurrentPage === localTotalPages ? 'cursor-not-allowed pointer-events-none text-pmdGray no-underline' : 'cursor-pointer',
                            'bg-pmdGrayBright px-2 py-1 rounded-md',
                        )}
                    >
                        Last
                    </a>
                </div>
            </div>
            <div className='flex flex-row flex-wrap justify-center items-center gap-4 w-full text-center'>
                <select
                    onChange={changePageSize}
                    id='pageSize'
                    aria-label='Page Size'
                    value={localPageSize}
                    className='bg-pmdGrayLight hover:bg-pmdGrayBright focus:bg-pmdGrayBright active:bg-pmdGrayBright py-1 pr-1 pl-2 border border-pmdGray rounded-md transition-all duration-150 cursor-pointer'
                >
                    {![10, 20, 50].includes(localPageSize) && (
                        <option value={Math.max(1, Math.min(localPageSize, 50))}>
                            {`${Math.max(1, Math.min(localPageSize, 50))} per page`}
                        </option>
                    )}
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                    <option value={50}>50 per page</option>
                </select>
                <select
                    onChange={changeSort}
                    id='sort'
                    aria-label='Sort'
                    value={localSort}
                    className='bg-pmdGrayLight hover:bg-pmdGrayBright focus:bg-pmdGrayBright active:bg-pmdGrayBright py-1 pr-1 pl-2 border border-pmdGray rounded-md transition-all duration-150 cursor-pointer'
                >
                    {localSortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            Sort by {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default PaginationItem;
