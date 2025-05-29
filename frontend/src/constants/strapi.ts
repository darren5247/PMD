import { EUrlsPages } from '@src/constants';

export const CElementCategories = [
    'Accompaniment Patterns',
    'Chords',
    'Expression',
    'Extended Techniques',
    'Hand and Finger Techniques',
    'Improvisation',
    'Intervals',
    'Meter',
    'Notes and Notation',
    'Rhythm',
    'Scales and Hand Positions',
    'Texture'
];

export const CLevels = [
    'Primary',
    'Early Elementary',
    'Late Elementary',
    'Early Intermediate',
    'Late Intermediate',
    'Advanced',
    'Master'
];

export const CInstrumentations = [
    'Solo Piano',
    'Four Hands',
    'Two Pianos',
    'Piano Ensemble',
    'Piano and Cello'
];

export const CInstrumentationsSearch = [
    'Solo Piano',
    'Four Hands',
    // 'Two Pianos',
    // 'Piano Ensemble',
    'Piano and Cello'
];

export const CEras = [
    'Modern',
    'Twentieth Century',
    'Late Romantic',
    'Romantic',
    'Classical',
    'Baroque',
    'Renaissance',
    'Medieval',
];

export const CErasSearch = [
    'Modern',
    'Twentieth Century',
    'Late Romantic',
    'Romantic',
    'Classical',
    'Baroque',
    'Renaissance',
    'Medieval'
];

export const CHolidays = [
    'Christmas',
    'Easter',
    'Fourth of July',
    'Halloween'
];

export const CHolidaysSearch = [
    'Christmas',
    'Easter',
    // 'Fourth of July',
    'Halloween'
];

export const CStudentAges = [
    'Adults',
    'Children',
    'Teens'
];

export const CStudentTypes = [
    'Ambitious Students',
    'Average Students',
    'Students About to Quit',
    'Unmotivated Students'
];

export const CKeySignatures = [
    'A Major',
    'A Minor',
    'A-flat Major',
    'B Major',
    'B Minor',
    'B-flat Major',
    'B-flat Minor',
    'C Major',
    'C Minor',
    'C-sharp Major',
    'C-sharp Minor',
    'D Major',
    'D Minor',
    'D-flat Major',
    'E Major',
    'E Minor',
    'E-flat Major',
    'E-flat Minor',
    'F Major',
    'F Minor',
    'F-sharp Major',
    'F-sharp Minor',
    'G Major',
    'G Minor',
    'G-flat Major',
    'Modal',
    'None'
];

export const CTimeSignatures = [
    '12/8',
    '2/2',
    '2/4',
    '3/4',
    '3/8',
    '4/4',
    '4/8',
    '5/4',
    '5/8',
    '6/4',
    '6/8',
    '7/8',
    '9/4',
    '9/8',
    'Additive Meter',
    'Common Time',
    'Cut Time',
    'None'
];

export const CDirtyInstrumentations = [
    {
        id: 1,
        attributes: {
            name: 'Solo Piano'
        }
    },
    {
        id: 2,
        attributes: {
            name: 'Four Hands'
        }
    },
    {
        id: 4,
        attributes: {
            name: 'Two Pianos'
        }
    },
    {
        id: 5,
        attributes: {
            name: 'Piano Ensemble'
        }
    },
    {
        id: 3,
        attributes: {
            name: 'Piano and Cello'
        }
    }
];

export const CDirtyEras = [
    {
        id: 4,
        attributes: {
            name: 'Modern'
        }
    },
    {
        id: 3,
        attributes: {
            name: 'Twentieth Century'
        }
    },
    {
        id: 8,
        attributes: {
            name: 'Late Romantic'
        }
    },
    {
        id: 5,
        attributes: {
            name: 'Romantic'
        }
    },
    {
        id: 2,
        attributes: {
            name: 'Classical'
        }
    },
    {
        id: 1,
        attributes: {
            name: 'Baroque'
        }
    },
    {
        id: 7,
        attributes: {
            name: 'Renaissance'
        }
    },
    {
        id: 6,
        attributes: {
            name: 'Medieval'
        }
    },
];

export const CDirtyLevels = [
    {
        id: 1,
        attributes: {
            title: 'Primary'
        }
    },
    {
        id: 2,
        attributes: {
            title: 'Early Elementary'
        }
    },
    {
        id: 3,
        attributes: {
            title: 'Late Elementary'
        }
    },
    {
        id: 4,
        attributes: {
            title: 'Early Intermediate'
        }
    },
    {
        id: 5,
        attributes: {
            title: 'Late Intermediate'
        }
    },
    {
        id: 6,
        attributes: {
            title: 'Advanced'
        }
    },
    {
        id: 7,
        attributes: {
            title: 'Master'
        }
    }
];

