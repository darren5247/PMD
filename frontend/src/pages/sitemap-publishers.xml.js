//pages/sitemap-publishers.xml.js
import { EUrlsPages } from "@src/constants";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let publishers;
try {
  publishers = require("@src/sitemap/publishers.json");
} catch (error) {
  console.error("Error loading publishers:", error);
  publishers = null;
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
  if (!publishers) return "";
  let payload = "";
  publishers.forEach((publisher) => {
    let publisherURL = "";
    if (publisher.attributes.name) {
      const publisherName = publisher.attributes.name;
      publisherURL = encodeURIComponent(publisherName);
    } else {
      publisherURL = "";
    }

    payload += `<url>
      <loc>${siteUrl}/${EUrlsPages.PUBLISHER}/${publisherURL}?id=${publisher.id}</loc>
      <lastmod>${publisher.attributes.updatedAt}</lastmod>
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
