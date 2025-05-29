import { FC } from 'react';
import cn from 'classnames';
import { useScrollPosition } from '@src/common/hooks';
import PageHead from '@src/components/PageHead';
import Header from '@src/components/Header';
import LandingText from '@src/components/LandingText';
import Footer from '@src/components/Footer';
import Layout from '@src/components/Layout';
import Content from '@src/components/Content';

interface IPageProps {
  children?: JSX.Element[] | JSX.Element;
  className?: string;
  classNameMain?: string;
  url?: string;
  title?: string;
  description?: string;
  image?: string;
  queries?: string | undefined;
  showBackBar: boolean;
  showBackBarShare?: boolean;
  showBackBarFeedback?: boolean;
  showLevelBar?: boolean;
  urlShare?: string;
  prevUrl?: string;
};

export const Page: FC<IPageProps> = ({
  children,
  className,
  classNameMain,
  url,
  title,
  description,
  image,
  queries,
  showBackBar,
  showBackBarShare,
  showBackBarFeedback,
  showLevelBar,
  urlShare,
  prevUrl
}): JSX.Element => {
  const scrollPos = useScrollPosition();

  const urlChecked = url ? url : '';
  const titleChecked = title ? title : '';
  const descriptionChecked = description ? description : '';
  const imageChecked = image ? image : '';

  return (
    <>
      <PageHead
        url={urlChecked}
        title={titleChecked}
        description={descriptionChecked}
        image={imageChecked}
      />
      <Layout className={cn('flex scrollbar', className)}>
        {urlShare ? (
          <Header showBackBar={showBackBar} showBackBarShare={showBackBarShare} showBackBarFeedback={showBackBarFeedback} showLevelBar={showLevelBar} prevUrl={prevUrl} currentUrl={urlChecked} urlShare={urlShare} title={titleChecked} />
        ) : (
          <Header showBackBar={showBackBar} showBackBarShare={showBackBarShare} showBackBarFeedback={showBackBarFeedback} showLevelBar={showLevelBar} prevUrl={prevUrl} currentUrl={urlChecked} title={titleChecked} />
        )}
        <LandingText queries={queries} />
        <Content className={cn('max-w-[1200px] mx-auto px-4 mb-20 lg:mb-28',
          classNameMain,
          {
            'mt-32 lg:mt-34': !showBackBar
          },
          {
            'mt-36 lg:mt-34': showBackBar
          },
          {
            'mt-36 lg:mt-34': showBackBar && showLevelBar
          },
          {
            'mt-36 lg:mt-34': scrollPos > 1
          }
        )}>
          {children}
        </Content>
        <Footer url={urlChecked} title={titleChecked} />
      </Layout>
    </>
  );
};

export default Page;