export const CDirtyStudentsAges = [
    {
        id: 3,
        attributes: {
            title: 'Adults'
        }
    },
    {
        id: 1,
        attributes: {
            title: 'Children'
        }
    },
    {
        id: 2,
        attributes: {
            title: 'Teens'
        }
    }
];

export const CDirtyStudentTypes = [
    {
        id: 1,
        attributes: {
            title: 'Ambitious Students'
        }
    },
    {
        id: 2,
        attributes: {
            title: 'Average Students'
        }
    },
    {
        id: 3,
        attributes: {
            title: 'Students About to Quit'
        }
    },
    {
        id: 4,
        attributes: {
            title: 'Unmotivated Students'
        }
    }
];

export const CSorts = [
    'Title (A-Z)',
    'Title (Z-A)',
    'Level (Easy-Hard)',
    'Level (Hard-Easy)',
    'Composer (A-Z)',
    'Composer (Z-A)',
    'Era (Old-New)',
    'Era (New-Old)'
];

export interface IFilterOption {
    filterName: string;
    apiField: string;
    apiEndpoint: string;
    apiEndpointFilters: string;
    apiEndpointPageSize: number;
    apiTitleOrName: string;
    apiSort: string;
    placeholder: string;
    queryKey: string;
    filterID: string;
};

export const CFilterOptionsElements: IFilterOption[] = [
    {
        filterName: 'Category',
        apiField: 'element_categories',
        apiEndpoint: 'element-categories',
        apiEndpointFilters: '&fields[0]=name&populate[elements][fields][1]=id&filters[elements][publishedAt][$null]=false',
        apiEndpointPageSize: 11,
        apiTitleOrName: 'name',
        apiSort: 'name:asc',
        placeholder: 'Select an category',
        queryKey: 'category',
        filterID: 'elementCategoryFilter'
    },
    {
        filterName: 'Level',
        apiField: 'level',
        apiEndpoint: 'levels',
        apiEndpointFilters: '&fields[0]=title&populate[elements][fields][1]=id&filters[elements][publishedAt][$null]=false',
        apiEndpointPageSize: 7,
        apiTitleOrName: 'title',
        apiSort: 'id:asc',
        placeholder: 'Select a level',
        queryKey: 'level',
        filterID: 'levelFilter'
    },
];

export interface IFilterKey {
    oldKey: string;
    prefix: string;
    newKey: string;
    label: string;
    filter: string;
};

export const CFilterKeys: IFilterKey[] = [
    {
        oldKey: 'query',
        prefix: 'musicWorks',
        newKey: 'q',
        label: 'Search Term',
        filter: 'textQuery'
    },
    {
        oldKey: 'elements',
        prefix: 'musicWorks[refinementList]',
        newKey: 'category',
        label: 'Category',
        filter: 'elementCategoryFilter'
    },
    {
        oldKey: 'levels',
        prefix: 'musicWorks[refinementList]',
        newKey: 'level',
        label: 'Level',
        filter: 'levelFilter'
    },
];

export interface IItemKey {
    label: string;
    labelPlural: string;
    value: string;
    apiEndpointFilters: string;
    apiEndpointPageSize: number;
    apiTitleOrName: string;
    apiSort: string;
    sortOptions: Array<{ label: string; value: string }>;
    cleanFiltersOptions: Array<{ label: string; value: string }>;
    cleanFilterOptions: string[];
    textSearchOptions: string[];
    pageLink: EUrlsPages;
};

