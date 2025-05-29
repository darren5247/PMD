import { FC } from 'react';
import cn from 'classnames';
import { useRouter } from 'next/router';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import Form from '@src/components/Form';
import Field from '@src/components/Field';
import SearchInput from '@src/components/SearchInput';
import InstantSearchInput from './components/InstantSearchInput';
import { EUrlsPages } from '@src/constants';

interface ISearchFormProps {
  className?: string;
};

interface ISearchForm {
  search: string;
};

type TSearchForm = ISearchForm | FieldValues;

const SearchForm: FC<ISearchFormProps> = ({ className }): JSX.Element => {
  const router = useRouter();
  const { control, handleSubmit, formState } = useForm<TSearchForm>();
  const handleSearch: SubmitHandler<TSearchForm> = ({ search }) => {
    if (router?.route === EUrlsPages.SEARCH) return;
    router.push({
      pathname: `/${EUrlsPages.SEARCH}`,
      query: { 'musicWorks[query]': search }
    }, undefined, { shallow: false });
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit(handleSearch)}
        className={cn(
          'mx-3.5 w-full',
          className,
        )}
      >
        {router?.route === `/${EUrlsPages.SEARCH}` ? (
          <InstantSearchInput />
        ) : (
          <Field
            name={'search'}
            component={SearchInput}
            control={control}
            formState={formState}
            placeholder='Search for piano music by element, level, mood, style, and more!'
            className={'mt-0'}
          />
        )}
      </Form>
    </>
  );
};

export default SearchForm;
