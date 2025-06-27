//pages/sitemap-collections.xml.js
import { EUrlsPages } from "@src/constants";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let collections;
try {
  collections = require("@src/sitemap/collections.json");
} catch (error) {
  console.error("Error loading collections:", error);
  collections = null;
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
  if (!collections) return "";
  let payload = "";
  collections.forEach((collection) => {
    let collectionURL = "";
    if (collection.attributes.title) {
      const collectionTitle = collection.attributes.title;
      collectionURL = encodeURIComponent(collectionTitle);
    } else {
      collectionURL = "";
    }

    payload += `<url>
      <loc>${siteUrl}/${EUrlsPages.COLLECTION}/${collectionURL}?id=${collection.id}</loc>
      <lastmod>${collection.attributes.updatedAt}</lastmod>
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