export const CItemKeys: IItemKey[] = [
    {
        label: 'Work',
        labelPlural: 'Works',
        value: 'works',
        apiEndpointFilters: '&populate[composers][fields][0]=name&populate[level][fields][1]=title&populate[eras][fields][2]=name&populate[eras][fields][3]=order&populate[works][fields][4]=id&fields[0]=title&filters[works][publishedAt][$null]=false&publicationState=live',
        apiEndpointPageSize: 411, // Updated 2025-05-14 - Total Works= 4111
        apiTitleOrName: 'title',
        apiSort: 'title:asc',
        sortOptions: [
            { label: 'Title (A-Z)', value: 'title:asc' },
            { label: 'Title (Z-A)', value: 'title:desc' },
            { label: 'Level (Easy-Hard)', value: 'levels.title:asc' },
            { label: 'Level (Hard-Easy)', value: 'levels.title:desc' },
            { label: 'Composer (A-Z)', value: 'composers.name:asc' },
            { label: 'Composer (Z-A)', value: 'composers.name:desc' },
            { label: 'Era (Old-New)', value: 'eras.order:asc' },
            { label: 'Era (New-Old)', value: 'eras.order:desc' }
        ],
        cleanFilterOptions: [
            'elements',
            'composers',
            'levels',
            'eras',
            'instrumentations',
            'holidays',
            'student_ages',
            'student_types',
            'key_signatures',
            'time_signatures'
        ],
        cleanFiltersOptions: [
            { label: 'Element', value: '[elements][name]' },
            { label: 'Composer', value: '[composers][name]' },
            { label: 'Level', value: '[levels][title]' },
            { label: 'Era', value: '[eras][name]' },
        ],
        textSearchOptions: [
            '[title]',
            '[composers][name]',
            '[level][title]',
            '[eras][name]',
        ],
        pageLink: EUrlsPages.SEARCH
    },
    {
        label: 'Element',
        labelPlural: 'Elements',
        value: 'elements',
        apiEndpointFilters: '&populate[element_categories][fields][0]=name&populate[levels][fields][1]=title&populate[illustration][fields][2]=height&populate[illustration][fields][3]=width&populate[illustration][fields][4]=url&populate[works][fields][5]=id&fields[0]=name&fields[1]=nameAlt&fields[2]=description&filters[publishedAt][$notNull]=true&publicationState=live',
        apiEndpointPageSize: 362, // Updated 2025-05-14
        apiTitleOrName: 'name',
        apiSort: 'name:asc',
        sortOptions: [
            { label: 'Name (A-Z)', value: 'name:asc' },
            { label: 'Name (Z-A)', value: 'name:desc' },
            { label: 'Category (A-Z)', value: 'element_categories.name:asc' },
            { label: 'Category (Z-A)', value: 'element_categories.name:desc' },
            { label: 'Level (Easy-Hard)', value: 'levels.id:asc' },
            { label: 'Level (Hard-Easy)', value: 'levels.id:desc' }
        ],
        cleanFilterOptions: [
            '[element_categories][name]',
            '[levels][title]'
        ],
        cleanFiltersOptions: [
            { label: 'Category', value: '[element_categories][name]' },
            { label: 'Level', value: '[levels][title]' }
        ],
        textSearchOptions: [
            '[name]',
            '[nameAlt]',
            '[description]',
            '[element_categories][name]',
            '[levels][title]',
        ],
        pageLink: EUrlsPages.ELEMENTS
    },
    {
        label: 'Composer',
        labelPlural: 'Composers',
        value: 'composers',
        apiEndpointFilters: '&fields[0]=name&populate[works][fields][1]=id&filters[works][publishedAt][$null]=false&publicationState=live',
        apiEndpointPageSize: 502, // Updated 2025-05-14
        apiTitleOrName: 'name',
        apiSort: 'name:asc',
        sortOptions: [
            { label: 'Name (A-Z)', value: 'name:asc' },
            { label: 'Name (Z-A)', value: 'name:desc' }
        ],
        cleanFilterOptions: [
            '[eras][name]',
        ],
        cleanFiltersOptions: [
            { label: 'Era', value: '[eras][name]' },
        ],
        textSearchOptions: [
            '[name]',
        ],
        pageLink: EUrlsPages.COMPOSERS
    },
    {
        label: 'Collection',
        labelPlural: 'Collections',
        value: 'collections',
        apiEndpointFilters: '&fields[0]=title&populate[works][fields][1]=id&filters[works][publishedAt][$null]=false&publicationState=live',
        apiEndpointPageSize: 339, // Updated 2025-05-14
        apiTitleOrName: 'title',
        apiSort: 'title:asc',
        sortOptions: [
            { label: 'Title (A-Z)', value: 'title:asc' },
            { label: 'Title (Z-A)', value: 'title:desc' }
        ],
        cleanFilterOptions: [
            '[eras][name]',
        ],
        cleanFiltersOptions: [
            { label: 'Title', value: '[title]' },
            { label: 'Catalogue Number', value: '[catalogue_number]' },
            { label: 'Description', value: '[description]' },
            { label: 'ISBN 10', value: '[isbn_10]' },
            { label: 'ISBN 13', value: '[isbn_13]' }
        ],
        textSearchOptions: [
            '[title]',
            '[catalogue_number]',
            '[description]',
            '[isbn_10]',
            '[isbn_13]',
            '[eras][name]',
        ],
        pageLink: EUrlsPages.COLLECTIONS
    },
    {
        label: 'Publisher',
        labelPlural: 'Publishers',
        value: 'publishers',
        apiEndpointFilters: '&fields[0]=name&populate[works][fields][1]=id&filters[works][publishedAt][$null]=false&publicationState=live',
        apiEndpointPageSize: 41, // Updated 2025-05-14
        apiTitleOrName: 'name',
        apiSort: 'name:asc',
        sortOptions: [
            { label: 'Name (A-Z)', value: 'name:asc' },
            { label: 'Name (Z-A)', value: 'name:desc' }
        ],
        cleanFilterOptions: [
            '[eras][name]',
        ],
        cleanFiltersOptions: [
            { label: 'Era', value: '[eras][name]' },
        ],
        textSearchOptions: [
            '[name]',
            '[excerpt]',
        ],
        pageLink: EUrlsPages.PUBLISHERS
    },
];