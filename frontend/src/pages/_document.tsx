import Document, { Head, Html, Main, NextScript } from "next/document";
// import Script from 'next/script';
import ScriptLoaderGTMPost from "@src/components/ScriptLoaderGTMPost";

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" className="bg-pmdRed text-white">
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
          />
          <link
            rel="stylesheet"
            type="text/css"
            href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
          />
          <meta
            name="p:domain_verify"
            content="a951d59f61ef0cf4fea3d86133b48ade"
          />
          {/* <Script id='umami' defer={true} strategy='beforeInteractive' src="https://cloud.umami.is/script.js" data-website-id="6f21c976-77c5-41bb-bdee-bb1cf3e3bf75"></Script> */}
        </Head>

        <body className="relative">
          <div id="modal-root" className="top-0 left-0 z-50 sticky h-0"></div>
          <Main />
          <NextScript />
          <ScriptLoaderGTMPost />
        </body>
      </Html>
    );
  }
}
