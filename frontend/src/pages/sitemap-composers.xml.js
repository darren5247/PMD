//pages/sitemap-composers.xml.js
import { EUrlsPages } from "@src/constants";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let composers;
try {
  composers = require("@src/sitemap/composers.json");
} catch (error) {
  console.error("Error loading composers:", error);
  composers = null;
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
  if (!composers) return "";
  let payload = "";
  composers.forEach((composer) => {
    let composerURL = "";
    if (composer.attributes.name) {
      const composerName = composer.attributes.name;
      composerURL = encodeURIComponent(composerName);
    } else {
      composerURL = "";
    }

    payload += `<url>
      <loc>${siteUrl}/${EUrlsPages.COMPOSER}/${composerURL}?id=${composer.id}</loc>
      <lastmod>${composer.attributes.updatedAt}</lastmod>
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
