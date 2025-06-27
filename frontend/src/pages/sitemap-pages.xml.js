//pages/sitemap-pages.xml.js
const siteUrl =
  process.env.NEXT_PUBLIC_DOMAIN_URL || "https://pianomusicdatabase.com";

let pages;
try {
  pages = require("@src/sitemap/pages.json");
} catch (error) {
  console.error("Error loading pages:", error);
  pages = null;
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
  if (!pages) return "";
  let payload = "";
  pages.forEach((page) => {
    let pageURL = "";
    if (page.attributes.slug) {
      const pageName = page.attributes.slug;
      pageURL = encodeURIComponent(pageName);
    } else {
      pageURL = "";
    }

    payload += `<url>
      <loc>${siteUrl}/${pageURL}</loc>
      <lastmod>${page.attributes.updatedAt}</lastmod>
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
