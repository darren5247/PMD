import { FC } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { Oval } from 'react-loader-spinner';

const InstantSearchLoading: FC = () => {
  const { status } = useInstantSearch();

  if (status === 'loading' || status === 'stalled')
    return (
      <Oval
        height={80}
        width={80}
        color='#7f1d1d'
        wrapperClass='fixed z-30 w-screen h-screen flex items-center justify-center bg-white overflow-hidden'
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#a8a29e'
      />
    );
  return null;
};

export default InstantSearchLoading;
