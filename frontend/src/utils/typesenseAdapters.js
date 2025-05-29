import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
const Typesense = require('typesense');

export const typesenseInstantsearchDesktopAdapter =
    new TypesenseInstantSearchAdapter(
        {
            server: {
                apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? '', // API Key should be search/read-only!
                nodes: [
                    {
                        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST ?? '',
                        port: process.env.NEXT_PUBLIC_TYPESENSE_PORT
                            ? +process.env.NEXT_PUBLIC_TYPESENSE_PORT
                            : 8108,
                        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL ?? ''
                    }
                ]
            },
            additionalSearchParameters: {
                query_by: 'title,composers,level,era,elements,collections,publisher,moods,styles,themes,holiday,student_ages,student_types,key_signatures',
                sort_by: 'title(missing_values: last):asc,level(missing_values: last):asc',
                num_typos: 2,
                typo_tokens_threshold: 2,
                drop_tokens_threshold: 2,
                per_page: 28
            }
        }
    );

export const typesenseInstantsearchMobileAdapter =
    new TypesenseInstantSearchAdapter(
        {
            server: {
                apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? '', // API Key should be search/read-only!
                nodes: [
                    {
                        host: process.env.NEXT_PUBLIC_TYPESENSE_HOST ?? '',
                        port: process.env.NEXT_PUBLIC_TYPESENSE_PORT
                            ? +process.env.NEXT_PUBLIC_TYPESENSE_PORT
                            : 8108,
                        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL ?? ''
                    }
                ]
            },
            additionalSearchParameters: {
                query_by: 'title,composers,level,era,elements,collections,publisher,moods,styles,themes,holiday,student_ages,student_types,key_signatures',
                sort_by: 'title(missing_values: last):asc,level(missing_values: last):asc',
                num_typos: 2,
                typo_tokens_threshold: 2,
                drop_tokens_threshold: 2,
                per_page: 10
            }
        }
    );

export const typesense = new Typesense.Client(
    {
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY ?? '', // API Key should be search/read-only!
        nodes: [
            {
                host: process.env.NEXT_PUBLIC_TYPESENSE_HOST ?? '',
                port: process.env.NEXT_PUBLIC_TYPESENSE_PORT
                    ? +process.env.NEXT_PUBLIC_TYPESENSE_PORT
                    : 8108,
                protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL ?? ''
            }
        ],
        numRetries: 8,
        connectionTimeoutSeconds: 10
    }
);
