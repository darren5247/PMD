//pages/sitemap-elements.xml.js
import { EUrlsPages } from "@src/constants";
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let elements;
try {
  elements = require("@src/sitemap/elements.json");
} catch (error) {
  console.error("Error loading elements:", error);
  elements = null;
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
  if (!elements) return "";
  let payload = "";
  elements.forEach((element) => {
    let elementURL = "";
    if (element.attributes.name) {
      const elementName = element.attributes.name;
      elementURL = encodeURIComponent(elementName);
    } else {
      elementURL = "";
    }

    payload += `<url>
      <loc>${siteUrl}/${EUrlsPages.ELEMENT}/${elementURL}?id=${element.id}</loc>
      <lastmod>${element.attributes.updatedAt}</lastmod>
      <changefreq>monthly</changefreq>
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
