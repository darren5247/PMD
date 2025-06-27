//pages/sitemap-works.xml.js
import { EUrlsPages } from "@src/constants";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let works;
try {
  works = require("@src/sitemap/works.json");
} catch (error) {
  console.error("Error loading works:", error);
  works = null;
}

function generateSiteMap(data) {
  return (
    `<?xml version='1.0' encoding='UTF-8'?>
<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9' xmlns:xhtml='http://www.w3.org/1999/xhtml' xmlns:mobile='http://www.google.com/schemas/sitemap-mobile/1.0'>` +
    data +
    `
   </urlset>
 `
  );
}

function generateWorksXML() {
  if (!works) return "";
  let payload = "";
  works.forEach((work) => {
    let workComposers;
    let workComposersRaw;
    if (work.attributes.composers?.data?.length) {
      workComposers = "";
      workComposersRaw = work.attributes.composers?.data;
      workComposersRaw.forEach((composer) => {
        if (workComposers) {
          if (workComposersRaw.length == 2) {
            workComposers = workComposers + " and " + composer.attributes.name;
          } else {
            workComposers = workComposers + ", " + composer.attributes.name;
          }
        } else {
          workComposers = composer.attributes.name;
        }
      });
    } else {
      workComposers = "";
    }

    let titleSaved;
    let workTitleEncoded;
    let workURL;
    if (work.attributes.title) {
      titleSaved = work.attributes.title;
      workTitleEncoded =
        encodeURIComponent(titleSaved) +
        "-" +
        encodeURIComponent(workComposers);
      workURL =
        siteUrl +
        "/" +
        EUrlsPages.WORK +
        "/" +
        workTitleEncoded +
        "?id=" +
        work.id;
    } else {
      titleSaved = "";
      workTitleEncoded = "";
      workURL = "";
    }

    payload += `<url>
      <loc>${workURL}</loc>
      <lastmod>${work.attributes.updatedAt}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
      </url>`;
  });
  return payload;
}

export async function getServerSideProps({ res }) {
  // Generate the XML
  const xml = generateWorksXML();

  // Generate the sitemap
  const sitemap = generateSiteMap(xml);

  res.setHeader("Content-Type", "text/xml");
  // Send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

function SiteMap() {}

export default SiteMap;
