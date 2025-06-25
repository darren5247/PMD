import { FC } from 'react';
import Head from 'next/head';

interface IPageHeadProps {
  title: string | undefined;
  description: string | undefined;
  url: string | undefined;
  image: string | undefined;
}

const PageHead: FC<IPageHeadProps> = ({
  title,
  description,
  url,
  image
}): JSX.Element => {
  const siteUrl = process.env.NEXT_PUBLIC_DOMAIN_URL || 'https://pianomusicdatabase.com';
  const titleValid = title ? title : 'Piano Music Database - Find the Perfect Piece';
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
  const descriptionValid = description
    ? (() => {
        const clean = stripHtml(description);
        return clean.length > 157 ? clean.slice(0, 157) + '...' : clean;
      })()
    : 'Piano Music Database is a search engine and database of pedagogical repertoire (level, element, mood, style, and more) built for piano teachers. Find the perfect piece on PianoMusicDatabase.com.';
  const urlValid = url ? url : '';
  const imageValid = image ? image : (siteUrl + '/pmd.png');
  const imageAltValid = image ? titleValid : 'Banner for PianoMusicDatabase.com with centered red logo on white background';
  return (
    <Head>
      <meta charSet='UTF-8' />
      <meta name='robots' content='max-snippet:-1,max-image-preview:standard,max-video-preview:-1' />

      <meta property='og:locale' content='en_US' />
      <meta property='og:type' content='website' />
      <title>{titleValid}</title>
      <meta property='og:title' key='title' content={titleValid} />
      <meta property='og:description' content={descriptionValid} />
      <meta name='description' content={descriptionValid} />
      <meta property='og:url' content={siteUrl + '/' + urlValid} />
      <meta property='og:site_name' content='Piano Music Database' />
      <meta property='og:image' content={imageValid} />
      <meta property='og:image:width' content='1920' />
      <meta property='og:image:height' content='1080' />
      <meta property='og:image:alt' content={imageAltValid} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:site' content='@PianoMusicDB' />
      <meta name='twitter:title' content={titleValid} />
      <meta name='twitter:description' content={descriptionValid} />
      <meta name='twitter:image' content={imageValid} />
      <meta name='twitter:image:width' content='1920' />
      <meta name='twitter:image:height' content='1080' />
      <meta name='twitter:image:alt' content={imageAltValid} />

      <link rel='icon' href={siteUrl + '/favicon.ico'} />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#7f1d1d' />
      <link rel='manifest' href={siteUrl + '/manifest.webmanifest'} />
      <meta name='apple-mobile-web-app-title' content='Piano Music Database' />
      <meta name='application-name' content='Piano Music Database' />
      <meta name='msapplication-TileColor' content='#7f1d1d' />
      <meta name='msapplication-TileImage' content={siteUrl + '/mstile-144x144.png'} />
      <meta name='theme-color' content='#7f1d1d' />
    </Head>
  );
};

export default PageHead;